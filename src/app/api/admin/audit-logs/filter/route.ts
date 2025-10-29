/**
 * Admin Audit Logs Filter API - فلترة سجلات التدقيق
 * Advanced filtering for audit logs in admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or supervisor only
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Filter parameters
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action'); // create, update, delete, login, etc.
    const resource = searchParams.get('resource'); // users, patients, appointments, etc.
    const status = searchParams.get('status'); // success, failed, warning
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await createClient();

    // Build dynamic query
    let query = supabase
      .from('audit_logs')
      .select(`
        id,
        action,
        resource_type,
        resource_id,
        user_id,
        details,
        ip_address,
        user_agent,
        status,
        created_at,
        users (
          full_name,
          email,
          role
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`
        action.ilike.%${search}%,
        resource_type.ilike.%${search}%,
        details.ilike.%${search}%,
        users.full_name.ilike.%${search}%,
        users.email.ilike.%${search}%
      `);
    }

    if (action) {
      query = query.eq('action', action);
    }

    if (resource) {
      query = query.eq('resource_type', resource);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: auditLogs, error: auditError, count } = await query;

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
      return NextResponse.json({ 
        error: 'Failed to fetch audit logs',
        details: auditError.message 
      }, { status: 500 });
    }

    // Transform data
    const transformedLogs = (auditLogs || []).map((log: any) => ({
      id: log.id,
      user: log.users?.full_name || log.users?.email || 'مستخدم غير معروف',
      userRole: log.users?.role || '',
      action: getActionDisplayName(log.action),
      resource: getResourceDisplayName(log.resource_type),
      details: extractDetails(log.details),
      ipAddress: log.ip_address,
      userAgent: formatUserAgent(log.user_agent),
      status: log.status || 'success',
      timestamp: formatTimestamp(log.created_at),
      rawTimestamp: log.created_at
    }));

    // Get aggregated statistics
    const stats = await getAuditStats(supabase, { 
      search, action, resource, status, userId, startDate, endDate 
    });

    return NextResponse.json({
      success: true,
      data: transformedLogs,
      stats,
      meta: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
        filters: {
          search,
          action,
          resource,
          status,
          userId,
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    console.error('Error in audit logs filter API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function getDateRanges(period: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      return {
        startDate: weekStart.toISOString(),
        endDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString()
      };
    
    case 'year':
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      return {
        startDate: yearStart.toISOString(),
        endDate: yearEnd.toISOString()
      };
    
    default:
      return getDateRanges('month');
  }
}

function getActionDisplayName(action: string): string {
  const actionNames: Record<string, string> = {
    create: 'إنشاء',
    update: 'تحديث',
    delete: 'حذف',
    login: 'تسجيل دخول',
    logout: 'تسجيل خروج',
    view: 'عرض',
    export: 'تصدير',
    import: 'استيراد'
  };
  return actionNames[action] || action;
}

function getResourceDisplayName(resource: string): string {
  const resourceNames: Record<string, string> = {
    users: 'المستخدمين',
    patients: 'المرضى',
    appointments: 'المواعيد',
    sessions: 'الجلسات',
    payments: 'المدفوعات',
    insurance_claims: 'مطالبات التأمين',
    medical_records: 'السجلات الطبية',
    settings: 'الإعدادات'
  };
  return resourceNames[resource] || resource;
}

function extractDetails(details: any): string {
  try {
    if (typeof details === 'string') {
      const parsed = JSON.parse(details);
      return parsed.description || parsed.message || details;
    }
    return details?.description || details?.message || 'لا توجد تفاصيل';
  } catch {
    return details?.toString() || 'لا توجد تفاصيل';
  }
}

function formatUserAgent(userAgent: string): string {
  if (!userAgent) return 'غير محدد';
  
  // Extract browser info
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'متصفح آخر';
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

async function getAuditStats(supabase: any, filters: any) {
  // Get total counts by status
  const { data: statusCounts } = await supabase
    .from('audit_logs')
    .select('status, id')
    .gte('created_at', filters.startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const stats = {
    total: statusCounts?.length || 0,
    success: statusCounts?.filter((log: any) => log.status === 'success').length || 0,
    failed: statusCounts?.filter((log: any) => log.status === 'failed').length || 0,
    warning: statusCounts?.filter((log: any) => log.status === 'warning').length || 0
  };

  return stats;
}

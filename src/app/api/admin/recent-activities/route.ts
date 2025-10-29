/**
 * Admin Recent Activities API - النشاطات الأخيرة في لوحة الإدارة
 * Real-time activities feed for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin, manager, or supervisor
    const authResult = await requireAuth(['admin', 'manager', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // appointment, claim, patient, staff, payment

    const supabase = await createClient();

    // Get recent activities from audit_logs and system events
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
        created_at,
        users (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // Filter by activity type if provided
    if (type) {
      query = query.eq('resource_type', type);
    }

    const { data: auditLogs, error: auditError } = await query;

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
      return NextResponse.json({ 
        error: 'Failed to fetch activities',
        details: auditError.message 
      }, { status: 500 });
    }

    // Transform audit logs to activity format
    const activities = (auditLogs || []).map((log: any) => ({
      id: log.id,
      type: mapResourceTypeToActivityType(log.resource_type),
      title: generateActivityTitle(log.action, log.resource_type),
      description: generateActivityDescription(log),
      timestamp: formatTimestamp(log.created_at),
      status: getActivityStatus(log.action),
      user: log.users?.full_name || log.users?.email || 'مستخدم غير معروف',
      details: log.details
    }));

    // Get additional system activities from appointments, patients, etc.
    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        appointment_date,
        created_at,
        patients (full_name),
        doctors (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Transform appointments to activities
    const appointmentActivities = (recentAppointments || []).map((apt: any) => ({
      id: `apt-${apt.id}`,
      type: 'appointment',
      title: apt.status === 'scheduled' ? 'موعد جديد' : 'تحديث موعد',
      description: `موعد ${apt.patients?.full_name} مع ${apt.doctors?.full_name}`,
      timestamp: formatTimestamp(apt.created_at),
      status: apt.status === 'scheduled' ? 'success' : 'info',
      details: apt
    }));

    // Combine all activities
    const allActivities = [...activities, ...appointmentActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: allActivities,
      meta: {
        total: allActivities.length,
        limit,
        offset,
        hasMore: allActivities.length === limit
      }
    });

  } catch (error) {
    console.error('Error in recent activities API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function mapResourceTypeToActivityType(resourceType: string): string {
  const mapping: Record<string, string> = {
    'appointments': 'appointment',
    'patients': 'patient', 
    'staff': 'staff',
    'users': 'staff',
    'payments': 'payment',
    'insurance_claims': 'claim'
  };
  return mapping[resourceType] || 'info';
}

function generateActivityTitle(action: string, resourceType: string): string {
  const titleMap: Record<string, Record<string, string>> = {
    create: {
      appointments: 'موعد جديد',
      patients: 'مريض جديد',
      users: 'مستخدم جديد',
      payments: 'دفعة جديدة',
      insurance_claims: 'مطالبة تأمين جديدة'
    },
    update: {
      appointments: 'تحديث موعد',
      patients: 'تحديث بيانات مريض',
      users: 'تحديث مستخدم',
      payments: 'تحديث دفعة'
    },
    delete: {
      appointments: 'إلغاء موعد',
      patients: 'حذف مريض',
      users: 'حذف مستخدم'
    }
  };

  return titleMap[action]?.[resourceType] || `${action} ${resourceType}`;
}

function generateActivityDescription(log: any): string {
  try {
    const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
    return details?.description || details?.message || `تم ${log.action} ${log.resource_type}`;
  } catch {
    return `تم ${log.action} ${log.resource_type}`;
  }
}

function getActivityStatus(action: string): 'success' | 'warning' | 'error' | 'info' {
  const statusMap: Record<string, string> = {
    create: 'success',
    update: 'info',
    delete: 'warning',
    login: 'success',
    logout: 'info',
    failed_login: 'error'
  };
  return (statusMap[action] || 'info') as 'success' | 'warning' | 'error' | 'info';
}

function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return 'الآن';
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `منذ ${diffDays} يوم`;
}

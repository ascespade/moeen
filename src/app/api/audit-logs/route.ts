/**
 * Audit Logs API - سجلات التدقيق
 * Retrieve and manage audit logs for system monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { authorize, requireRole } from '@/lib/auth/authorize';

const auditQuerySchema = z.object({
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    // Authorize supervisor or admin
    const { user: authUser, error: authError } = await authorize(request);
    if (authError || !authUser || !requireRole(['supervisor', 'admin'])(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const validation = ValidationHelper.validate(auditQuerySchema, {
      action: searchParams.get('action'),
      entityType: searchParams.get('entityType'),
      userId: searchParams.get('userId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { action, entityType, userId, startDate, endDate, page, limit } = validation.data;

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(id, email, fullName, role)
      `)
      .order('createdAt', { ascending: false })
      .range(((page || 1) - 1) * (limit || 20), (page || 1) * (limit || 20) - 1);

    if (action) {
      query = query.eq('action', action);
    }
    if (entityType) {
      query = query.eq('entityType', entityType);
    }
    if (userId) {
      query = query.eq('userId', userId);
    }
    if (startDate) {
      query = query.gte('createdAt', startDate);
    }
    if (endDate) {
      query = query.lte('createdAt', endDate);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / (limit || 20)),
      },
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
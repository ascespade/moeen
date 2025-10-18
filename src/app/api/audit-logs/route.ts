
/**
 * Audit Logs API - سجلات التدقيق
 * Retrieve and manage audit logs for system monitoring
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let auditQuerySchema = z.object({
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize supervisor or admin
    let authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);

    let validation = ValidationHelper.validate(auditQuerySchema, {
      action: searchParams.get('action'),
      entityType: searchParams.get('entityType'),
      userId: searchParams.get('userId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      page: parseInt(searchParams.get('page', 10) || '1'),
      limit: parseInt(searchParams.get('limit', 10) || '20')
    });

    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    const action, entityType, userId, startDate, endDate, page, limit = validation.data!;

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(id, email, fullName, role)
      `
      .order('createdAt', { ascending: false })
      .range((page! - 1) * limit, page! * limit - 1);

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

    const data: logs, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

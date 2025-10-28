/**
 * Admin Security Events API - أحداث الأمان
 * Manage security events and audit logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or supervisor
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const success = searchParams.get('success');

    let query = supabase
      .from('audit_logs')
      .select(
        `
        id,
        action,
        entityType,
        entityId,
        userId,
        metadata,
        createdAt,
        user:users(id, email, profile)
      `
      )
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (action) {
      query = query.eq('action', action);
    }

    const { data: events, error, count } = await query;

    if (error) {
      console.error('Error fetching security events:', error);
      // Return mock data if table doesn't exist
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No security events found',
      });
    }

    return NextResponse.json({
      success: true,
      data: events || [],
      message: 'Security events fetched successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch security events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();

    const { action, entityType, entityId, metadata } = body;

    // Create security event
    const { data: newEvent, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        entityType,
        entityId,
        userId: authResult.user!.id,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create security event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Security event created successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

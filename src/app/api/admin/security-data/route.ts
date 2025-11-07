/**
 * Admin Security Data API
 * بيانات الأمان - بيانات حقيقية من قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get security events from audit_logs
    const { data: events, error: eventsError } = await supabase
      .from('audit_logs')
      .select(
        `
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
      `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    // Get active sessions from sessions table (if exists) or user sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(
        `
        id,
        user_id,
        ip_address,
        user_agent,
        created_at,
        last_activity,
        users (
          full_name,
          email
        )
      `
      )
      .eq('is_active', true)
      .order('last_activity', { ascending: false })
      .limit(20);

    // Get security policies from database (if table exists)
    const { data: policies, error: policiesError } = await supabase
      .from('security_policies')
      .select('*')
      .eq('is_active', true)
      .order('name');

    // Get security alerts from database (if table exists)
    const { data: alerts, error: alertsError } = await supabase
      .from('security_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: {
        events: events || [],
        sessions: sessions || [],
        policies: policies || [],
        alerts: alerts || [],
      },
      errors: {
        events: eventsError?.message,
        sessions: sessionsError?.message,
        policies: policiesError?.message,
        alerts: alertsError?.message,
      },
    });
  } catch (error) {
    console.error('Error fetching security data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch security data',
        data: {
          events: [],
          sessions: [],
          policies: [],
          alerts: [],
        },
      },
      { status: 500 }
    );
  }
}

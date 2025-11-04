/**
 * Admin Conversations API
 * المحادثات - بيانات حقيقية من قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(['admin', 'supervisor', 'staff'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');

    let query = supabase
      .from('conversations')
      .select(
        `
        *,
        participant:users!conversations_participant_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        assigned_user:users!conversations_assigned_to_fkey (
          id,
          full_name,
          email
        ),
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      `
      )
      .order('updated_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (channel) {
      query = query.eq('channel', channel);
    }

    const { data: conversations, error, count } = await query;

    if (error) {
      console.error('Error fetching conversations:', error);
      // Return empty array if table doesn't exist (no mock data)
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: 'Conversations table not configured yet',
      });
    }

    return NextResponse.json({
      success: true,
      data: conversations || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
        data: [],
      },
      { status: 500 }
    );
  }
}


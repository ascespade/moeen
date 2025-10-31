import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// GET /api/chatbot/conversations - جلب المحادثات
export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const whatsapp_number = searchParams.get('whatsapp_number');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('chatbot_conversations')
      .select(
        `
        *,
        chatbot_messages (
          id,
          sender_type,
          message_text,
          created_at
        )
      `
      )
      .order('last_message_at', { ascending: false });

    if (whatsapp_number) {
      query = query.eq('whatsapp_number', whatsapp_number);
    }

    if (status) {
      query = query.eq('conversation_state', status);
    }

    const { data: conversations, error } = await query;

    if (error) {
      logger.error('Error fetching conversations', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    logger.error('Error in chatbot conversations GET', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/chatbot/conversations - إنشاء محادثة جديدة
export async function POST(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const body = await request.json();
    const {
      whatsapp_number,
      customer_name,
      current_intent_id,
      context_data = {},
    } = body;

    const { data: conversation, error } = await supabaseAdmin
      .from('chatbot_conversations')
      .insert({
        whatsapp_number,
        customer_name,
        current_intent_id,
        context_data,
        conversation_state: 'active',
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating conversation', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    logger.error('Error in chatbot conversations POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/conversations - جلب المحادثات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const whatsapp_number = searchParams.get('whatsapp_number');
    const status = searchParams.get('status');

    let query = supabase
      .from('chatbot_conversations')
      .select(`
        *,
        chatbot_messages (
          id,
          sender_type,
          message_text,
          created_at
        )
      `)
      .order('last_message_at', { ascending: false });

    if (whatsapp_number) {
      query = query.eq('whatsapp_number', whatsapp_number);
    }

    if (status) {
      query = query.eq('conversation_state', status);
    }

    const { data: conversations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/conversations - إنشاء محادثة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsapp_number, customer_name, current_intent_id, context_data = {} } = body;

    const { data: conversation, error } = await supabase
      .from('chatbot_conversations')
      .insert({
        whatsapp_number,
        customer_name,
        current_intent_id,
        context_data,
        conversation_state: 'active'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

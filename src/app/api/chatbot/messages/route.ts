import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/messages - جلب الرسائل
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversation_id = searchParams.get('conversation_id');
    const sender_type = searchParams.get('sender_type');

    let query = supabase
      .from('chatbot_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (conversation_id) {
      query = query.eq('conversation_id', conversation_id);
    }

    if (sender_type) {
      query = query.eq('sender_type', sender_type);
    }

    const { data: messages, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/messages - إرسال رسالة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      whatsapp_message_id,
      sender_type,
      message_text,
      message_type = 'text',
      media_url,
      intent_id,
      confidence_score
    } = body;

    const { data: message, error } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id,
        whatsapp_message_id,
        sender_type,
        message_text,
        message_type,
        media_url,
        intent_id,
        confidence_score,
        is_handled: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // تحديث آخر رسالة في المحادثة
    await supabase
      .from('chatbot_conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/conversations - جلب المحادثات
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let whatsapp_number = searchParams.get('whatsapp_number');
    let status = searchParams.get('status');

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
      `
      .order('last_message_at', { ascending: false });

    if (whatsapp_number) {
      query = query.eq('whatsapp_number', whatsapp_number);
    }

    if (status) {
      query = query.eq('conversation_state', status);
    }

    const data: conversations, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ conversations });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/conversations - إنشاء محادثة جديدة
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const { whatsapp_number, customer_name, current_intent_id, context_data = {} } = body;

    const data: conversation, error = await supabase
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
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ conversation }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

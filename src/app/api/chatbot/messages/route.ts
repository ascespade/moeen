export async function GET(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    const searchParams = new URL(request.url);
    let conversationId = searchParams.get('conversationId') || 'current-conversation';
    let limit = parseInt(searchParams.get('limit', 10) || '50');

    let supabase = await () => ({} as any)();

    // جلب الرسائل من قاعدة البيانات
    const data: messages, error = await supabase
      .from('chatbot_messages')
      .select(`
        id,
        sender_type,
        message_text,
        message_type,
        metadata,
        created_at,
        conversation_id
      `
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      messages: messages || [],
      conversationId
    });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    const conversationId, senderType, messageText, messageType = 'text', metadata = await request.json();

    if (!conversationId || !senderType || !messageText) {
      return import { NextResponse } from "next/server";.json(
        { error: 'conversationId, senderType, and messageText are required' },
        { status: 400 }
      );
    }

    let supabase = await () => ({} as any)();

    // حفظ الرسالة في قاعدة البيانات
    const data: message, error = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        message_text: messageText,
        message_type: messageType,
        metadata: metadata || {},
        is_handled: true
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      message
    });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

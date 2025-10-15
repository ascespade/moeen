import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId') || 'current-conversation';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createClient();

    // جلب الرسائل من قاعدة البيانات
    const { data: messages, error } = await supabase
      .from('chatbot_messages')
      .select(`
        id,
        sender_type,
        message_text,
        message_type,
        metadata,
        created_at,
        conversation_id
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
      conversationId
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, senderType, messageText, messageType = 'text', metadata } = await request.json();

    if (!conversationId || !senderType || !messageText) {
      return NextResponse.json(
        { error: 'conversationId, senderType, and messageText are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // حفظ الرسالة في قاعدة البيانات
    const { data: message, error } = await supabase
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
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
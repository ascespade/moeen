/**
 * Moeen Chatbot API Route
 * مسار API المساعد معين
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { moeenChatbot, type MoeenContext } from '@/lib/chatbot/moeen-core';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const messageSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  userType: z.enum(['patient', 'doctor', 'staff', 'admin']).optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, userId, userType, sessionId } =
      messageSchema.parse(body);

    // Create or get conversation
    let convId = conversationId;
    if (!convId) {
      const session = sessionId || `session_${Date.now()}_${Math.random()}`;
      const { data: conversation, error: convError } = await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: userId || null,
          user_type: userType || null,
          session_id: session,
          status: 'active',
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      convId = conversation.id;
    }

    // Build context
    const context: MoeenContext = {
      conversationId: convId || '',
      userId: userId || undefined,
      userType: userType || undefined,
      sessionId: sessionId || `session_${Date.now()}`,
      history: [],
    };

    // Get conversation history
    const { data: history } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (history) {
      context.history = history.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));
    }

    // Generate response
    const response = await moeenChatbot.generateResponse(message, context);

    // Save user message
    await supabase.from('chatbot_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
      intent: await moeenChatbot.detectIntent(message, context),
      entities: moeenChatbot.extractEntities(message),
    });

    // Save assistant response
    const { data: assistantMessage } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: convId,
        role: 'assistant',
        content: response,
        intent: await moeenChatbot.detectIntent(message, context),
      })
      .select()
      .single();

    // Update conversation
    await supabase
      .from('chatbot_conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', convId);

    return NextResponse.json({
      response,
      conversationId: convId,
      messageId: assistantMessage?.id,
    });
  } catch (error) {
    console.error('Chatbot API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

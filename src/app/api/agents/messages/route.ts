/**
 * API Endpoints for Agent Messages
 * واجهات برمجية للرسائل بين الـ Agents
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAgentCommunication,
  sendAgentMessage,
} from '@/lib/agent/agent-communication';

/**
 * POST /api/agents/messages
 * Send a message from one agent to another
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, type, data } = body;

    if (!from || !to || !type) {
      return NextResponse.json(
        { error: 'from, to, and type are required' },
        { status: 400 }
      );
    }

    const comm = getAgentCommunication();
    const messageId = comm.sendMessage({
      from,
      to,
      type,
      data: data || {},
    });

    return NextResponse.json({
      success: true,
      messageId,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/messages
 * Get messages for an agent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const comm = getAgentCommunication();
    const messages = comm.receiveMessages(agentId);

    return NextResponse.json({
      success: true,
      messages: messages.slice(0, limit),
      count: messages.length,
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

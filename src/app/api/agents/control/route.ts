/**
 * API Endpoints for Agent Control
 * واجهات برمجية للتحكم في الـ Agents
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAgentCommunication,
  registerAgent,
  sendAgentMessage,
} from '@/lib/agent/agent-communication';

/**
 * GET /api/agents/control
 * Get status of all agents or a specific agent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    const comm = getAgentCommunication();

    if (agentId) {
      // Get specific agent status
      const status = comm.getAgentStatus(agentId);
      if (!status) {
        return NextResponse.json(
          { error: `Agent ${agentId} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(status);
    } else {
      // Get all agent statuses
      const statuses = comm.getAllAgentStatuses();
      return NextResponse.json(statuses);
    }
  } catch (error) {
    console.error('Error getting agent status:', error);
    return NextResponse.json(
      { error: 'Failed to get agent status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/control
 * Control an agent (start, stop, pause, resume)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentId, ...options } = body;

    if (!action || !agentId) {
      return NextResponse.json(
        { error: 'action and agentId are required' },
        { status: 400 }
      );
    }

    const comm = getAgentCommunication();

    switch (action) {
      case 'start':
        registerAgent(agentId, options.name || agentId, {
          status: 'running',
          currentTask: options.task || 'Starting...',
        });
        return NextResponse.json({
          success: true,
          message: `Agent ${agentId} started`,
        });

      case 'stop':
        comm.updateAgentStatus(agentId, {
          status: 'idle',
          currentTask: 'Stopped',
        });
        return NextResponse.json({
          success: true,
          message: `Agent ${agentId} stopped`,
        });

      case 'pause':
        comm.updateAgentStatus(agentId, {
          status: 'paused',
          currentTask: 'Paused',
        });
        return NextResponse.json({
          success: true,
          message: `Agent ${agentId} paused`,
        });

      case 'resume':
        comm.updateAgentStatus(agentId, {
          status: 'running',
          currentTask: options.task || 'Resumed',
        });
        return NextResponse.json({
          success: true,
          message: `Agent ${agentId} resumed`,
        });

      case 'update':
        comm.updateAgentStatus(agentId, {
          ...options,
        });
        return NextResponse.json({
          success: true,
          message: `Agent ${agentId} updated`,
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error controlling agent:', error);
    return NextResponse.json(
      { error: 'Failed to control agent' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/control
 * Remove/unregister an agent
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const comm = getAgentCommunication();
    comm.updateAgentStatus(agentId, {
      status: 'idle',
      currentTask: 'Unregistered',
    });

    return NextResponse.json({
      success: true,
      message: `Agent ${agentId} unregistered`,
    });
  } catch (error) {
    console.error('Error unregistering agent:', error);
    return NextResponse.json(
      { error: 'Failed to unregister agent' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { SlackIntegration } from '@/lib/slack-integration';
import { createClient } from '@/lib/supabase/server';

const slack = new SlackIntegration();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify Slack request (in production, verify signature)
    const { type, challenge, event } = body;

    // Handle URL verification
    if (type === 'url_verification') {
      return NextResponse.json({ challenge });
    }

    // Handle events
    if (type === 'event_callback' && event) {
      await handleSlackEvent(event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSlackEvent(event: any) {
  try {
    await slack.handleSlackEvent(event);
  } catch (error) {
    }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

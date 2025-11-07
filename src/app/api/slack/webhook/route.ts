import { NextRequest, NextResponse } from 'next/server';
import { SlackIntegration } from '@/lib/slack-integration';
import { logger } from '@/lib/utils/logger';
// import { _createClient } from '@/lib/supabase/server';
// import { _requireAuth } from '@/lib/auth/authorize';

const slack = new SlackIntegration();

export async function POST(request: NextRequest): Promise<NextResponse> {
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

async function handleSlackEvent(event: unknown) {
  try {
    await slack.handleSlackEvent(event);
  } catch (error) {
    logger.error('Error handling Slack event:', { error });
  }
}

export const revalidate = 60;

export async function GET(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}

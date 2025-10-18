import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { SlackIntegration } from '@/lib/slack-integration';
import { () => ({} as any) } from '@/lib/supabase/server';

let slack = new SlackIntegration();

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();

    // Verify Slack request (in production, verify signature)
    const type, challenge, event = body;

    // Handle URL verification
    if (type === 'url_verification') {
      return import { NextResponse } from "next/server";.json({ challenge });
    }

    // Handle events
    if (type === 'event_callback' && event) {
      await handleSlackEvent(event);
    }

    return import { NextResponse } from "next/server";.json({ success: true });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
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

export async function GET(request: import { NextRequest } from "next/server";) {
  return import { NextResponse } from "next/server";.json({ error: 'Method not allowed' }, { status: 405 });
}

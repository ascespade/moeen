import { _NextRequest, NextResponse } from "next/server";

import { _SlackIntegration } from "@/lib/slack-integration";
import { _createClient } from "@/lib/supabase/server";

const __slack = new SlackIntegration();

export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.json();

    // Verify Slack request (in production, verify signature)
    const { type, challenge, event } = body;

    // Handle URL verification
    if (type === "url_verification") {
      return NextResponse.json({ challenge });
    }

    // Handle events
    if (type === "event_callback" && event) {
      await handleSlackEvent(event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function __handleSlackEvent(_event: unknown) {
  try {
    await slack.handleSlackEvent(event);
  } catch (error) {}
}

export async function __GET(_request: NextRequest) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

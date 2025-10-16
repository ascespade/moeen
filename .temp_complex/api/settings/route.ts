import { NextRequest, NextResponse } from "next/server";

// Placeholder in-memory settings for bootstrapping. Real impl: Supabase table `settings` per org.
let SETTINGS: Record<string, unknown> = {
  provider: "gemini",
  voice: { stt: "whisper", tts: null },
};

export async function GET() {
  return NextResponse.json(SETTINGS);
}

export async function PATCH(req: NextRequest) {
  const patch = await req.json().catch(() => ({}));
  SETTINGS = { ...SETTINGS, ...patch };
  return NextResponse.json(SETTINGS);
}

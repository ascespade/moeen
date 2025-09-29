import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Placeholder: accepts { messages: [...], provider: "gemini|flash|openai" }
  return NextResponse.json({ ok: true, provider: "gemini", message: "placeholder" });
}


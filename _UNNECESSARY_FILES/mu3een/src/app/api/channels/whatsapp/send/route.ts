import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return NextResponse.json({ ok: false, error: "Missing WhatsApp credentials" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  if (!body || !body.to || !body.text) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  // Placeholder only: in real impl we'd call the WhatsApp API here.
  return NextResponse.json({ ok: true, to: body.to, text: body.text });
}
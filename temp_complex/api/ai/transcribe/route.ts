import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // Placeholder: accepts audio file form-data
  return NextResponse.json({
    ok: true,
    text: "transcribed text (placeholder)",
  });
}

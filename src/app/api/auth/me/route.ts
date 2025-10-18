import { NextRequest, NextResponse } from "next/server";

import { authorize } from "@/lib/auth/authorize";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return NextResponse.json({ error }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

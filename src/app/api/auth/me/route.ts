import { _NextRequest, NextResponse } from "next/server";

import { _authorize } from "@/lib/auth/authorize";

export async function __GET(_request: NextRequest) {
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

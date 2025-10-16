import { _NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function __middleware(__request: NextRequest) {
  return NextResponse.next();
}

export const __config = {
  matcher: [
    "/((?!_next|api|static|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};

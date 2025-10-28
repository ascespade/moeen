import { _NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Ultra-simple middleware for fastest compilation
export function __middleware(__request: NextRequest) {
  return NextResponse.next();
}

export const __config = {
  matcher: [
    "/((?!_next|api|static|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};

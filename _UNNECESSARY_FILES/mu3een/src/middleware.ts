import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Very light RBAC stub: redirect unauthenticated users to /login.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/login");

  // Placeholder auth check: look for a demo cookie.
  const isLoggedIn = request.cookies.has("mu3een_demo_auth");

  if (!isLoggedIn && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\.png$|.*\\.svg$).*)"],
};


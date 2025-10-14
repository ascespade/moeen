import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authRateLimiter,
  apiRateLimiter,
  uploadRateLimiter,
} from "@/lib/rate-limiter";

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API health checks
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname === "/health" ||
    pathname === "/api/health"
  ) {
    return NextResponse.next();
  }

  // Rate limiting for authentication endpoints
  if (pathname.startsWith("/api/auth/")) {
    if (!authRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        {
          error: "Too many authentication attempts",
          retryAfter: Math.ceil(authRateLimiter.getResetTime(ip) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              authRateLimiter.getResetTime(ip) / 1000,
            ).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": authRateLimiter
              .getRemainingRequests(ip)
              .toString(),
            "X-RateLimit-Reset": authRateLimiter.getResetTime(ip).toString(),
          },
        },
      );
    }
  }

  // Rate limiting for upload endpoints
  if (pathname.startsWith("/api/upload/")) {
    if (!uploadRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        {
          error: "Upload rate limit exceeded",
          retryAfter: Math.ceil(uploadRateLimiter.getResetTime(ip) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              uploadRateLimiter.getResetTime(ip) / 1000,
            ).toString(),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": uploadRateLimiter
              .getRemainingRequests(ip)
              .toString(),
            "X-RateLimit-Reset": uploadRateLimiter.getResetTime(ip).toString(),
          },
        },
      );
    }
  }

  // Rate limiting for general API endpoints
  if (pathname.startsWith("/api/")) {
    if (!apiRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil(apiRateLimiter.getResetTime(ip) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              apiRateLimiter.getResetTime(ip) / 1000,
            ).toString(),
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": apiRateLimiter
              .getRemainingRequests(ip)
              .toString(),
            "X-RateLimit-Reset": apiRateLimiter.getResetTime(ip).toString(),
          },
        },
      );
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.supabase.co",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Add rate limit headers for API requests
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set(
      "X-RateLimit-Remaining",
      apiRateLimiter.getRemainingRequests(ip).toString(),
    );
    response.headers.set(
      "X-RateLimit-Reset",
      apiRateLimiter.getResetTime(ip).toString(),
    );
  }

  // Bot detection and blocking
  const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    // Allow legitimate bots (Google, Bing, etc.)
    const allowedBots = [/googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i];

    if (!allowedBots.some((pattern) => pattern.test(userAgent))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

/**
 * Main Middleware - البرنامج الوسيط الرئيسي
 * Combines all middleware components for comprehensive request handling
 */

import { _NextRequest, NextResponse } from "next/server";

import { _authorize } from "./lib/auth/authorize";
import { _auditMiddleware, auditErrorMiddleware } from "./middleware/audit";
import { _rateLimiter as rateLimitMiddleware } from "./middleware/rate-limiter";
import { _securityMiddleware } from "./middleware/security";

// Performance monitoring
const __performanceStart = new Map<string, number>();

export async function __middleware(_request: NextRequest) {
  const __startTime = Date.now();
  const __requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Store start time for performance monitoring
  performanceStart.set(requestId, startTime);

  try {
    // 1. Security middleware (CORS, CSP, security headers)
    const __securityResponse = await securityMiddleware(request);
    if (securityResponse) {
      return securityResponse;
    }

    // 2. Rate limiting
    const __rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 3. Authentication and authorization for protected routes
    if (isProtectedRoute(request.nextUrl.pathname)) {
      try {
        const __authResult = await authorize(request);
        if (authResult.error || !authResult.user) {
          return NextResponse.json(
            { error: "Unauthorized", message: "Authentication required" },
            { status: 401 },
          );
        }
      } catch (error) {
        // // console.error("Auth middleware error:", error);
        return NextResponse.json(
          {
            error: "Authentication failed",
            message: "Unable to verify authentication",
          },
          { status: 401 },
        );
      }
    }

    // 4. Continue with the request
    const __response = NextResponse.next();

    // 5. Add security headers to response
    addSecurityHeaders(response);

    // 6. Add performance headers
    addPerformanceHeaders(response, startTime);

    // 7. Audit logging (async, don't wait)
    // Note: In Edge Runtime, we can't use setImmediate, so we'll skip async audit logging
    // auditMiddleware(request, response, startTime, Date.now());

    return response;
  } catch (error) {
    // // console.error("Middleware error:", error);

    // Audit error
    // Note: In Edge Runtime, we can't use setImmediate, so we'll skip async error logging
    // auditErrorMiddleware(request, error as Error, startTime, Date.now());

    return NextResponse.json(
      { error: "Internal server error", message: "Request processing failed" },
      { status: 500 },
    );
  }
}

function __isProtectedRoute(_pathname: string): boolean {
  const __protectedRoutes = [
    "/api/admin",
    "/api/patients",
    "/api/doctors",
    "/api/appointments",
    "/api/medical-records",
    "/api/payments",
    "/api/insurance",
    "/api/notifications",
    "/api/reports",
    "/api/chatbot",
  ];

  // Skip auth for public API routes
  const __publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/health",
    "/api/test",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return false;
  }

  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function __addSecurityHeaders(_response: NextResponse): void {
  // Additional security headers
  response.headers.set(
    "X-Request-ID",
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
}

function __addPerformanceHeaders(
  response: NextResponse,
  startTime: number,
): void {
  const __duration = Date.now() - startTime;
  response.headers.set("X-Response-Time", `${duration}ms`);
  response.headers.set("X-Processed-At", new Date().toISOString());
}

// Configure which paths the middleware should run on
export const __config = {
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

// Export individual middleware functions for testing
export {
  rateLimitMiddleware,
  _securityMiddleware as securityMiddleware,
  _auditMiddleware as auditMiddleware,
  auditErrorMiddleware,
};

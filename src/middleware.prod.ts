import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { CSRFProtection, RateLimiter, securityHeaders } from "@/lib/security";

// Authentication middleware with proper JWT validation
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting for API routes
  if (pathname.startsWith("/api")) {
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";

    if (RateLimiter.isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 },
      );
    }

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set(
      "X-RateLimit-Remaining",
      RateLimiter.getRemainingRequests(ip).toString(),
    );
    response.headers.set(
      "X-RateLimit-Reset",
      RateLimiter.getResetTime(ip).toString(),
    );
  }

  // CSRF protection for state-changing operations
  if (
    pathname.startsWith("/api") &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)
  ) {
    if (!CSRFProtection.validateToken(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "CSRF token validation failed",
          code: "CSRF_TOKEN_INVALID",
        },
        { status: 403 },
      );
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // API routes that don't require authentication
  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/i18n",
  ];
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Skip authentication for public routes
  if (isPublicRoute || isPublicApiRoute) {
    // Set CSRF token for public routes
    if (isPublicRoute) {
      CSRFProtection.setCSRFToken(response);
    }
    return response;
  }

  // Check for authentication token
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    // Redirect to login for web routes
    if (!pathname.startsWith("/api")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Return 401 for API routes
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required",
        code: "AUTHENTICATION_REQUIRED",
      },
      { status: 401 },
    );
  }

  // Verify JWT token
  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    // Add user info to request headers for API routes
    if (pathname.startsWith("/api")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Clear invalid token
    const response = pathname.startsWith("/api")
      ? NextResponse.json(
          {
            success: false,
            error: "Invalid or expired token",
            code: "INVALID_TOKEN",
          },
          { status: 401 },
        )
      : NextResponse.redirect(new URL("/login", request.url));

    // Clear invalid cookies
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next|api|static|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};

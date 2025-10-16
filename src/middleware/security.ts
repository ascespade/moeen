/**
 * Security Middleware
 * Implements security headers and protection
 */

import { _NextRequest, NextResponse } from "next/server";

export function __securityMiddleware(_request: NextRequest) {
  const __response = NextResponse.next();

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;",
  );

  // CORS headers
  const __origin = request.headers.get("origin");
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

function __isAllowedOrigin(_origin: string): boolean {
  const __allowedOrigins = [
    "http://localhost:3000",
    "https://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
    "https://socwpqzcalgvpzjwavgh.supabase.co",
  ].filter(Boolean);

  return allowedOrigins.includes(origin);
}

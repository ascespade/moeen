/**
 * Main Middleware - البرنامج الوسيط الرئيسي
 * Combines all middleware components for comprehensive request handling
 */

import { NextRequest, NextResponse } from 'next/server';

import { rateLimiter } from './middleware/rate-limiter';
import { securityMiddleware } from './middleware/security';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // 1. Security middleware (CORS, CSP, security headers)
    const securityResponse = await securityMiddleware(request);
    if (securityResponse) {
      return securityResponse;
    }

    // 2. Rate limiting
    const rateLimitResponse = await rateLimiter(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 3. Continue with the request
    const response = NextResponse.next();

    // 4. Add security headers to response
    _addSecurityHeaders(response, requestId);

    // 5. Add performance headers
    _addPerformanceHeaders(response, startTime);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Request processing failed' },
      { status: 500 }
    );
  }
}

function _addSecurityHeaders(response: NextResponse, requestId: string): void {
  // Additional security headers
  response.headers.set('X-Request-ID', requestId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
}

function _addPerformanceHeaders(
  response: NextResponse,
  startTime: number
): void {
  const duration = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${duration}ms`);
  response.headers.set('X-Processed-At', new Date().toISOString());
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

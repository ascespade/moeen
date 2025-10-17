/**
 * Main Middleware - البرنامج الوسيط الرئيسي
 * Combines all middleware components for comprehensive request handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter as rateLimitMiddleware } from './middleware/rate-limiter';
import { securityMiddleware } from './middleware/security';
import { authorize } from '@/lib/auth/authorize';

// Performance monitoring
const performanceStart = new Map<string, number>();

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store start time for performance monitoring
  performanceStart.set(requestId, startTime);

  try {
    // 1. Security middleware (CORS, CSP, security headers)
    const securityResponse = await securityMiddleware(request);
    if (securityResponse) {
      return securityResponse;
    }

    // 2. Rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 3. Authentication and authorization for protected API routes only
    if (isProtectedApiRoute(request.nextUrl.pathname)) {
      const { user, error } = await authorize(request);
      if (error || !user) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        );
      }
    }
    
    // 4. Redirect unauthenticated users from dashboard pages (client-side routes)
    if (isDashboardRoute(request.nextUrl.pathname)) {
      const { user, error } = await authorize(request);
      if (error || !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }

    // 4. Continue with the request
    const response = NextResponse.next();

    // 5. Add security headers to response
    addSecurityHeaders(response);

    // 6. Add performance headers
    addPerformanceHeaders(response, startTime);

    // 7. Audit logging (async, don't wait)
    Promise.resolve().then(() => {
      auditMiddleware(request, response, startTime, Date.now());
    });

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // Audit error
    Promise.resolve().then(() => {
      auditErrorMiddleware(request, error as Error, startTime, Date.now());
    });

    return NextResponse.json(
      { error: 'Internal server error', message: 'Request processing failed' },
      { status: 500 }
    );
  }
}

function isProtectedApiRoute(pathname: string): boolean {
  const protectedApiRoutes = [
    '/api/admin',
    '/api/patients',
    '/api/doctors',
    '/api/appointments',
    '/api/medical-records',
    '/api/payments',
    '/api/insurance',
    '/api/notifications',
    '/api/reports',
    '/api/chatbot',
  ];

  return protectedApiRoutes.some(route => pathname.startsWith(route));
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || 
         pathname.startsWith('/(admin)') ||
         pathname.startsWith('/(health)') ||
         pathname.startsWith('/(doctor)') ||
         pathname.startsWith('/(patient)') ||
         pathname.startsWith('/(staff)') ||
         pathname.startsWith('/(supervisor)');
}

function addSecurityHeaders(response: NextResponse): void {
  // Additional security headers
  response.headers.set('X-Request-ID', `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function addPerformanceHeaders(response: NextResponse, startTime: number): void {
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

// Export individual middleware functions for testing
export {
  rateLimitMiddleware,
  securityMiddleware,
  auditMiddleware,
  auditErrorMiddleware,
};
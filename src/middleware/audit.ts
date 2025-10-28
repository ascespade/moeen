/**
 * Audit Middleware
 * Implements request/response logging and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

export function __auditMiddleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // Log request
  logger.info('Request started', {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.ip,
  });

  const response = NextResponse.next();

  // Add request ID to response headers
  response.headers.set('X-Request-ID', requestId);

  // Log response when it's sent
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

  return response;
}

export function __auditErrorMiddleware(error: Error, request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || 'unknown';

  logger.error('Request failed', {
    requestId,
    method: request.method,
    url: request.url,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });

  return NextResponse.json(
    { error: 'Internal server error', requestId },
    { status: 500 }
  );
}

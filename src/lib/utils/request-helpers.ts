import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest | undefined): string {
  if (!request) return '127.0.0.1';
  
  const forwarded = request.headers?.get('x-forwarded-for');
  const realIP = request.headers?.get('x-real-ip');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return '127.0.0.1';
}

export function getUserAgent(request: NextRequest | undefined): string {
  if (!request) return 'Unknown';
  return request.headers?.get('user-agent') || 'Unknown';
}

export function getClientInfo(request: NextRequest) {
  return {
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
  };
}

/**
 * Request Helper Utilities
 * Helper functions for extracting client information from requests
 */

import { NextRequest } from 'next/server';

/**
 * Extract client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return '127.0.0.1';
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'Unknown';
}

/**
 * Extract client information bundle
 */
export function getClientInfo(request: NextRequest) {
  return {
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
  };
}

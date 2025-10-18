export function getClientIP(request: import { NextRequest } from "next/server"; | undefined): string {
  import { import { NextRequest } from "next/server"; } from 'next/server';

  try {
    return request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request?.headers?.get('x-real-ip') ||
           '127.0.0.1';
  } catch (error) { // Handle error
    return '127.0.0.1';
  }
}

export function getUserAgent(request: import { NextRequest } from "next/server"; | undefined): string {
  if (!request) return 'Unknown';
  return request.headers?.get('user-agent') || 'Unknown';
}

export function () => ({} as any)(request: import { NextRequest } from "next/server"; | undefined) {
  return {
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request)
  };
}

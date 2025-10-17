/**
 * Activity Tracker Middleware - تتبع نشاط المستخدم
 * Automatically tracks user activity and updates last_activity_at
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to extract IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request?.headers?.get('x-forwarded-for');
  const realIP = request?.headers?.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

// Paths that should be excluded from activity tracking
const EXCLUDED_PATHS = [
  '/_next',
  '/api/health',
  '/favicon.ico',
  '/static',
  '/images',
  '/assets'
];

export async function trackUserActivity(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const pathname = request.nextUrl.pathname;

  // Skip tracking for excluded paths
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return;
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const ipAddress = getClientIP(request);
      const userAgent = request?.headers?.get('user-agent') || 'Unknown';

      // Update user activity in database (non-blocking)
      supabase
        .from('users')
        .update({
          last_activity_at: new Date().toISOString(),
          last_ip_address: ipAddress,
          last_user_agent: userAgent
        })
        .eq('id', user.id)
        .then(() => {
          // Activity updated successfully
        })
        .catch((error) => {
          console.error('Failed to update user activity:', error);
        });

      // Log significant activities (API calls, form submissions)
      if (request.method !== 'GET' || pathname.startsWith('/api/')) {
        supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'user_activity',
          resource_type: 'page',
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'success',
          severity: 'debug',
          metadata: {
            path: pathname,
            method: request.method,
            timestamp: new Date().toISOString()
          }
        }).then(() => {
          // Activity logged
        }).catch((error) => {
          console.error('Failed to log activity:', error);
        });
      }
    }
  } catch (error) {
    // Silent fail - don't block the request
    console.error('Activity tracking error:', error);
  }
}

export async function activityMiddleware(
  request: NextRequest
): Promise<NextResponse> {
  const response = NextResponse.next();
  
  // Track activity asynchronously (don't wait)
  trackUserActivity(request, response).catch(() => {
    // Silent fail
  });
  
  return response;
}

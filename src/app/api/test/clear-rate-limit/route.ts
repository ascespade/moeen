/**
 * Clear Rate Limit API - مسح حد معدل الطلبات
 * For testing purposes only
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearRateLimitCache } from '@/middleware/rate-limiter';
import { requireAuth } from '@/lib/auth/authorize';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Only allow in development/testing environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not available in production' },
        { status: 403 }
      );
    }

    clearRateLimitCache();
    return NextResponse.json({
      success: true,
      message: 'Rate limit cache cleared',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear rate limit cache' },
      { status: 500 }
    );
  }
}

/**
 * Clear Rate Limit API - مسح حد معدل الطلبات
 * For testing purposes only
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearRateLimitCache } from '@/middleware/rate-limiter';
import { ErrorHandler } from '@/core/errors';
import { env } from '@/config/env';

export async function POST(request: NextRequest) {
  // Only allow in development/testing environment
  if (env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    clearRateLimitCache();
    return NextResponse.json({
      success: true,
      message: 'Rate limit cache cleared',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

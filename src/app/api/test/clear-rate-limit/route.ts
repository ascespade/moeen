
/**
 * Clear Rate Limit API - مسح حد معدل الطلبات
 * For testing purposes only
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { clearRateLimitCache } from '@/middleware/rate-limiter';

export async function POST(request: import { NextRequest } from "next/server";) {
  // Only allow in development/testing environment
  if (process.env.NODE_ENV === 'production') {
    return import { NextResponse } from "next/server";.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    clearRateLimitCache();
    return import { NextResponse } from "next/server";.json({
      success: true,
      message: 'Rate limit cache cleared'
    });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to clear rate limit cache' },
      { status: 500 }
    );
  }
}

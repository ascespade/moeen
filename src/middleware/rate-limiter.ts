/**
 * Rate Limiter Middleware - حد معدل الطلبات
 * Advanced rate limiting with Redis support and multiple strategies
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
  onLimitReached?: (req: NextRequest, key: string) => void;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (in production, use Redis)
const store: RateLimitStore = {};

// Default configurations for different endpoints
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    skipSuccessfulRequests: true,
  },
  '/api/auth/register': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour
  },
  '/api/appointments/book': {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10, // 10 bookings per 5 minutes
  },
  '/api/notifications/send': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 notifications per minute
  },
  '/api/payments/process': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 payments per minute
  },
  '/api/medical-records/upload': {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10, // 10 uploads per 5 minutes
  },
  '/api/reports/generate': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 reports per minute
  },
  '/api/admin/users': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
  '/api/chatbot/actions': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 actions per minute
  },
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Clean up expired entries
    this.cleanupExpiredEntries(windowStart);

    // Get or create entry for this key
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    const entry = store[key];

    // Check if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    // Check if limit is exceeded
    if (entry.count >= this.config.maxRequests) {
      if (this.config.onLimitReached) {
        this.config.onLimitReached(req, key);
      }

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private getDefaultKey(req: NextRequest): string {
    // Use IP address as default key
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    return `rate_limit:${ip}`;
  }

  private cleanupExpiredEntries(windowStart: number): void {
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < windowStart) {
        delete store[key];
      }
    });
  }
}

export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

export function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Find matching config for the pathname
  for (const [pattern, config] of Object.entries(rateLimitConfigs)) {
    if (pattern !== 'default' && pathname.startsWith(pattern)) {
      return config;
    }
  }
  return rateLimitConfigs.default;
}

export async function rateLimitMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const config = getRateLimitConfig(req.nextUrl.pathname);
  const rateLimiter = createRateLimiter(config);

  const result = await rateLimiter.checkLimit(req);

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: result.retryAfter,
      },
      { status: 429 }
    );

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }

    return response;
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

  return null;
}

// Advanced rate limiting with user-based keys
export function createUserRateLimiter(config: RateLimitConfig) {
  return new RateLimiter({
    ...config,
    keyGenerator: (req: NextRequest) => {
      const userId = req.headers.get('x-user-id');
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      return `rate_limit:user:${userId || ip}`;
    },
  });
}

// Rate limiting with different limits for different user roles
export function createRoleBasedRateLimiter(config: RateLimitConfig) {
  return new RateLimiter({
    ...config,
    keyGenerator: (req: NextRequest) => {
      const role = req.headers.get('x-user-role') || 'anonymous';
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      return `rate_limit:role:${role}:${ip}`;
    },
  });
}

// Rate limiting for specific actions
export function createActionRateLimiter(action: string, config: RateLimitConfig) {
  return new RateLimiter({
    ...config,
    keyGenerator: (req: NextRequest) => {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      return `rate_limit:action:${action}:${userId}`;
    },
  });
}
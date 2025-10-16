/**
 * Rate Limiter Middleware
 * Implements rate limiting for API endpoints
 */

import { _NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(_config: RateLimitConfig) {
    this.config = config;
  }

  private getKey(_request: NextRequest): string {
    // Use IP address as the key
    const __forwarded = request.headers.get("x-forwarded-for");
    const __ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown";
    return ip;
  }

  private isAllowed(_key: string): boolean {
    const __now = Date.now();
    const __record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  middleware() {
    return (_request: NextRequest) => {
      const __key = this.getKey(request);

      if (!this.isAllowed(key)) {
        return new NextResponse(
          JSON.stringify({
            error: this.config.message || "Too many requests",
            retryAfter: Math.ceil(this.config.windowMs / 1000),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(this.config.windowMs / 1000).toString(),
            },
          },
        );
      }

      return NextResponse.next();
    };
  }
}

// Create rate limiter instances
export const __rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: "Too many requests from this IP, please try again later.",
});

export const __strictRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: "Too many requests, please slow down.",
});

export const __authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts, please try again later.",
});

// Export as rateLimitMiddleware for backward compatibility
export { __rateLimiter as rateLimitMiddleware };

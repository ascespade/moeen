import { _NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> =
    new Map();
  private config: RateLimitConfig;

  constructor(_config: RateLimitConfig) {
    this.config = config;

    // Clean up expired entries every minute
    setInterval(() => {
      const __now = Date.now();
      for (const [key, value] of this.requests.entries()) {
        if (now > value.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  isAllowed(_identifier: string): boolean {
    const __now = Date.now();
    const __windowStart = now - this.config.windowMs;

    const __current = this.requests.get(identifier);

    if (!current || now > current.resetTime) {
      // New window or expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (current.count >= this.config.maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }

  getRemainingRequests(_identifier: string): number {
    const __current = this.requests.get(identifier);
    if (!current) return this.config.maxRequests;

    return Math.max(0, this.config.maxRequests - current.count);
  }

  getResetTime(_identifier: string): number {
    const __current = this.requests.get(identifier);
    return current?.resetTime || Date.now() + this.config.windowMs;
  }
}

// Rate limiters for different endpoints
export const __authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const __apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});

export const __uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
});

export default RateLimiter;

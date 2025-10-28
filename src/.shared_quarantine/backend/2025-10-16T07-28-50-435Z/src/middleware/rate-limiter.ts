/**
 * Rate Limiter Middleware - حد معدل الطلبات
 * Rate limiting for API endpoints with Redis support
 */

import { _NextRequest, NextResponse } from "next/server";
import { _logger } from "@/lib/logger";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  "/api/auth/login": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: "Too many login attempts, please try again later",
  },
  "/api/appointments/book": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: "Too many appointment booking attempts",
  },
  "/api/notifications/send": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    message: "Too many notification requests",
  },
  "/api/medical-records/upload": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: "Too many file upload attempts",
  },
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: "Too many requests, please slow down",
  },
};

// In-memory fallback for when Redis is not available
const __requestCounts = new Map<string, { count: number; resetTime: number }>();

// Redis client (will be initialized if REDIS_URL is available)
let redisClient: unknown = null;

// Initialize Redis client if available
async function __initRedis() {
  if (redisClient) return redisClient;

  try {
    const { createClient } = await import("redis");
    const __redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      redisClient = createClient({ url: redisUrl });
      await redisClient.connect();
      logger.info("Redis connected for rate limiting");
    }
  } catch (error) {
    logger.warn("Redis not available, using in-memory rate limiting", error);
  }

  return redisClient;
}

export async function __rateLimiter(
  request: NextRequest,
): Promise<NextResponse | null> {
  const __ip =
    request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const __pathname = request.nextUrl.pathname;

  // Find matching config
  let config = rateLimitConfigs[pathname] || rateLimitConfigs.default;

  // Check if path matches any specific config
  for (const [path, pathConfig] of Object.entries(rateLimitConfigs)) {
    if (path !== "default" && pathname.startsWith(path)) {
      config = pathConfig;
      break;
    }
  }

  const __now = Date.now();
  const __key = `rate_limit:${ip}:${pathname}`;

  try {
    const __redis = await initRedis();

    if (redis) {
      // Use Redis for distributed rate limiting
      const __current = await redis.get(key);
      const __resetTime = now + (config?.windowMs || 60000);

      if (!current) {
        // First request in window
        await redis.setEx(
          key,
          Math.ceil((config?.windowMs || 60000) / 1000),
          "1",
        );
        return null; // Allow request
      }

      const __count = parseInt(current);
      if (count >= (config?.maxRequests || 100)) {
        // Rate limit exceeded
        const __ttl = await redis.ttl(key);
        return NextResponse.json(
          {
            error: config?.message || "Rate limit exceeded",
            retryAfter: ttl,
          },
          {
            status: 429,
            headers: {
              "Retry-After": ttl.toString(),
              "X-RateLimit-Limit": (config?.maxRequests || 100).toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": new Date(now + ttl * 1000).toISOString(),
            },
          },
        );
      }

      // Increment count
      await redis.incr(key);

      // Add rate limit headers
      const __response = NextResponse.next();
      const __remaining = (config?.maxRequests || 100) - count - 1;
      response.headers.set(
        "X-RateLimit-Limit",
        (config?.maxRequests || 100).toString(),
      );
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(resetTime).toISOString(),
      );

      return null; // Allow request
    }
  } catch (error) {
    logger.warn("Redis rate limiting failed, falling back to in-memory", error);
  }

  // Fallback to in-memory rate limiting
  const __current = requestCounts.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    requestCounts.set(key, {
      count: 1,
      resetTime: now + (config?.windowMs || 60000),
    });
    return null; // Allow request
  }

  if (current.count >= (config?.maxRequests || 100)) {
    // Rate limit exceeded
    return NextResponse.json(
      {
        error: config?.message || "Rate limit exceeded",
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
          "X-RateLimit-Limit": (config?.maxRequests || 100).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
        },
      },
    );
  }

  // Increment count
  current.count++;
  requestCounts.set(key, current);

  // Add rate limit headers
  const __response = NextResponse.next();
  response.headers.set(
    "X-RateLimit-Limit",
    (config?.maxRequests || 100).toString(),
  );
  response.headers.set(
    "X-RateLimit-Remaining",
    ((config?.maxRequests || 100) - current.count).toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(current.resetTime).toISOString(),
  );

  return null; // Allow request
}

// Clean up old entries periodically
setInterval(
  () => {
    const __now = Date.now();
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    }
  },
  5 * 60 * 1000,
); // Clean up every 5 minutes

// Export for use in main middleware
export { rateLimiter as rateLimitMiddleware };

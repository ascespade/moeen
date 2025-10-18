import { NextRequest, NextResponse } from "next/server";

/**
 * Rate Limiter Middleware - حد معدل الطلبات
 * Rate limiting for API endpoints
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  "/api/auth/login": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // Disabled for testing
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

const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Function to clear rate limiting cache (for testing)
export function clearRateLimitCache(): void {
  requestCounts.clear();

export function rateLimiter(request: NextRequest): NextResponse | null {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const pathname = request.nextUrl.pathname;

  // Find matching config - always defaults to 'default' config
  let foundConfig: RateLimitConfig | undefined = rateLimitConfigs[pathname];

  if (!foundConfig) {
    for (const [path, pathConfig] of Object.entries(rateLimitConfigs)) {
      if (path !== "default" && pathname.startsWith(path)) {
        foundConfig = pathConfig;
        break;
      }
    }

  const config = (foundConfig ?? rateLimitConfigs.default) as RateLimitConfig;

  const now = Date.now();
  const key = `${ip}:${pathname}`;
  const current = requestCounts.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null; // Allow request

  if (current.count >= config.maxRequests) {
    // Rate limit exceeded
    return NextResponse.json(
        error: config.message,
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
        status: 429,
        headers: {
          "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
        },
    );

  // Increment count
  current.count++;
  requestCounts.set(key, current);

  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    (config.maxRequests - current.count).toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(current.resetTime).toISOString(),
  );

  return null; // Allow request

// Clean up old entries periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    }
  },
  5 * 60 * 1000,
); // Clean up every 5 minutes
}}}}
}

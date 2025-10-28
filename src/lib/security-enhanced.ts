import { _NextRequest, NextResponse } from "next/server";
import { _createHash, randomBytes } from "crypto";
import { _realDB } from "./supabase-real";
// Enhanced Security System for Hemam Center
import { _NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Rate limiting store
const __rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

// Security headers
export const __securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;",
};

// Enhanced Rate Limiter
export class EnhancedRateLimiter {
  private maxRequests: number;
  private windowMs: number;

  constructor(_maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(_identifier: string): boolean {
    const __now = Date.now();
    const __key = identifier;
    const __record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (record.count >= this.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  getRemainingRequests(_identifier: string): number {
    const __record = rateLimitStore.get(identifier);
    if (!record) return this.maxRequests;
    return Math.max(0, this.maxRequests - record.count);
  }

  getResetTime(_identifier: string): number {
    const __record = rateLimitStore.get(identifier);
    return record?.resetTime || Date.now() + this.windowMs;
  }
}

// Enhanced CSRF Protection
export class EnhancedCSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(): string {
    const __token = randomBytes(32).toString("hex");
    const __expires = Date.now() + 60 * 60 * 1000; // 1 hour
    const __id = randomBytes(16).toString("hex");

    this.tokens.set(id, { token, expires });

    // Clean up expired tokens
    for (const [key, value] of this.tokens.entries()) {
      if (Date.now() > value.expires) {
        this.tokens.delete(key);
      }
    }

    return `${id}:${token}`;
  }

  static validateToken(_providedToken: string): boolean {
    if (!providedToken) return false;

    const [id, token] = providedToken.split(":");
    if (!id || !token) return false;

    const __stored = this.tokens.get(id);
    if (!stored) return false;

    if (Date.now() > stored.expires) {
      this.tokens.delete(id);
      return false;
    }

    return stored.token === token;
  }
}

// Enhanced Session Security
export class EnhancedSessionSecurity {
  static generateSessionId(): string {
    return randomBytes(32).toString("hex");
  }

  static hashSessionId(_sessionId: string): string {
    return createHash("sha256").update(sessionId).digest("hex");
  }

  static validateSessionId(
    sessionId: string,
    hashedSessionId: string,
  ): boolean {
    return this.hashSessionId(sessionId) === hashedSessionId;
  }
}

// Input Sanitization
export class InputSanitizer {
  static sanitizeString(_input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/['"]/g, "") // Remove quotes
      .replace(/[;]/g, "") // Remove semicolons
      .trim();
  }

  static sanitizePhoneNumber(_phone: string): string {
    return phone.replace(/[^\d+]/g, "");
  }

  static sanitizeEmail(_email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizeNationalId(_nationalId: string): string {
    return nationalId.replace(/[^\d]/g, "");
  }
}

// Audit Logger
export class AuditLogger {
  static async log(_request: NextRequest, action: string, details?: unknown) {
    try {
      const __userAgent = request.headers.get("user-agent") || "";
      const ipAddress =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";

      const __userId = request.headers.get("x-user-id") || undefined;

      await realDB.logAudit({
        ...(userId ? { user_id: userId } : {}),
        action,
        table_name: details?.table_name,
        record_id: details?.record_id,
        old_values: details?.old_values,
        new_values: details?.new_values,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {}
  }
}

// Enhanced Authentication Middleware
export class EnhancedAuthMiddleware {
  static async authenticate(_request: NextRequest): Promise<{
    success: boolean;
    user?: unknown;
    error?: string;
  }> {
    try {
      const __token = request.cookies.get("auth-token")?.value;

      if (!token) {
        return { success: false, error: "No authentication token" };
      }

      const __jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET not configured");
      }

      const __decoded = jwt.verify(token, jwtSecret) as {
        userId: string;
        email: string;
        role: string;
        iat: number;
        exp: number;
      };

      // Check if token is expired
      if (Date.now() >= decoded.exp * 1000) {
        return { success: false, error: "Token expired" };
      }

      // Get user from database
      const __user = (await realDB.getUser(decoded.userId)) as any;
      if (!user || !user.is_active) {
        return { success: false, error: "User not found or inactive" };
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: "Invalid token" };
    }
  }

  static async authorize(
    request: NextRequest,
    requiredRole?: string,
  ): Promise<{
    success: boolean;
    user?: unknown;
    error?: string;
  }> {
    const __auth = await this.authenticate(request);

    if (!auth.success) {
      return auth;
    }

    if (requiredRole && auth.user?.role !== requiredRole) {
      return { success: false, error: "Insufficient permissions" };
    }

    return auth;
  }
}

// Enhanced Security Middleware
export function __enhancedSecurityMiddleware(_request: NextRequest) {
  const __response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting
  const __rateLimiter = new EnhancedRateLimiter();
  const identifier =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimiter.isRateLimited(identifier)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900",
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": rateLimiter.getResetTime(identifier).toString(),
      },
    });
  }

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", "100");
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimiter.getRemainingRequests(identifier).toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    rateLimiter.getResetTime(identifier).toString(),
  );

  return response;
}

// API Security Wrapper
export function __secureAPI(
  handler: Function,
  options: {
    requireAuth?: boolean;
    requiredRole?: string;
    rateLimit?: boolean;
    csrfProtection?: boolean;
  } = {},
) {
  return async (_request: NextRequest, ...args: unknown[]) => {
    try {
      // Apply security middleware
      const __securityResponse = enhancedSecurityMiddleware(request);
      if (securityResponse.status !== 200) {
        return securityResponse;
      }

      // Authentication check
      if (options.requireAuth) {
        const __auth = await EnhancedAuthMiddleware.authorize(
          request,
          options.requiredRole,
        );
        if (!auth.success) {
          return NextResponse.json(
            {
              success: false,
              error: auth.error,
              code: "AUTHENTICATION_FAILED",
            },
            { status: 401 },
          );
        }

        // Add user info to headers for the handler
        request.headers.set("x-user-id", auth.user.id);
        request.headers.set("x-user-email", auth.user.email);
        request.headers.set("x-user-role", auth.user.role);
      }

      // CSRF Protection for state-changing methods
      if (
        options.csrfProtection &&
        ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)
      ) {
        const __csrfToken = request.headers.get("x-csrf-token");
        if (!csrfToken || !EnhancedCSRFProtection.validateToken(csrfToken)) {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid CSRF token",
              code: "CSRF_TOKEN_INVALID",
            },
            { status: 403 },
          );
        }
      }

      // Log the request
      await AuditLogger.log(request, "API_REQUEST", {
        method: request.method,
        url: request.url,
      });

      // Call the original handler
      const __result = await handler(request, ...args);

      return result;
    } catch (error) {
      // Log the error
      const __err = error as unknown as { message?: string; stack?: string };
      await AuditLogger.log(request, "SECURITY_ERROR", {
        error: err?.message,
        stack: err?.stack,
      });

      return NextResponse.json(
        { success: false, error: "Security error", code: "SECURITY_ERROR" },
        { status: 500 },
      );
    }
  };
}

// Data Validation
export class DataValidator {
  static validateEmail(_email: string): boolean {
    const __emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(_phone: string): boolean {
    const __phoneRegex = /^(\+966|966)[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  static validateNationalId(_nationalId: string): boolean {
    const __nationalIdRegex = /^[0-9]{10}$/;
    return nationalIdRegex.test(nationalId);
  }

  static validateRequired(
    data: unknown,
    requiredFields: string[],
  ): {
    valid: boolean;
    missing: string[];
  } {
    const __missing = requiredFields.filter((field) => !data[field]);
    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

// Export security utilities
// Re-export types via named exports are already declared above; avoid duplicate export list

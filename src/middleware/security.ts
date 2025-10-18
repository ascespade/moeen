/**
 * Security Middleware - أمان النظام
 * Comprehensive security middleware with CORS, CSP, and security headers
 */

import { NextRequest, NextResponse } from "next/server";

interface SecurityConfig {
  enableCORS: boolean;
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXSSProtection: boolean;
  enableContentTypeOptions: boolean;
  enableFrameOptions: boolean;
  enableReferrerPolicy: boolean;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  maxAge: number;
}

const defaultSecurityConfig: SecurityConfig = {
  enableCORS: true,
  enableCSP: true,
  enableHSTS: true,
  enableXSSProtection: true,
  enableContentTypeOptions: true,
  enableFrameOptions: true,
  enableReferrerPolicy: true,
  allowedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3002",
    "https://localhost:3002",
    process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com",
  ],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-User-Id",
    "X-User-Role",
    "X-API-Key",
  ],
  maxAge: 86400, // 24 hours
};

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config };
  }

  async handleRequest(req: NextRequest): Promise<NextResponse | null> {
    const response = NextResponse.next();

    // Apply security headers
    this.applySecurityHeaders(response);

    // Handle CORS
    if (this.config.enableCORS) {
      const corsResponse = this.handleCORS(req, response);
      if (corsResponse) {
        return corsResponse;
      }
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return this.handlePreflightRequest(req);
    }

    // Apply additional security checks
    this.applyAdditionalSecurityChecks(req, response);

    return null;
  }

  private applySecurityHeaders(response: NextResponse): void {
    // Content Security Policy
    if (this.config.enableCSP) {
      const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.stripe.com https://api.moyasar.com https://*.supabase.co",
        "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; ");

      response.headers.set("Content-Security-Policy", csp);
    }

    // HTTP Strict Transport Security
    if (this.config.enableHSTS) {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload",
      );
    }

    // X-Content-Type-Options
    if (this.config.enableContentTypeOptions) {
      response.headers.set("X-Content-Type-Options", "nosniff");
    }

    // X-Frame-Options
    if (this.config.enableFrameOptions) {
      response.headers.set("X-Frame-Options", "DENY");
    }

    // X-XSS-Protection
    if (this.config.enableXSSProtection) {
      response.headers.set("X-XSS-Protection", "1; mode=block");
    }

    // Referrer Policy
    if (this.config.enableReferrerPolicy) {
      response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin",
      );
    }

    // Additional security headers
    response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
    response.headers.set("X-Download-Options", "noopen");
    response.headers.set("X-DNS-Prefetch-Control", "off");
    response.headers.set("Expect-CT", "max-age=86400, enforce");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
  }

  private handleCORS(
    req: NextRequest,
    response: NextResponse,
  ): NextResponse | null {
    const origin = req.headers.get("origin");
    const method = req.method;

    // Check if origin is allowed
    if (origin && !this.isOriginAllowed(origin)) {
      return NextResponse.json(
        { error: "CORS policy violation: Origin not allowed" },
        { status: 403 },
      );
    }

    // Check if method is allowed
    if (!this.config.allowedMethods.includes(method)) {
      return NextResponse.json(
        { error: "CORS policy violation: Method not allowed" },
        { status: 405 },
      );
    }

    // Set CORS headers
    if (origin && this.isOriginAllowed(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      this.config.allowedMethods.join(", "),
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      this.config.allowedHeaders.join(", "),
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Max-Age",
      this.config.maxAge.toString(),
    );

    return null;
  }

  private handlePreflightRequest(req: NextRequest): NextResponse {
    const origin = req.headers.get("origin");
    const method = req.headers.get("access-control-request-method");
    const headers = req.headers.get("access-control-request-headers");

    // Check origin
    if (!origin || !this.isOriginAllowed(origin)) {
      return NextResponse.json(
        { error: "CORS policy violation: Origin not allowed" },
        { status: 403 },
      );
    }

    // Check method
    if (!method || !this.config.allowedMethods.includes(method)) {
      return NextResponse.json(
        { error: "CORS policy violation: Method not allowed" },
        { status: 405 },
      );
    }

    // Check headers
    if (headers) {
      const requestedHeaders = headers.split(",").map((h) => h.trim());
      const invalidHeaders = requestedHeaders.filter(
        (h) => !this.config.allowedHeaders.includes(h),
      );

      if (invalidHeaders.length > 0) {
        return NextResponse.json(
          { error: "CORS policy violation: Invalid headers" },
          { status: 400 },
        );
      }
    }

    const response = NextResponse.json({}, { status: 200 });

    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      this.config.allowedMethods.join(", "),
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      this.config.allowedHeaders.join(", "),
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Max-Age",
      this.config.maxAge.toString(),
    );

    return response;
  }

  private isOriginAllowed(origin: string): boolean {
    return this.config.allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin === "*") return true;
      if (allowedOrigin.startsWith("*.")) {
        const domain = allowedOrigin.substring(2);
        return origin.endsWith(domain);
      }
      return origin === allowedOrigin;
    });
  }

  private applyAdditionalSecurityChecks(
    req: NextRequest,
    response: NextResponse,
  ): void {
    // Check for suspicious patterns
    const userAgent = req.headers.get("user-agent") || "";
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /zap/i,
      /burp/i,
      /w3af/i,
      /acunetix/i,
      /nessus/i,
      /openvas/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
      response.headers.set(
        "X-Security-Warning",
        "Suspicious user agent detected",
      );
    }

    // Check for common attack patterns in URL
    const url = req.nextUrl.pathname + req.nextUrl.search;
    const attackPatterns = [
      /\.\.\//, // Directory traversal
      /<script/i, // XSS
      /union.*select/i, // SQL injection
      /javascript:/i, // JavaScript injection
      /vbscript:/i, // VBScript injection
      /onload=/i, // Event handler injection
      /onerror=/i, // Event handler injection
    ];

    if (attackPatterns.some((pattern) => pattern.test(url))) {
      response.headers.set(
        "X-Security-Warning",
        "Potential attack pattern detected",
      );
    }

    // Add request ID for tracking
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    response.headers.set("X-Request-ID", requestId);
  }
}

export function createSecurityMiddleware(
  config: Partial<SecurityConfig> = {},
): SecurityMiddleware {
  return new SecurityMiddleware(config);
}

export async function securityMiddleware(
  req: NextRequest,
): Promise<NextResponse | null> {
  const security = createSecurityMiddleware();
  return await security.handleRequest(req);
}

// Specific security configurations for different environments
export const developmentSecurityConfig: Partial<SecurityConfig> = {
  allowedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3002",
    "https://localhost:3002",
  ],
  enableHSTS: false, // Disable HSTS in development
};

export const productionSecurityConfig: Partial<SecurityConfig> = {
  allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"],
  enableHSTS: true,
  enableCSP: true,
};

export const stagingSecurityConfig: Partial<SecurityConfig> = {
  allowedOrigins: ["https://staging.yourdomain.com", "https://yourdomain.com"],
  enableHSTS: true,
  enableCSP: true,
};

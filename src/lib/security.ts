import { NextRequest, NextResponse } from 'next/server';
// Browser-compatible crypto functions
const getCrypto = () => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  // Fallback for Node.js
  const crypto = require('crypto');
  return crypto;
};

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly CSRF_TOKEN_HEADER = 'x-csrf-token';
  private static readonly CSRF_TOKEN_COOKIE = 'csrf-token';

  static generateToken(): string {
    const crypto = getCrypto();
    if (crypto.randomBytes) {
      return crypto.randomBytes(32).toString('hex');
    }
    // Fallback for browser
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  static validateToken(request: NextRequest): boolean {
    const tokenFromHeader = request.headers.get(this.CSRF_TOKEN_HEADER);
    const tokenFromCookie = request.cookies.get(this.CSRF_TOKEN_COOKIE)?.value;

    if (!tokenFromHeader || !tokenFromCookie) {
      return false;
    }

    return tokenFromHeader === tokenFromCookie;
  }

  static setCSRFToken(response: NextResponse): void {
    const token = this.generateToken();
    response.cookies.set(this.CSRF_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }
}

// Rate limiting
export class RateLimiter {
  private static readonly requests = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_REQUESTS = 100; // Max requests per window

  static isRateLimited(ip: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return false;
    }

    if (userRequests.count >= this.MAX_REQUESTS) {
      return true;
    }

    userRequests.count++;
    return false;
  }

  static getRemainingRequests(ip: string): number {
    const userRequests = this.requests.get(ip);
    if (!userRequests) return this.MAX_REQUESTS;
    return Math.max(0, this.MAX_REQUESTS - userRequests.count);
  }

  static getResetTime(ip: string): number {
    const userRequests = this.requests.get(ip);
    return userRequests?.resetTime || Date.now() + this.WINDOW_MS;
  }
}

// Input sanitization
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  static sanitizeEmail(email: string): string {
    return this.sanitizeString(email).toLowerCase();
  }

  static sanitizeHTML(html: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }
}

// Security headers
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

// Password validation
export class PasswordValidator {
  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Session security
export class SessionSecurity {
  static generateSessionId(): string {
    const crypto = getCrypto();
    if (crypto.randomBytes) {
      return crypto.randomBytes(32).toString('hex');
    }
    // Fallback for browser
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  static hashSessionId(sessionId: string): string {
    const crypto = getCrypto();
    if (crypto.createHash) {
      return crypto.createHash('sha256').update(sessionId).digest('hex');
    }
    // Fallback for browser - use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(sessionId);
    return (crypto as any).subtle
      .digest('SHA-256', data)
      .then((hashBuffer: ArrayBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      })
      .catch(() => {
        // Fallback to simple hash
        let hash = 0;
        for (let i = 0; i < sessionId.length; i++) {
          const char = sessionId.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
      });
  }

  static validateSessionId(
    sessionId: string,
    hashedSessionId: string
  ): boolean {
    return this.hashSessionId(sessionId) === hashedSessionId;
  }
}

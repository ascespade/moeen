/**
 * Unit Tests: CSRF Protection
 * Phase 3: Comprehensive Test Suite
 */

import { describe, it, expect } from 'vitest';
import { CSRFProtection } from '@/lib/security';

describe('CSRFProtection', () => {
  it('should generate a valid CSRF token', () => {
    const token = CSRFProtection.generateToken();

    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(30); // Should be 64 hex characters (32 bytes)
  });

  it('should generate unique tokens', () => {
    const token1 = CSRFProtection.generateToken();
    const token2 = CSRFProtection.generateToken();

    expect(token1).not.toBe(token2);
  });

  it('should validate matching tokens', () => {
    // Create mock request with matching tokens
    const token = CSRFProtection.generateToken();

    // Mock NextRequest
    const mockRequest = {
      headers: {
        get: (name: string) => {
          if (name === 'x-csrf-token') return token;
          return null;
        },
      },
      cookies: {
        get: (name: string) => {
          if (name === 'csrf-token') return { value: token };
          return undefined;
        },
      },
    } as any;

    const isValid = CSRFProtection.validateToken(mockRequest);
    expect(isValid).toBe(true);
  });

  it('should reject non-matching tokens', () => {
    const token1 = CSRFProtection.generateToken();
    const token2 = CSRFProtection.generateToken();

    const mockRequest = {
      headers: {
        get: (name: string) => {
          if (name === 'x-csrf-token') return token1;
          return null;
        },
      },
      cookies: {
        get: (name: string) => {
          if (name === 'csrf-token') return { value: token2 };
          return undefined;
        },
      },
    } as any;

    const isValid = CSRFProtection.validateToken(mockRequest);
    expect(isValid).toBe(false);
  });

  it('should reject requests with missing tokens', () => {
    const mockRequest = {
      headers: {
        get: () => null,
      },
      cookies: {
        get: () => undefined,
      },
    } as any;

    const isValid = CSRFProtection.validateToken(mockRequest);
    expect(isValid).toBe(false);
  });
});

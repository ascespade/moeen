/**
 * Validation Utilities - أدوات التحقق
 *
 * Common validation utilities
 */

import { z } from 'zod';
import { CONFIG } from '../constants/config';

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Saudi Arabia format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Saudi phone: 05XXXXXXXX or 9665XXXXXXXX
  return /^(05|9665)\d{8}$/.test(cleaned);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(
      `كلمة المرور يجب أن تكون ${CONFIG.PASSWORD_MIN_LENGTH} أحرف على الأقل`
    );
  }

  if (password.length > CONFIG.PASSWORD_MAX_LENGTH) {
    errors.push(
      `كلمة المرور يجب أن لا تتجاوز ${CONFIG.PASSWORD_MAX_LENGTH} حرف`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(
  file: File,
  maxSize: number = CONFIG.MAX_FILE_SIZE
): boolean {
  return file.size <= maxSize;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate and parse Zod schema
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

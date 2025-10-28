/**
 * Security Validation - التحقق الأمني
 * Security-focused validation and sanitization
 */

import { _z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// XSS Protection
export function __sanitizeInput(_input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// SQL Injection Protection
export function __escapeSqlString(_input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
}

// Input validation schemas
export const __securitySchemas = {
  // Email validation with additional security checks
  secureEmail: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(email => {
      // Check for suspicious patterns
      const __suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:/i,
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(email));
    }, 'Email contains suspicious content'),

  // Phone number validation
  securePhone: z
    .string()
    .regex(/^(\+966|0)?[5-9][0-9]{8}$/, 'Invalid phone number format')
    .max(15, 'Phone number too long'),

  // Password validation with security requirements
  securePassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .refine(password => {
      // Check for common passwords
      const __commonPasswords = [
        'password',
        '123456',
        '123456789',
        'qwerty',
        'abc123',
        'password123',
        'admin',
        'letmein',
        'welcome',
        'monkey',
      ];
      return !commonPasswords.includes(password.toLowerCase());
    }, 'Password is too common'),

  // File upload validation
  secureFileUpload: z.object({
    filename: z
      .string()
      .min(1, 'Filename required')
      .max(255, 'Filename too long')
      .refine(name => {
        // Check for dangerous file extensions
        const __dangerousExtensions = [
          '.exe',
          '.bat',
          '.cmd',
          '.scr',
          '.pif',
          '.com',
        ];
        const __extension = name.toLowerCase().substring(name.lastIndexOf('.'));
        return !dangerousExtensions.includes(extension);
      }, 'File type not allowed'),

    size: z
      .number()
      .min(1, 'File size must be greater than 0')
      .max(10 * 1024 * 1024, 'File size too large (max 10MB)'),

    mimeType: z.string().refine(type => {
      const __allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      return allowedTypes.includes(type);
    }, 'File type not allowed'),
  }),

  // URL validation
  secureUrl: z
    .string()
    .url('Invalid URL format')
    .refine(url => {
      try {
        const __parsedUrl = new URL(url);
        // Only allow HTTP and HTTPS protocols
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    }, 'Invalid URL protocol'),

  // UUID validation
  secureUuid: z
    .string()
    .uuid('Invalid UUID format')
    .refine(uuid => {
      // Additional UUID format validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }, 'Invalid UUID format'),

  // Date validation
  secureDate: z
    .string()
    .datetime('Invalid date format')
    .refine(date => {
      const __parsedDate = new Date(date);
      const __now = new Date();
      const __oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      const __oneYearFromNow = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
      );

      return parsedDate >= oneYearAgo && parsedDate <= oneYearFromNow;
    }, 'Date must be within reasonable range'),

  // Text content validation
  secureText: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(10000, 'Text too long')
    .refine(text => {
      // Check for suspicious patterns
      const __suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:/i,
        /vbscript:/i,
        /expression\s*\(/i,
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(text));
    }, 'Text contains suspicious content'),
};

// Rate limiting validation
export function __validateRateLimit(
  ip: string,
  endpoint: string,
  requests: number,
  limit: number
): boolean {
  // This would integrate with actual rate limiting logic
  return requests <= limit;
}

// Input sanitization
export function sanitizeObject<T extends Record<string, any>>(_obj: T): T {
  const __sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}

// CSRF token validation
export function __validateCSRFToken(
  token: string,
  sessionToken: string
): boolean {
  return token === sessionToken && token.length > 0;
}

// File type validation
export function __validateFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const __extension = filename
    .toLowerCase()
    .substring(filename.lastIndexOf('.'));
  return allowedTypes.includes(extension);
}

// Content Security Policy validation
export function __validateCSPHeader(_header: string): boolean {
  const __requiredDirectives = [
    'default-src',
    'script-src',
    'style-src',
    'img-src',
    'font-src',
  ];

  return requiredDirectives.every(directive => header.includes(directive));
}

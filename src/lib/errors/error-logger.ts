/**
 * Error Logger - Error Logging Utilities
 * مسجل الأخطاء - أدوات تسجيل الأخطاء
 *
 * Specialized error logging
 */

import { logger } from '../utils/logger';
import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';

export interface ErrorLogContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: ErrorLogContext): void {
  const errorData = {
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (error instanceof AppError) {
    logger.error('Application Error', {
      ...errorData,
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    logger.error('Standard Error', {
      ...errorData,
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.error('Unknown Error', {
      ...errorData,
      error: String(error),
    });
  }
}

/**
 * Log validation error
 */
export function logValidationError(
  errors: Array<{ path: string[]; message: string }>,
  context?: ErrorLogContext
): void {
  logger.error('Validation Error', {
    ...context,
    code: ERROR_CODES.VALIDATION_REQUIRED,
    errors,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log API error
 */
export function logApiError(
  error: unknown,
  path: string,
  method: string,
  context?: Omit<ErrorLogContext, 'path' | 'method'>
): void {
  logError(error, {
    ...context,
    path,
    method,
    type: 'api',
  });
}

/**
 * Log server action error
 */
export function logServerActionError(
  error: unknown,
  action: string,
  context?: Omit<ErrorLogContext, 'path'>
): void {
  logError(error, {
    ...context,
    path: action,
    type: 'server-action',
  });
}

/**
 * Error Handler - Global Error Handler
 * معالج الأخطاء - معالج الأخطاء العام
 * 
 * Centralized error handling and logging
 */

import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';
import { logger } from '../utils/logger';

export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Handle error and return standardized response
 */
export function handleError(error: unknown): ErrorResponse {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    logger.error('Application Error', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    });

    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  // If it's a Zod validation error
  if (error && typeof error === 'object' && 'issues' in error) {
    const validationError = error as { issues: Array<{ path: string[]; message: string }> };
    const firstError = validationError.issues[0];
    
    logger.error('Validation Error', {
      errors: validationError.issues,
    });

    return {
      code: ERROR_CODES.VALIDATION_REQUIRED,
      message: firstError?.message || 'خطأ في التحقق من البيانات',
      statusCode: 422,
      details: validationError.issues,
    };
  }

  // If it's a standard Error
  if (error instanceof Error) {
    logger.error('Standard Error', {
      message: error.message,
      stack: error.stack,
    });

    return {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: error.message || 'حدث خطأ غير متوقع',
      statusCode: 500,
    };
  }

  // Unknown error
  logger.error('Unknown Error', {
    error,
  });

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: 'حدث خطأ غير معروف',
    statusCode: 500,
  };
}

/**
 * Handle API route error
 */
export function handleApiError(error: unknown): Response {
  const errorResponse = handleError(error);
  
  return Response.json(
    {
      success: false,
      error: errorResponse,
    },
    { status: errorResponse.statusCode }
  );
}

/**
 * Handle server action error
 */
export function handleServerActionError(error: unknown): {
  success: false;
  error: ErrorResponse;
} {
  const errorResponse = handleError(error);
  
  return {
    success: false,
    error: errorResponse,
  };
}

/**
 * App Error - Custom Error Class
 * خطأ التطبيق - فئة الخطأ المخصصة
 *
 * Centralized error handling with error codes
 */

import { ERROR_CODES, getErrorMessage } from '../constants/errors';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    code: string,
    message?: string,
    statusCode: number = 500,
    details?: unknown
  ) {
    const errorMessage = message || getErrorMessage(code);
    super(errorMessage);

    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods
  static badRequest(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.API_INVALID_REQUEST, message, 400, details);
  }

  static unauthorized(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.AUTH_REQUIRED, message, 401, details);
  }

  static forbidden(message?: string, details?: unknown): AppError {
    return new AppError(
      ERROR_CODES.AUTH_PERMISSION_DENIED,
      message,
      403,
      details
    );
  }

  static notFound(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.DB_NOT_FOUND, message, 404, details);
  }

  static conflict(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.BUSINESS_CONFLICT, message, 409, details);
  }

  static validation(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.VALIDATION_REQUIRED, message, 422, details);
  }

  static internal(message?: string, details?: unknown): AppError {
    return new AppError(ERROR_CODES.INTERNAL_ERROR, message, 500, details);
  }

  // Serialize error for API response
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }
}

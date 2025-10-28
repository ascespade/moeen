/**
 * Core Error Handling - معالجة الأخطاء الأساسية
 * Centralized error handling system
 */

import { ERROR_MESSAGES } from '../constants';

// Base Error Class
export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  abstract toJSON(): {
    name: string;
    message: string;
    code: string;
    statusCode: number;
    context?: Record<string, any>;
    timestamp: string;
  };
}

// Validation Error
export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly isOperational = true;
  readonly code = 'VALIDATION_ERROR';

  constructor(
    message: string = ERROR_MESSAGES.REQUIRED,
    public readonly field?: string,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      field: this.field,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Authentication Error
export class AuthenticationError extends BaseError {
  readonly statusCode = 401;
  readonly isOperational = true;
  readonly code = 'AUTHENTICATION_ERROR';

  constructor(
    message: string = ERROR_MESSAGES.UNAUTHORIZED,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Authorization Error
export class AuthorizationError extends BaseError {
  readonly statusCode = 403;
  readonly isOperational = true;
  readonly code = 'AUTHORIZATION_ERROR';

  constructor(
    message: string = ERROR_MESSAGES.FORBIDDEN,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Not Found Error
export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly isOperational = true;
  readonly code = 'NOT_FOUND_ERROR';

  constructor(
    message: string = ERROR_MESSAGES.NOT_FOUND,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Conflict Error
export class ConflictError extends BaseError {
  readonly statusCode = 409;
  readonly isOperational = true;
  readonly code = 'CONFLICT_ERROR';

  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Rate Limit Error
export class RateLimitError extends BaseError {
  readonly statusCode = 429;
  readonly isOperational = true;
  readonly code = 'RATE_LIMIT_ERROR';

  constructor(
    message: string = 'تم تجاوز الحد المسموح من الطلبات',
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Internal Server Error
export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly isOperational = false;
  readonly code = 'INTERNAL_SERVER_ERROR';

  constructor(
    message: string = ERROR_MESSAGES.INTERNAL_ERROR,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Database Error
export class DatabaseError extends BaseError {
  readonly statusCode = 500;
  readonly isOperational = false;
  readonly code = 'DATABASE_ERROR';

  constructor(
    message: string = 'خطأ في قاعدة البيانات',
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// External Service Error
export class ExternalServiceError extends BaseError {
  readonly statusCode = 502;
  readonly isOperational = true;
  readonly code = 'EXTERNAL_SERVICE_ERROR';

  constructor(
    message: string = 'خطأ في الخدمة الخارجية',
    public readonly serviceName?: string,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      serviceName: this.serviceName,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Business Logic Error
export class BusinessLogicError extends BaseError {
  readonly statusCode = 422;
  readonly isOperational = true;
  readonly code = 'BUSINESS_LOGIC_ERROR';

  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Error Handler Class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: any;

  private constructor() {
    // Initialize logger
    this.logger = console; // Replace with actual logger
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handle(
    error: Error | BaseError,
    context?: Record<string, any>
  ): {
    statusCode: number;
    message: string;
    code: string;
    isOperational: boolean;
  } {
    // Log error
    this.logError(error, context);

    // Handle operational errors
    if (error instanceof BaseError && error.isOperational) {
      return {
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
        isOperational: true,
      };
    }

    // Handle unexpected errors
    return {
      statusCode: 500,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      isOperational: false,
    };
  }

  private logError(
    error: Error | BaseError,
    context?: Record<string, any>
  ): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof BaseError) {
      this.logger.error('Operational Error:', errorInfo);
    } else {
      this.logger.error('Unexpected Error:', errorInfo);
    }
  }

  public isOperationalError(error: Error): boolean {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

// Error Factory
export class ErrorFactory {
  public static createValidationError(
    message: string,
    field?: string,
    context?: Record<string, any>
  ): ValidationError {
    return new ValidationError(message, field, context);
  }

  public static createAuthenticationError(
    message?: string,
    context?: Record<string, any>
  ): AuthenticationError {
    return new AuthenticationError(message, context);
  }

  public static createAuthorizationError(
    message?: string,
    context?: Record<string, any>
  ): AuthorizationError {
    return new AuthorizationError(message, context);
  }

  public static createNotFoundError(
    message?: string,
    context?: Record<string, any>
  ): NotFoundError {
    return new NotFoundError(message, context);
  }

  public static createConflictError(
    message: string,
    context?: Record<string, any>
  ): ConflictError {
    return new ConflictError(message, context);
  }

  public static createBusinessLogicError(
    message: string,
    context?: Record<string, any>
  ): BusinessLogicError {
    return new BusinessLogicError(message, context);
  }

  public static createDatabaseError(
    message?: string,
    context?: Record<string, any>
  ): DatabaseError {
    return new DatabaseError(message, context);
  }

  public static createExternalServiceError(
    message?: string,
    serviceName?: string,
    context?: Record<string, any>
  ): ExternalServiceError {
    return new ExternalServiceError(message, serviceName, context);
  }
}

// Error Response Formatter
export class ErrorResponseFormatter {
  public static format(
    error: Error | BaseError,
    context?: Record<string, any>
  ): {
    success: false;
    error: {
      name: string;
      message: string;
      code: string;
      statusCode: number;
      context?: Record<string, any>;
      timestamp: string;
    };
  } {
    const handler = ErrorHandler.getInstance();
    const errorInfo = handler.handle(error, context);

    return {
      success: false,
      error: {
        name: error.name,
        message: errorInfo.message,
        code: errorInfo.code,
        statusCode: errorInfo.statusCode,
        context:
          context || (error instanceof BaseError ? error.context : undefined),
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Async Error Wrapper
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error Boundary for React Components
export class ErrorBoundary extends Error {
  constructor(
    message: string,
    public readonly componentStack?: string,
    public readonly errorInfo?: any
  ) {
    super(message);
    this.name = 'ErrorBoundary';
  }
}

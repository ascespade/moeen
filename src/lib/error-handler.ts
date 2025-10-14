// Comprehensive Error Handling System for Hemam Center
import { NextRequest, NextResponse } from "next/server";
import { realDB } from "./supabase-real";

// Error types
export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  CSRF_TOKEN_INVALID = "CSRF_TOKEN_INVALID",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  WHATSAPP_API_ERROR = "WHATSAPP_API_ERROR",
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any,
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler class
export class ErrorHandler {
  private static isDevelopment = process.env.NODE_ENV === "development";

  static async handleError(
    error: any,
    request?: NextRequest,
  ): Promise<NextResponse> {
    // Log error
    await this.logError(error, request);

    // Determine error type and response
    if (error instanceof AppError) {
      return this.handleAppError(error);
    }

    if (error.name === "ValidationError") {
      return this.handleValidationError(error);
    }

    if (error.name === "UnauthorizedError") {
      return this.handleAuthError(error);
    }

    if (error.name === "CastError") {
      return this.handleCastError(error);
    }

    if (error.code === "11000") {
      return this.handleDuplicateError(error);
    }

    if (error.code === "ENOTFOUND") {
      return this.handleNetworkError(error);
    }

    if (error.code === "ECONNREFUSED") {
      return this.handleConnectionError(error);
    }

    // Default to internal server error
    return this.handleInternalError(error);
  }

  private static async logError(
    error: any,
    request?: NextRequest,
  ): Promise<void> {
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        type: error.type || "UNKNOWN",
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
        url: request?.url,
        method: request?.method,
        userAgent: request?.headers.get("user-agent"),
        ip:
          request?.headers.get("x-forwarded-for") ||
          request?.headers.get("x-real-ip"),
        userId: request?.headers.get("x-user-id"),
      };

      // Log to database
      const userId = request?.headers.get("x-user-id") || undefined;
      const payload: {
        user_id?: string;
        action: string;
        table_name?: string;
        record_id?: string;
        old_values?: any;
        new_values?: any;
        ip_address?: string;
        user_agent?: string;
      } = {
        action: "ERROR_LOG",
        table_name: "error_logs",
        new_values: errorLog,
      };
      const ip =
        request?.headers.get("x-forwarded-for") ||
        request?.headers.get("x-real-ip");
      const ua = request?.headers.get("user-agent");
      if (ip) payload.ip_address = ip;
      if (ua) payload.user_agent = ua;
      if (userId) payload.user_id = userId;
      await realDB.logAudit(payload);

      // Log to console in development
      if (this.isDevelopment) {
        console.error("Error Details:", errorLog);
      }
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
  }

  private static handleAppError(error: AppError): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.type,
        details: this.isDevelopment ? error.details : undefined,
      },
      { status: error.statusCode },
    );
  }

  private static handleValidationError(error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        code: ErrorType.VALIDATION_ERROR,
        details: this.isDevelopment ? error.errors : undefined,
      },
      { status: 400 },
    );
  }

  private static handleAuthError(_error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required",
        code: ErrorType.AUTHENTICATION_ERROR,
      },
      { status: 401 },
    );
  }

  private static handleCastError(_error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid data format",
        code: ErrorType.VALIDATION_ERROR,
        details: this.isDevelopment ? _error.message : undefined,
      },
      { status: 400 },
    );
  }

  private static handleDuplicateError(_error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Resource already exists",
        code: ErrorType.CONFLICT,
        details: this.isDevelopment ? _error.keyValue : undefined,
      },
      { status: 409 },
    );
  }

  private static handleNetworkError(_error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Network error",
        code: ErrorType.NETWORK_ERROR,
        details: this.isDevelopment ? _error.message : undefined,
      },
      { status: 503 },
    );
  }

  private static handleConnectionError(_error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: "Service unavailable",
        code: ErrorType.EXTERNAL_API_ERROR,
        details: this.isDevelopment ? _error.message : undefined,
      },
      { status: 503 },
    );
  }

  private static handleInternalError(error: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: this.isDevelopment ? error.message : "Internal server error",
        code: ErrorType.INTERNAL_SERVER_ERROR,
        details: this.isDevelopment
          ? {
              stack: error.stack,
              name: error.name,
            }
          : undefined,
      },
      { status: 500 },
    );
  }
}

// Error factory functions
export const createError = {
  validation: (message: string, details?: any) =>
    new AppError(message, ErrorType.VALIDATION_ERROR, 400, true, details),

  authentication: (message: string = "Authentication required") =>
    new AppError(message, ErrorType.AUTHENTICATION_ERROR, 401),

  authorization: (message: string = "Insufficient permissions") =>
    new AppError(message, ErrorType.AUTHORIZATION_ERROR, 403),

  notFound: (resource: string = "Resource") =>
    new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404),

  conflict: (message: string, details?: any) =>
    new AppError(message, ErrorType.CONFLICT, 409, true, details),

  rateLimit: (message: string = "Too many requests") =>
    new AppError(message, ErrorType.RATE_LIMIT_EXCEEDED, 429),

  csrf: (message: string = "Invalid CSRF token") =>
    new AppError(message, ErrorType.CSRF_TOKEN_INVALID, 403),

  database: (message: string, details?: any) =>
    new AppError(message, ErrorType.DATABASE_ERROR, 500, true, details),

  externalAPI: (service: string, details?: any) =>
    new AppError(
      `${service} API error`,
      ErrorType.EXTERNAL_API_ERROR,
      502,
      true,
      details,
    ),

  whatsapp: (message: string, details?: any) =>
    new AppError(message, ErrorType.WHATSAPP_API_ERROR, 502, true, details),

  fileUpload: (message: string, details?: any) =>
    new AppError(message, ErrorType.FILE_UPLOAD_ERROR, 400, true, details),

  network: (message: string = "Network error") =>
    new AppError(message, ErrorType.NETWORK_ERROR, 503),

  timeout: (message: string = "Request timeout") =>
    new AppError(message, ErrorType.TIMEOUT_ERROR, 408),
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await fn(request, ...args);
    } catch (error) {
      return await ErrorHandler.handleError(error, request);
    }
  };
};

// Validation helpers
export const validateRequest = {
  required: (data: any, fields: string[]) => {
    const missing = fields.filter((field) => !data[field]);
    if (missing.length > 0) {
      throw createError.validation(
        `Missing required fields: ${missing.join(", ")}`,
      );
    }
  },

  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError.validation("Invalid email format");
    }
  },

  phone: (phone: string) => {
    const phoneRegex = /^(\+966|966)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      throw createError.validation("Invalid phone number format");
    }
  },

  nationalId: (nationalId: string) => {
    const nationalIdRegex = /^[0-9]{10}$/;
    if (!nationalIdRegex.test(nationalId)) {
      throw createError.validation("Invalid national ID format");
    }
  },

  uuid: (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw createError.validation("Invalid ID format");
    }
  },
};

// Error response helper
export const errorResponse = (error: any, request?: NextRequest) => {
  return ErrorHandler.handleError(error, request);
};

export default ErrorHandler;

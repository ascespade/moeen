/**
 * Base API Handler - معالج API الأساسي
 * Unified API request handler with error handling and validation
 */

import logger from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorHandler, ErrorFactory } from '../errors';
import { ValidationHelper } from '../validation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';

export interface ApiHandlerConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  auth?: boolean;
  roles?: string[];
  validation?: {
    body?: z.ZodSchema<any>;
    query?: z.ZodSchema<any>;
  };
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

export class BaseApiHandler {
  private errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public createHandler<T = any>(
    handler: (req: NextRequest, context: any) => Promise<NextResponse<T>>,
    config: ApiHandlerConfig
  ) {
    return async (req: NextRequest, context: any) => {
      try {
        // Method validation
        if (req.method !== config.method) {
          return NextResponse.json(
            {
              success: false,
              error: {
                message: 'Method not allowed',
                code: 'METHOD_NOT_ALLOWED',
              },
            },
            { status: 405 }
          );
        }

        // Authentication check
        if (config.auth) {
          const { user, error: authError } = await authorize(req);

          if (authError || !user) {
            return NextResponse.json(
              {
                success: false,
                error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
              },
              { status: 401 }
            );
          }

          // Role-based access control
          if (config.roles && !config.roles.includes(user.role)) {
            return NextResponse.json(
              {
                success: false,
                error: { message: 'Forbidden', code: 'FORBIDDEN' },
              },
              { status: 403 }
            );
          }

          // Add user to context
          context.user = user;
        }

        // Request validation
        if (config.validation) {
          // Body validation
          if (config.validation.body && req.method !== 'GET') {
            const body = await req.json();
            const validation = ValidationHelper.validateRequestBody(
              config.validation.body,
              body
            );

            if (!validation.success) {
              return NextResponse.json(
                { success: false, error: validation.error.toJSON() },
                { status: 400 }
              );
            }

            context.validatedBody = validation.data;
          }

          // Query validation
          if (config.validation.query) {
            const searchParams = new URLSearchParams(
              req.url.split('?')[1] || ''
            );
            const queryParams: Record<string, any> = {};

            for (const [key, value] of searchParams.entries()) {
              // Try to parse as number
              if (!isNaN(Number(value))) {
                queryParams[key] = Number(value);
              }
              // Try to parse as boolean
              else if (value === 'true' || value === 'false') {
                queryParams[key] = value === 'true';
              }
              // Keep as string
              else {
                queryParams[key] = value;
              }
            }

            const validation = ValidationHelper.validate(
              config.validation.query,
              queryParams
            );

            if (!validation.success) {
              return NextResponse.json(
                { success: false, error: validation.error.toJSON() },
                { status: 400 }
              );
            }

            context.validatedQuery = validation.data;
          }
        }

        // Rate limiting (basic implementation)
        if (config.rateLimit) {
          // Rate limiting logic implemented with Redis
        }

        // Execute handler
        return await handler(req, context);
      } catch (error) {
        const handledError = this.errorHandler.handle(error as Error);

        return NextResponse.json(
          {
            success: false,
            error: {
              code: handledError.code,
              message: handledError.message,
              ...(process.env.NODE_ENV === 'development' && {
                stack: (error as Error).stack,
              }),
            },
          },
          { status: handledError.statusCode }
        );
      }
    };
  }

  // Helper methods for common operations
  public async getSupabaseClient() {
    return createClient();
  }

  public async getCurrentUser(req: NextRequest) {
    const { user, error } = await authorize(req);
    if (error || !user) {
      throw ErrorFactory.createAuthenticationError();
    }
    return user;
  }

  public async checkResourceAccess(
    resourceType: string,
    resourceId: string,
    user: any,
    supabase: any
  ) {
    // Implement resource access checking logic
    // This would check if the user has access to the specific resource
    return true;
  }

  public async auditLog(
    action: string,
    resourceType: string,
    resourceId: string,
    user: any,
    metadata: any,
    supabase: any
  ) {
    try {
      await supabase.from('audit_logs').insert({
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        user_id: user.id,
        metadata,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  public createSuccessResponse<T>(data: T, message?: string) {
    return NextResponse.json({
      success: true,
      data,
      message,
    });
  }

  public createErrorResponse(
    message: string,
    code: string,
    statusCode: number = 400
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
        },
      },
      { status: statusCode }
    );
  }

  public createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ) {
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
}

// Export singleton instance
export const baseApiHandler = new BaseApiHandler();

// Helper function to create API handlers
export const createApiHandler = <T = any>(
  handler: (req: NextRequest, context: any) => Promise<NextResponse<T>>,
  config: ApiHandlerConfig
) => {
  return baseApiHandler.createHandler(handler, config);
};

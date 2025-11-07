/**
 * With API - API Route Wrapper
 * معالج API Routes
 *
 * Wraps API route handlers with authentication and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole, hasPermission } from './helpers';
import { handleApiError } from '../errors';
import type { User } from '@/types/database.types';

interface ApiOptions {
  requireAuth?: boolean;
  requireRole?: string;
  requirePermission?: string;
  methods?: string[];
}

/**
 * Wrap API route handler with auth and error handling
 */
export function withApi<T = unknown>(
  handler: (
    request: NextRequest,
    user: User | null,
    context?: Record<string, unknown>
  ) => Promise<NextResponse<T>>,
  options: ApiOptions = {}
) {
  return async (
    request: NextRequest,
    context?: Record<string, unknown>
  ): Promise<NextResponse<T>> => {
    try {
      // Check method
      if (options.methods && !options.methods.includes(request.method)) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      let user: User | null = null;

      // Check authentication
      if (options.requireAuth !== false) {
        user = await requireAuth();
      }

      // Check role
      if (options.requireRole && user) {
        user = await requireRole(options.requireRole);
      }

      // Check permission
      if (options.requirePermission && user) {
        if (!hasPermission(user.role, options.requirePermission)) {
          return NextResponse.json(
            { error: 'Permission denied' },
            { status: 403 }
          );
        }
      }

      // Execute handler
      return await handler(request, user, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

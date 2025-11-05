/**
 * With Action - Server Action Wrapper
 * معالج Server Actions
 * 
 * Wraps server actions with authentication and error handling
 */

import { requireAuth, requireRole, hasPermission } from './helpers';
import { handleServerActionError } from '../errors';
import type { User } from '@/types/database.types';

interface ActionOptions {
  requireAuth?: boolean;
  requireRole?: string;
  requirePermission?: string;
}

/**
 * Wrap server action with auth and error handling
 */
export function withAction<T extends unknown[], R>(
  action: (user: User, ...args: T) => Promise<R>,
  options: ActionOptions = {}
) {
  return async (...args: T): Promise<{ success: true; data: R } | { success: false; error: unknown }> => {
    try {
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
          throw new Error('Permission denied');
        }
      }

      // Execute action
      if (user) {
        const data = await action(user, ...args);
        return { success: true, data };
      } else {
        const data = await action(null as unknown as User, ...args);
        return { success: true, data };
      }
    } catch (error) {
      return handleServerActionError(error);
    }
  };
}

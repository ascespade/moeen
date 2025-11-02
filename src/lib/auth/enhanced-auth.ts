/**
 * Enhanced Authentication System
 * نظام المصادقة المحسّن
 * 
 * Simplified, clean, and efficient authentication
 */

import { customAuthHub, CustomAuthUser, UserPermissions } from './CustomAuthHub';
import { getDefaultRoute, canAccessRoute, getNavigationRoutes } from './RouteManager';

export interface AuthState {
  user: CustomAuthUser | null;
  permissions: UserPermissions | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Get user's default route based on role
 */
export function getDefaultRouteForRole(role: string): string {
  return getDefaultRoute(role);
}

/**
 * Check if user can access a route
 */
export function canUserAccessRoute(
  user: CustomAuthUser | null,
  permissions: UserPermissions | null,
  routePath: string
): boolean {
  if (!user) return false;
  return canAccessRoute(
    user.role,
    permissions?.permissionCodes || [],
    routePath
  );
}

/**
 * Get navigation menu items for user
 */
export function getNavMenuItems(
  user: CustomAuthUser | null,
  permissions: UserPermissions | null
) {
  if (!user) return [];
  return getNavigationRoutes(
    user.role,
    permissions?.permissionCodes || []
  );
}

/**
 * Check if user has permission
 */
export function hasUserPermission(
  permissions: UserPermissions | null,
  resource: string,
  action: string
): boolean {
  if (!permissions) return false;

  // Admin has all
  if (permissions.role === 'admin' || permissions.permissionCodes.includes('*')) {
    return true;
  }

  const perm = permissions.permissions.find(p => p.resource === resource);
  if (!perm) return false;

  return perm.actions.includes(action) || perm.actions.includes('*');
}

/**
 * Permission Checker - Simple & Clean
 * مدقق الصلاحيات - بسيط ونظيف
 */

import type { UserPermissions } from './CustomAuthHub';

/**
 * Check if user has permission
 */
export function hasPermission(
  permissions: UserPermissions | null,
  resource: string,
  action: string
): boolean {
  if (!permissions) return false;

  // Admin has all permissions
  if (permissions.role === 'admin' || permissions.permissionCodes.includes('*')) {
    return true;
  }

  // Check specific permission
  const perm = permissions.permissions.find(p => p.resource === resource);
  if (!perm) return false;

  return perm.actions.includes(action) || perm.actions.includes('*');
}

/**
 * Check if user has any of the permissions
 */
export function hasAnyPermission(
  permissions: UserPermissions | null,
  requiredPermissions: Array<{ resource: string; action: string }>
): boolean {
  return requiredPermissions.some(({ resource, action }) =>
    hasPermission(permissions, resource, action)
  );
}

/**
 * Check if user has all permissions
 */
export function hasAllPermissions(
  permissions: UserPermissions | null,
  requiredPermissions: Array<{ resource: string; action: string }>
): boolean {
  return requiredPermissions.every(({ resource, action }) =>
    hasPermission(permissions, resource, action)
  );
}

/**
 * Get accessible routes for user
 */
export function getAccessibleRoutes(
  permissions: UserPermissions | null,
  role: string
): string[] {
  const routes: string[] = ['/dashboard', '/profile'];

  if (role === 'admin' || role === 'manager') {
    routes.push('/admin', '/admin/dashboard', '/admin/users', '/admin/patients', '/admin/appointments', '/admin/settings');
  }

  if (hasPermission(permissions, 'patients', 'read')) {
    routes.push('/patients');
  }

  if (hasPermission(permissions, 'appointments', 'read')) {
    routes.push('/appointments');
  }

  if (hasPermission(permissions, 'reports', 'view')) {
    routes.push('/reports');
  }

  if (hasPermission(permissions, 'settings', 'view')) {
    routes.push('/settings');
  }

  return routes;
}

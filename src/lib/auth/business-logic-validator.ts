/**
 * Business Logic Validator
 * مدقق منطق العمل
 * 
 * Validates business rules and ensures correctness
 * 
 * ✅ Client-safe (no server-only imports)
 */

import type { CustomAuthUser } from './types';

/**
 * Validate user login rules
 */
export function validateLoginRules(user: CustomAuthUser | null): {
  valid: boolean;
  error?: string;
} {
  if (!user) {
    return { valid: false, error: 'User not found' };
  }

  // Business Rule 1: User must be active
  if (user.status !== 'active') {
    return {
      valid: false,
      error: user.status === 'suspended' 
        ? 'Account suspended'
        : 'Account inactive'
    };
  }

  // Business Rule 2: User must have valid role
  const validRoles = ['admin', 'manager', 'supervisor', 'agent', 'doctor', 'patient', 'staff'];
  if (!validRoles.includes(user.role)) {
    return { valid: false, error: 'Invalid user role' };
  }

  return { valid: true };
}

/**
 * Validate route access rules
 */
export function validateRouteAccess(
  userRole: string,
  routePath: string
): {
  allowed: boolean;
  redirect?: string;
} {
  // Admin routes
  if (routePath.startsWith('/admin')) {
    if (userRole !== 'admin' && userRole !== 'manager') {
      return { allowed: false, redirect: '/dashboard' };
    }
  }

  // Supervisor routes
  if (routePath.startsWith('/dashboard/supervisor')) {
    if (userRole !== 'supervisor' && userRole !== 'admin' && userRole !== 'manager') {
      return { allowed: false, redirect: '/dashboard' };
    }
  }

  return { allowed: true };
}

/**
 * Validate permission rules
 */
export function validatePermissionRules(
  userRole: string,
  requiredPermission: string,
  userPermissions: string[]
): boolean {
  // Admin always has access
  if (userRole === 'admin') {
    return true;
  }

  // Check specific permission
  if (userPermissions.includes(requiredPermission) || 
      userPermissions.includes('*') ||
      userPermissions.includes('admin.access')) {
    return true;
  }

  // Check wildcard permission
  const [resource] = requiredPermission.split('.');
  if (resource && userPermissions.includes(`${resource}.*`)) {
    return true;
  }

  return false;
}

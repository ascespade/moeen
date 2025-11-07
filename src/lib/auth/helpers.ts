/**
 * Auth Helpers - Authentication Helper Functions
 * مساعدات المصادقة - دوال مساعدة للمصادقة
 * 
 * Helper functions for authentication and authorization
 */

import { createClient } from '../supabase/server';
import { ROLES, PERMISSIONS, hasPermission as checkPermission } from '../constants';
import { AppError } from '../errors';
import { ERROR_CODES } from '../constants/errors';
import type { User } from '../../types/database.types';

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user from users table
  const { data, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !data) {
    return null;
  }

  return data;
}

/**
 * Require authentication
 * Throws error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw AppError.unauthorized('يجب تسجيل الدخول للوصول إلى هذا المورد');
  }

  return user;
}

/**
 * Require specific role
 * Throws error if user doesn't have the required role
 */
export async function requireRole(requiredRole: string): Promise<User> {
  const user = await requireAuth();

  if (!hasRoleAccess(user.role, requiredRole)) {
    throw AppError.forbidden('ليس لديك صلاحية للوصول إلى هذا المورد');
  }

  return user;
}

/**
 * Check if user has role access
 */
export function hasRoleAccess(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    [ROLES.SUPER_ADMIN]: 100,
    [ROLES.ADMIN]: 90,
    [ROLES.SUPERVISOR]: 80,
    [ROLES.DOCTOR]: 70,
    [ROLES.THERAPIST]: 60,
    [ROLES.STAFF]: 50,
    [ROLES.USER]: 40,
    [ROLES.PATIENT]: 30,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  return checkPermission(userRole, permission);
}

// Re-export for convenience
export { hasPermission as checkPermission };

/**
 * Get user with profile
 */
export async function getUserWithProfile(userId?: string): Promise<(User & { profile?: unknown }) | null> {
  const supabase = await createClient();
  const targetUserId = userId || (await requireAuth()).id;

  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('id', targetUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw AppError.internal(`Failed to fetch user: ${(error instanceof Error ? error.message : String(error))}`);
  }

  return data;
}

/**
 * Check if user is admin
 */
export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

/**
 * Check if user is staff
 */
export function isStaff(role: string): boolean {
  const staffRoles = [
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.DOCTOR,
    ROLES.THERAPIST,
    ROLES.STAFF,
    ROLES.SUPERVISOR,
  ];
  return staffRoles.includes(role);
}

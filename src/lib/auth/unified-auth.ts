/**
 * Unified Authentication System
 * نظام موحد للتحقق من الهوية والصلاحيات
 *
 * Simplified, centralized authentication and authorization
 * All auth logic flows through here
 */

import { getBrowserSupabase } from '@/lib/supabaseClient';
import { PermissionManager, ROLES } from '@/lib/permissions';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'auth_user',
  PERMISSIONS: 'auth_permissions',
  SESSION: 'auth_session',
};

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Get stored permissions from localStorage
 */
export function getStoredPermissions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save user to localStorage
 */
export function saveUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(user.permissions));
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: string, customPermissions: string[] = []): string[] {
  const rolePermissions = PermissionManager.getRolePermissions(role);
  const allPermissions = [...rolePermissions, ...customPermissions];

  // Admin always has all permissions
  if (role === 'admin') {
    return ['*', ...allPermissions];
  }

  return allPermissions;
}

/**
 * Check if user has permission
 */
export function hasPermission(userPermissions: string[], permission: string): boolean {
  return PermissionManager.hasPermission(userPermissions, permission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return PermissionManager.hasAnyPermission(userPermissions, requiredPermissions);
}

/**
 * Check if user can access a resource
 */
export function canAccess(userPermissions: string[], resource: string, action: string): boolean {
  return PermissionManager.canAccess(userPermissions, resource, action);
}

/**
 * Get default route for user role
 */
export function getDefaultRoute(role: string): string {
  // Import from RouteManager for consistency
  // Using inline map to avoid circular dependency
  const routeMap: Record<string, string> = {
    admin: '/admin/dashboard',
    manager: '/admin/dashboard',
    supervisor: '/dashboard/supervisor',
    agent: '/dashboard',
    doctor: '/dashboard/doctor',
    patient: '/dashboard/patient',
    staff: '/dashboard/staff',
    nurse: '/dashboard/staff',
    therapist: '/dashboard',
  };
  return routeMap[role] || '/dashboard';
}

/**
 * Fetch current user from API
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 401 is expected when user is not logged in - handle silently
    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      // Only log non-401 errors
      if (response.status !== 401) {
        console.warn('[UnifiedAuth] Error fetching user:', response.status, response.statusText);
      }
      return null;
    }

    const data = await response.json().catch(() => null);
    if (!data?.success) return null;

    const userData = data.data?.user || data.user;
    const permissions = data.data?.permissions || data.permissions || [];

    if (!userData) return null;

    // Get permissions from role if not provided
    const finalPermissions = permissions.length > 0
      ? permissions
      : getUserPermissions(userData.role || 'patient');

    const user: AuthUser = {
      id: userData.id,
      email: userData.email || userData.email_address || '',
      role: userData.role || 'patient',
      name: userData.name || userData.full_name || userData.email?.split('@')[0] || '',
      permissions: finalPermissions,
    };

    return user;
  } catch (error: any) {
    // Ignore abort errors (timeout) and network errors silently
    if (error?.name === 'AbortError') {
      return null;
    }
    // Only log unexpected errors
    if (error?.message && !error.message.includes('401')) {
      console.warn('[UnifiedAuth] Error fetching user:', error.message);
    }
    return null;
  }
}

/**
 * Check Supabase session
 */
export async function checkSupabaseSession(): Promise<boolean> {
  try {
    const supabase = getBrowserSupabase();
    const { data } = await supabase.auth.getSession();
    return !!data?.session?.user?.id;
  } catch {
    return false;
  }
}

/**
 * Initialize auth - get user from storage or API
 */
export async function initializeAuth(): Promise<AuthUser | null> {
  // 1. Try stored user first (fast path)
  const storedUser = getStoredUser();
  if (storedUser) {
    // Verify session exists (but don't wait too long)
    try {
      const hasSession = await Promise.race([
        checkSupabaseSession(),
        new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))
      ]);

      if (hasSession) {
        return storedUser;
      } else {
        // Session expired, clear storage
        clearAuth();
      }
    } catch {
      // If session check fails, still try to use stored user if available
      // The API will verify it
    }
  }

  // 2. Try to fetch from API (this will return null if 401, which is fine)
  const apiUser = await fetchCurrentUser();
  if (apiUser) {
    saveUser(apiUser);
    return apiUser;
  }

  // 3. No user found - this is normal when not logged in
  return null;
}

/**
 * Login with credentials
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    // Fetch user data after successful login
    const user = await fetchCurrentUser();
    if (user) {
      saveUser(user);
      return { success: true, user };
    }

    return { success: false, error: 'Failed to fetch user data' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('[UnifiedAuth] Logout error:', error);
  } finally {
    clearAuth();
  }
}

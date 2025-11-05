/**
 * Unified Auth Hook
 * Hook موحد للتحقق من الهوية والصلاحيات
 *
 * Single hook to rule them all - replaces all other auth hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/monitoring/logger';
import {
  AuthUser,
  initializeAuth,
  loginWithCredentials,
  logout as logoutUser,
  getStoredUser,
  _getStoredPermissions,
  _saveUser,
  _clearAuth,
  hasPermission,
  hasAnyPermission,
  canAccess,
  getDefaultRoute,
} from '@/lib/auth/unified-auth';

interface UseUnifiedAuthReturn {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];

  // Actions
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;

  // Permission checks
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;

  // Navigation
  navigateToDefault: () => void;
  getDefaultRoute: () => string;
}

export function useUnifiedAuth(): UseUnifiedAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Fast path: use stored user immediately
      const storedUser = getStoredUser();
      if (storedUser && mounted) {
        setUser(storedUser);
        setIsLoading(false);
      } else if (mounted) {
        // If no stored user, set loading to false immediately
        // Then verify with API in background
        setIsLoading(false);
      }

      // Then verify with API (this will update user if session exists)
      // Don't wait for this - user can proceed with stored data
      initializeAuth()
        .then(apiUser => {
          if (mounted && apiUser) {
            setUser(apiUser);
          } else if (mounted && !storedUser) {
            // No stored user and no API user = not logged in (this is fine)
            setUser(null);
          }
        })
        .catch(() => {
          // Silently ignore errors - user is simply not logged in
          if (mounted && !storedUser) {
            setUser(null);
          }
        });
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginWithCredentials(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      router.push('/login');
    } catch (error) {
      logger.error('[useUnifiedAuth] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Refresh user data
  const refresh = useCallback(async () => {
    const updatedUser = await initializeAuth();
    if (updatedUser) {
      setUser(updatedUser);
    }
  }, []);

  // Permission checks
  const checkPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return hasPermission(user.permissions, permission);
    },
    [user]
  );

  const checkAnyPermission = useCallback(
    (permissions: string[]) => {
      if (!user) return false;
      return hasAnyPermission(user.permissions, permissions);
    },
    [user]
  );

  const checkAccess = useCallback(
    (resource: string, action: string) => {
      if (!user) return false;
      return canAccess(user.permissions, resource, action);
    },
    [user]
  );

  // Navigation
  const navigateToDefault = useCallback(() => {
    if (!user) return;
    const route = getDefaultRoute(user.role);
    router.push(route);
  }, [user, router]);

  const getDefaultRouteForUser = useCallback(() => {
    if (!user) return '/login';
    return getDefaultRoute(user.role);
  }, [user]);

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,
    permissions: user?.permissions || [],

    // Actions
    login,
    logout,
    refresh,

    // Permission checks
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    canAccess: checkAccess,

    // Navigation
    navigateToDefault,
    getDefaultRoute: getDefaultRouteForUser,
  };
}

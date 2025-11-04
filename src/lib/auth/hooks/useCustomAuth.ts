/**
 * Custom Auth Hook - Clean & Optimized
 * Hook ???????? ?????? - ???? ??????
 *
 * ? Simple state management
 * ? Proper cleanup
 * ? No unnecessary re-renders
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CustomAuthUser } from '../types';

interface AuthState {
  user: CustomAuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useCustomAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setState({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        // Verify token via API (not direct server function)
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              // Get user from localStorage as fallback (faster)
              const userStr = localStorage.getItem('user');
              let userData = data.user;

              if (userStr) {
                try {
                  const parsed = JSON.parse(userStr);
                  userData = { ...data.user, ...parsed };
                } catch {
                  // Use API user
                }
              }

              setState({
                user: userData,
                isAuthenticated: true,
                loading: false,
              });
              return;
            }
          }
        } catch {
          // API call failed, continue to check localStorage
        }

        // Fallback: use localStorage if API fails
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setState({
              user,
              isAuthenticated: true,
              loading: false,
            });
            return;
          } catch {
            // Invalid JSON
          }
        }

        // Invalid token - clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setState({ user: null, isAuthenticated: false, loading: false });
      } catch (error) {
        // Silently fail - user not authenticated
        setState({ user: null, isAuthenticated: false, loading: false });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Save token and user
        if (data.data.token) {
          localStorage.setItem('auth_token', data.data.token);
        }
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        setState({
          user: data.data.user,
          isAuthenticated: true,
          loading: false,
        });

        return { success: true, user: data.data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('[useCustomAuth] Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      // Call logout API if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {}); // Ignore errors
    } catch {
      // Ignore errors
    } finally {
      // Clear all storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      sessionStorage.clear();
      setState({ user: null, isAuthenticated: false, loading: false });
    }
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}

/**
 * Custom Auth Hook - Clean & Optimized
 * Hook ???????? ?????? - ???? ??????
 * 
 * ? Simple state management
 * ? Proper cleanup
 * ? No unnecessary re-renders
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { customAuthHub, CustomAuthUser } from '../CustomAuthHub';

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

        // Verify token
        const user = await customAuthHub.verifyToken(token);
        if (user) {
          // Get user from localStorage as fallback (faster)
          const userStr = localStorage.getItem('user');
          let userData = user;
          
          if (userStr) {
            try {
              const parsed = JSON.parse(userStr);
              userData = { ...user, ...parsed };
            } catch {
              // Use verified user
            }
          }

          setState({
            user: userData,
            isAuthenticated: true,
            loading: false,
          });
        } else {
          // Invalid token - clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setState({ user: null, isAuthenticated: false, loading: false });
        }
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
        body: JSON.stringify({ email, password }),
      });

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
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await customAuthHub.logout();
    } catch {
      // Ignore errors
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, loading: false });
    }
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}

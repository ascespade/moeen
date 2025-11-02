'use client';

import { useState, useEffect, useCallback } from 'react';
import { CustomAuthUser } from '../CustomAuthHub';

interface UseCustomAuthReturn {
  user: CustomAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export function useCustomAuth(): UseCustomAuthReturn {
  const [user, setUser] = useState<CustomAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with API
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('auth_token');
          }
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth init error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Save token to localStorage
        if (data.data.token) {
          localStorage.setItem('auth_token', data.data.token);
          // Also save user data to localStorage for compatibility
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        // Save user to state
        setUser({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          role: data.data.user.role,
          status: data.data.user.status,
          avatar_url: data.data.user.avatar,
        });

        return { success: true };
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

  const logout = useCallback(async () => {
    // Clear token
    localStorage.removeItem('auth_token');
    setUser(null);

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

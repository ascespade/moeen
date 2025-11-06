'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authHub } from '../AuthHub';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authHub.getSession().then(session => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const unsubscribe = authHub.subscribeToAuthChanges((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle specific events
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authHub.login(email, password);
      if (result.error) {
        throw result.error;
      }
      setUser(result.user);
      setSession(result.session);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authHub.logout();
      // logout() already handles redirect, but clear state anyway
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

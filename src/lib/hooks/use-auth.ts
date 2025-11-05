/**
 * useAuth Hook - Custom Hook for Authentication
 * خطاف useAuth - خطاف مخصص للمصادقة
 *
 * React hook for authentication state and actions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../supabase/client';
import type { _User } from '@supabase/supabase-js';
import type { User as DbUser } from '@/types/database.types';
import { logger } from '@/lib/monitoring/logger';

export function useAuth() {
  const [user, setUser] = useState<DbUser | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUserData },
          error,
        } = await supabase.auth.getUser();

        if (error || !authUserData) {
          setAuthUser(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setAuthUser(authUserData);

        // Fetch user from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUserData.id)
          .single();

        if (userError || !userData) {
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (err) {
        logger.error('Auth error:', err);
        setUser(null);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAuth();

    // Subscribe to auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchAuth();
      } else {
        setUser(null);
        setAuthUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setAuthUser(null);
    router.push('/login');
  };

  return {
    user,
    authUser,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}

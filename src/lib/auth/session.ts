/**
 * Session Management - إدارة الجلسات
 * 
 * Session-related utilities
 */

import { createClient } from '../supabase/server';
import type { User } from '@/types/database.types';

/**
 * Get current session
 */
export async function getSession(): Promise<{
  user: User | null;
  session: { access_token: string; refresh_token: string } | null;
}> {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return { user: null, session: null };
  }

  // Fetch user from users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return { user: null, session: null };
  }

  return {
    user,
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    },
  };
}

/**
 * Refresh session
 */
export async function refreshSession(): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession();

  return !error;
}

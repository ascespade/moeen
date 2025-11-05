/**
 * Supabase Admin Client
 * عميل Supabase للمدير
 * 
 * Server-side admin client with service role key
 * Use only in server-side code, never expose to client
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Create Supabase admin client with service role key
 * Bypasses Row Level Security (RLS)
 * 
 * WARNING: Only use in server-side code (API routes, server actions)
 * Never expose this to the client
 * 
 * @returns Supabase admin client instance
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

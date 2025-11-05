/**
 * Supabase Client - Browser Client
 * عميل Supabase - المتصفح
 * 
 * Client-side Supabase client for browser usage
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../types/database.types';

/**
 * Create Supabase client for browser
 * 
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

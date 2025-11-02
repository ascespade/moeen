import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Singleton client instance to prevent multiple GoTrueClient instances
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  // Return singleton instance if already created
  if (clientInstance) {
    return clientInstance;
  }

  // Create new instance only if it doesn't exist
  clientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  return clientInstance;
};

export const createServerClient = () => {
  // Server-side clients can be created fresh each time as they're in different contexts
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Supabase client for browser-side operations
 */

import { _createBrowserClient } from "@supabase/ssr";

import { _Database } from "@/types/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://socwpqzcalgvpzjwavgh.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDU1OTAsImV4cCI6MjA3NDg4MTU5MH0.V1XbwXlL_ZfdvwtPe7az15t73Lyy3ezUBTi_5XP0VcQ";

export const __supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

export default supabase;

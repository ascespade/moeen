import { _createBrowserClient, createServerClient } from "@supabase/ssr";
import { _cookies, headers } from "next/headers";

import { _Database } from "@/types/supabase";

// Supabase configuration
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://socwpqzcalgvpzjwavgh.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDU1OTAsImV4cCI6MjA3NDg4MTU5MH0.V1XbwXlL_ZfdvwtPe7az15t73Lyy3ezUBTi_5XP0VcQ";

// Browser client for client-side operations
export function __getBrowserSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Server client for server-side operations
export async function __getServerSupabase() {
  const __cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

// Service client for admin operations
export function __getServiceSupabase() {
  const { createClient } = require("@supabase/supabase-js");
  const __serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for service operations",
    );
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Default export for backward compatibility
export const __supabase = getBrowserSupabase();
export const __supabaseAdmin = getServiceSupabase();

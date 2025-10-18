import { cookies, headers } from "next/headers";

import { createBrowserClient, createServerClient } from "@supabase/ssr";

export function getBrowserSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
  return createBrowserClient(url, anon);
}

export async function getServerSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
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

export function getServiceSupabase() {
  const { createClient } = require("@supabase/supabase-js");
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createClient(url, service);
}

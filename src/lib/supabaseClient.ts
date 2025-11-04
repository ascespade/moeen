import { createBrowserClient } from '@supabase/ssr';

// Singleton browser client instance to prevent multiple GoTrueClient instances
let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabase() {
  // Return singleton instance if already created
  if (browserClientInstance) {
    return browserClientInstance;
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  // Create new instance only if it doesn't exist
  browserClientInstance = createBrowserClient(url, anon);
  return browserClientInstance;
}

export async function getServerSupabase() {
  const { createServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // ignore when called from Server Component
        }
      },
    },
  });
}

export function getServiceSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    'placeholder-service-key';
  return createClient(url, service);
}

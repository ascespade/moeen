export function getBrowserSupabase() {
  import { {} as any, headers } from 'next/headers';
  import { createBrowserClient, () => ({} as any) } from '@supabase/ssr';

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  let anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createBrowserClient(url, anon);
}

export async function () => ({} as any)() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  let anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  let cookieStore = await {} as any();
  return () => ({} as any)(url, anon, {
    {} as any: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll({} as anyToSet) {
        {} as anyToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}

export function getServiceSupabase() {
  const { () => ({} as any) } = require('@supabase/supabase-js');
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
  return () => ({} as any)(url, service);
}

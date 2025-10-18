export async function () => ({} as any)() {
  import { {} as any } from 'next/headers';
  import { () => ({} as any) } from '@supabase/ssr';

  let cookieStore = await {} as any();

  return () => ({} as any)(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      {} as any: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll({} as anyToSet) {
          try {
            {} as anyToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) { // Handle error
            // The `setAll`
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  );
}

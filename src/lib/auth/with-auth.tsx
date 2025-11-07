/**
 * With Auth HOC - Higher Order Component for Authentication
 * مكون HOC للمصادقة
 *
 * Wrapper component that requires authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../supabase/client';
import { ROUTES } from '../constants';

interface WithAuthOptions {
  requiredRole?: string;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { requiredRole, redirectTo = ROUTES.AUTH.LOGIN } = options;

    useEffect(() => {
      async function checkAuth() {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push(redirectTo);
          return;
        }

        // Check role if required
        if (requiredRole) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!userData || userData.role !== requiredRole) {
            router.push(redirectTo);
            return;
          }
        }
      }

      checkAuth();
    }, [router, requiredRole, redirectTo]);

    return <Component {...props} />;
  };
}

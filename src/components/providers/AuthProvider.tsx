/**
 * Auth Provider Component
 * Provides authentication context to the entire app
 */

'use client';

import { useAuth } from '@/lib/auth/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (!user && !isPublicRoute) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user && isPublicRoute) {
      // ? Always redirect to admin dashboard
      router.push('/admin/dashboard');
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
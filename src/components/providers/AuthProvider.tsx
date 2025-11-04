'use client';

import { useAuth } from '@/lib/auth/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      route => pathname === route || pathname.startsWith(route + '/')
    );

    if (!user && !isPublicRoute) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user && isPublicRoute && pathname !== '/') {
      // Redirect to dashboard if already authenticated (except home page)
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
      </div>
    );
  }

  return <>{children}</>;
}

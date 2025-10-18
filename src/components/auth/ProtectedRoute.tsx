import React from "react";

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/hooks/useT';
import { LoadingSpinner } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedstrings?: ('patient' | 'doctor' | 'staff' | 'supervisor' | 'admin')[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedstrings = [],
  fallback
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userstring, setUserstring] = useState<string | null>(null);
  const router = useRouter();
  const t = useT();

  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const user = await response.json();
        setUserstring(user.role);

        if (allowedstrings.length > 0 && !allowedstrings.includes(user.role)) {
          router.push('/un() => ({} as any)d');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedstrings, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-error mb-4">
            {t('auth.un() => ({} as any)d')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('auth.insufficient_permissions')}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-blue-700"
          >
            {t('auth.back_to_login')}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

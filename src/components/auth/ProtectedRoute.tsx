'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/components/providers/I18nProvider';
import { LoadingSpinner } from '@/components/ui';
import { useAuth, usePermission } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (
    | 'patient'
    | 'doctor'
    | 'staff'
    | 'supervisor'
    | 'admin'
    | 'manager'
    | 'agent'
    | 'nurse'
    | 'therapist'
  )[];
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions,
  fallback,
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { t } = useT();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasAnyPermission } = usePermission(requiredPermissions || '');

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as any)) {
        setIsAuthorized(false);
        return;
      }

      // Check permission-based access
      if (requiredPermissions) {
        const permsArray = Array.isArray(requiredPermissions)
          ? requiredPermissions
          : [requiredPermissions];

        if (!hasAnyPermission(permsArray)) {
          setIsAuthorized(false);
          return;
        }
      }

      setIsAuthorized(true);
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    requiredPermissions,
    hasAnyPermission,
    router,
  ]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner size='lg' />
        <span className='ml-2'>{t('common.loading')}</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-default-error mb-4'>
              {t('auth.unauthorized')}
            </h1>
            <p className='text-gray-600 mb-4'>
              {t('auth.insufficient_permissions')}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className='px-4 py-2 bg-default-default text-white rounded hover:bg-blue-700'
            >
              {t('auth.back_to_dashboard')}
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

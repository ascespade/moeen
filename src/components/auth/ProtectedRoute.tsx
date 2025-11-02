'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/components/providers/I18nProvider';
import { I18N_KEYS } from '@/constants/i18n-keys';
import { LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

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
  const [hasChecked, setHasChecked] = useState(false);
  const router = useRouter();
  const { t } = useT();
  const { isAuthenticated, isLoading, user, permissions } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = () => {
      // First, check localStorage immediately - fastest path
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const storedPerms = typeof window !== 'undefined' ? localStorage.getItem('permissions') : null;

      // Use stored user if auth is still loading or no user from auth
      const effectiveUser = user || (storedUser ? JSON.parse(storedUser) : null);
      const effectivePerms = permissions || (storedPerms ? JSON.parse(storedPerms) : []);

      // Check if user exists
      if (!effectiveUser) {
        if (!storedUser && !isLoading) {
          // No user and not loading - redirect to login
          if (isMounted) {
            setHasChecked(true);
            setIsAuthorized(false);
            router.push('/login');
          }
          return;
        }
        // Still loading - wait
        if (isMounted) {
          setHasChecked(false);
          setIsAuthorized(false);
        }
        return;
      }

      // We have a user - check authorization
      if (isMounted) {
        setHasChecked(true);

        // Check role-based access
        if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveUser.role as any)) {
          setIsAuthorized(false);
          return;
        }

        // Check permission-based access
        if (requiredPermissions) {
          const permsArray = Array.isArray(requiredPermissions)
            ? requiredPermissions
            : [requiredPermissions];

          // Supervisor, admin, manager bypass permission checks
          if (effectiveUser.role === 'admin' || effectiveUser.role === 'manager' || effectiveUser.role === 'supervisor') {
            setIsAuthorized(true);
            return;
          }

          const hasAny = permsArray.some(
            perm => effectivePerms.includes(perm) || effectivePerms.includes('*')
          );

          if (!hasAny) {
            setIsAuthorized(false);
            return;
          }
        }

        // All checks passed
        setIsAuthorized(true);
      }
    };

    // Always check auth when dependencies change
    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    isLoading,
    user,
    permissions,
    allowedRoles,
    requiredPermissions,
    router,
  ]);

  // Show loading only if we're still loading AND haven't checked yet
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  // If checked and authorized, show children
  if (hasChecked && isAuthorized) {
    return <>{children}</>;
  }

  // If checked and not authorized, show unauthorized
  if (hasChecked && !isAuthorized) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-default-error mb-4'>
              {t(I18N_KEYS.AUTH.UNAUTHORIZED)}
            </h1>
            <p className='text-gray-600 mb-4'>
              {t(I18N_KEYS.AUTH.INSUFFICIENT_PERMISSIONS)}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className='px-4 py-2 bg-default-default text-white rounded hover:bg-blue-700'
            >
              {t(I18N_KEYS.AUTH.BACK_TO_DASHBOARD)}
            </button>
          </div>
        </div>
      )
    );
  }

  // If we have stored user but haven't checked yet, allow optimistic access for high-privilege roles
  if (storedUser && !hasChecked && !isLoading) {
    try {
      const userData = JSON.parse(storedUser);
      if (userData && userData.role) {
        const roleAllowed = allowedRoles.length === 0 || allowedRoles.includes(userData.role as any);
        // Allow immediate access for admin/manager/supervisor or if no permissions required
        if (roleAllowed && (userData.role === 'admin' || userData.role === 'manager' || userData.role === 'supervisor' || !requiredPermissions)) {
          return <>{children}</>;
        }
      }
    } catch {}
  }

  // Show loading while checking
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <LoadingSpinner size='lg' />
      <span className='ml-2'>{t(I18N_KEYS.COMMON.LOADING)}</span>
    </div>
  );
}

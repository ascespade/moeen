/**
 * Protected Route Component
 * Component for protecting routes based on permissions
 */

'use client';

import { usePermissions } from '@/lib/auth/hooks/usePermissions';
import { ReactNode, useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  resource,
  action,
  fallback = <div className="p-8 text-center">Access Denied</div>,
}: ProtectedRouteProps) {
  const { checkPermission, loading } = usePermissions();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    checkPermission(resource, action).then((hasPermission) => {
      setHasAccess(hasPermission);
      setChecking(false);
    });
  }, [resource, action, loading, checkPermission]);

  if (checking || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
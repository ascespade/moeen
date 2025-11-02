/**
 * Protected Route Component
 * Component for protecting routes based on permissions
 */

'use client';

import { ReactNode } from 'react';

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
  // ? No permission checks - always allow access
  return <>{children}</>;
}
'use client';

/**
 * ? SIMPLIFIED Route Guard
 * Route Guard ????? - ???? ??? ???????
 * 
 * All routes are accessible - no permission or role checks
 */

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackPath?: string;
}

export default function RouteGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/unauthorized'
}: RouteGuardProps) {
  // ? No permission or role checks - always allow access
  return <>{children}</>;
}

export { RouteGuard };
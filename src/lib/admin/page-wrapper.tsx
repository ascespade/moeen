/**
 * Unified Admin Page Wrapper
 * wrapper موحد لجميع صفحات Admin
 * يستخدم النظام الموحد UnifiedPageGuard
 */

'use client';

import { UnifiedPageGuard } from '@/lib/auth/unified-page-guard';
import { getPageConfig } from './page-config';
import { usePathname } from 'next/navigation';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  pageTitle?: string;
}

export function AdminPageWrapper({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  _pageTitle,
}: AdminPageWrapperProps) {
  const pathname = usePathname();

  // Get page config if not provided
  const pageConfig = getPageConfig(pathname);
  const finalRequiredPermissions = requiredPermissions.length > 0
    ? requiredPermissions
    : (pageConfig?.requiredPermissions || []);
  const finalRequiredRoles = requiredRoles.length > 0
    ? requiredRoles
    : (pageConfig?.requiredRoles || []);

  return (
    <UnifiedPageGuard
      requiredPermissions={finalRequiredPermissions}
      requiredRoles={finalRequiredRoles}
      showError={true}
      redirectOnUnauthorized={false}
    >
      {children}
    </UnifiedPageGuard>
  );
}

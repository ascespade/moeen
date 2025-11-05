/**
 * Unified Page Handler for Admin Pages
 * معالج موحد لجميع صفحات Admin
 * يضمن عدم عمل refresh للصفحة كاملة
 */

'use client';

import { ReactNode } from 'react';
import { AdminPageWrapper } from './page-wrapper';
import { getPageConfig, ADMIN_PAGES } from './page-config';
import { usePathname } from 'next/navigation';

interface UnifiedPageHandlerProps {
  children: ReactNode;
  pageKey?: string;
  customPermissions?: string[];
  customRoles?: string[];
}

export function UnifiedPageHandler({
  children,
  pageKey,
  customPermissions,
  customRoles,
}: UnifiedPageHandlerProps) {
  const pathname = usePathname();

  // Get page config automatically from pathname if pageKey not provided
  const pageConfig = pageKey
    ? Object.values(ADMIN_PAGES).find((p) => p.path === pageKey)
    : getPageConfig(pathname);

  const requiredPermissions = customPermissions || pageConfig?.requiredPermissions || [];
  const requiredRoles = customRoles || pageConfig?.requiredRoles || [];

  return (
    <AdminPageWrapper
      requiredPermissions={requiredPermissions}
      requiredRoles={requiredRoles}
      pageTitle={pageConfig?.title}
    >
      {children}
    </AdminPageWrapper>
  );
}


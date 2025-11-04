/**
 * Unified Navigation System for Admin Pages
 * نظام تنقل موحد لجميع صفحات Admin
 * يضمن عدم عمل refresh للصفحة كاملة
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { getPageConfig, ADMIN_PAGES } from './page-config';

export function useAdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPage = useCallback((pageKey: string) => {
    const pageConfig = ADMIN_PAGES[pageKey];
    if (pageConfig && pageConfig.path !== pathname) {
      // Use Next.js router for client-side navigation (no refresh)
      router.push(pageConfig.path);
    }
  }, [router, pathname]);

  const getCurrentPage = useCallback(() => {
    return getPageConfig(pathname);
  }, [pathname]);

  return {
    navigateToPage,
    getCurrentPage,
    currentPath: pathname,
  };
}


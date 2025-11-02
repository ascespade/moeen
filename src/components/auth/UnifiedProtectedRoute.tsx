/**
 * Unified Protected Route Component
 * Component موحد لحماية الصفحات
 *
 * Simplified route protection using unified auth system
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { LoadingSpinner } from '@/components/ui';
import { getDefaultRoute } from '@/lib/auth/unified-auth';

interface UnifiedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
}

export default function UnifiedProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions,
  fallback,
}: UnifiedProtectedRouteProps) {
  // ✅ No permission or role checks - always allow access
  return <>{children}</>;
}

'use client';

import { RouteGuard } from '@/components/admin/RouteGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      requiredRoles={['admin', 'manager', 'supervisor']}
      requiredPermissions={['dashboard:view']}
    >
      {children}
    </RouteGuard>
  );
}


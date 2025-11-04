'use client';

import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import AdminSidebar from './AdminSidebar';
import EnhancedSidebar from './EnhancedSidebar';

export default function Sidebar() {
  const { user } = useCustomAuth();

  // Use AdminSidebar if user is admin/manager, otherwise use EnhancedSidebar
  if (user && (user.role === 'admin' || user.role === 'manager')) {
    return <AdminSidebar />;
  }

  // Use enhanced sidebar for other roles
  return <EnhancedSidebar />;
}

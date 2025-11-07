/**
 * Admin Layout - Enhanced
 * Layout محسّن للصفحات الإدارية
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/shell/Sidebar';
import Header from '@/components/shell/Header';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useCustomAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check if user has admin/manager role
    if (!loading && user && user.role !== 'admin' && user.role !== 'manager') {
      // Redirect non-admin users away from admin routes
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router, pathname]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--background)]'>
        <div className='text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--brand-primary)] mx-auto'></div>
          <p className='text-[var(--text-secondary)]'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  // Show access denied if not admin/manager
  if (user.role !== 'admin' && user.role !== 'manager') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--background)]'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>غير مصرح</h1>
          <p className='text-[var(--text-secondary)] mb-4'>
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className='px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg'
          >
            العودة إلى لوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='grid min-h-dvh bg-[var(--background)] text-[var(--text-primary)] lg:grid-cols-[16rem_1fr]'>
      <Sidebar />
      <div className='grid grid-rows-[auto_1fr]'>
        <Header />
        <main className='p-4 md:p-6 lg:p-8 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}

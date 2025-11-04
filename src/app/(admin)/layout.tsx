/**
 * Admin Layout - Unified System
 * Layout موحد لجميع صفحات Admin
 * السايد بار والهيدر ثابتين دائماً، فقط المحتوى يتغير
 */

'use client';

import { Suspense } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import Header from '@/components/shell/Header';
import UnifiedProtectedRoute from '@/components/auth/UnifiedProtectedRoute';
import AdminLoading from './loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
      <div className='flex min-h-dvh bg-background text-foreground overflow-hidden' role="application">
        {/* Sidebar - Always visible, sticky */}
        <nav className='sticky top-0 h-screen overflow-hidden flex-shrink-0' role="navigation" aria-label="القائمة الجانبية">
          <Sidebar />
        </nav>

        {/* Main Content Area - Only this part loads */}
        <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
          {/* Header - Always visible, sticky */}
          <header className='sticky top-0 z-10 bg-background flex-shrink-0' role="banner" aria-label="رأس الصفحة">
            <Header />
          </header>

          {/* Page Content - Only this part shows loading */}
          <main className='flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden' role="main" aria-label="المحتوى الرئيسي">
            <Suspense fallback={<AdminLoading />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </UnifiedProtectedRoute>
  );
}

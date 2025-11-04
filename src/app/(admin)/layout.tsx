'use client';

import Sidebar from '@/components/shell/Sidebar';
import Header from '@/components/shell/Header';
import UnifiedProtectedRoute from '@/components/auth/UnifiedProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedProtectedRoute allowedRoles={['admin', 'manager', 'supervisor']}>
      <div className='grid min-h-dvh bg-background text-foreground lg:grid-cols-[16rem_1fr]' role="application">
        <nav role="navigation" aria-label="القائمة الجانبية">
          <Sidebar />
        </nav>
        <div className='grid grid-rows-[auto_1fr]'>
          <header role="banner" aria-label="رأس الصفحة">
            <Header />
          </header>
          <main className='p-4 md:p-6 lg:p-8' role="main" aria-label="المحتوى الرئيسي">{children}</main>
        </div>
      </div>
    </UnifiedProtectedRoute>
  );
}

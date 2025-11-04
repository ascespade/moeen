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
      <div className='flex min-h-dvh bg-background text-foreground' role="application">
        <nav className='sticky top-0 h-screen overflow-y-auto' role="navigation" aria-label="القائمة الجانبية">
          <Sidebar />
        </nav>
        <div className='flex-1 flex flex-col min-w-0'>
          <header className='sticky top-0 z-10 bg-background' role="banner" aria-label="رأس الصفحة">
            <Header />
          </header>
          <main className='flex-1 p-4 md:p-6 lg:p-8 overflow-auto' role="main" aria-label="المحتوى الرئيسي">{children}</main>
        </div>
      </div>
    </UnifiedProtectedRoute>
  );
}

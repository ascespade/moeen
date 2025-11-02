'use client';

import { Suspense } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import Header from '@/components/shell/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Removed database query on every navigation
  // ✅ Removed loading state that causes delays
  // ✅ Use Suspense for loading states instead
  
  return (
    <div className='grid min-h-dvh bg-[var(--background)] text-[var(--text-primary)] lg:grid-cols-[16rem_1fr]'>
      <Sidebar />
      <div className='grid grid-rows-[auto_1fr]'>
        <Header />
        <main className='p-4 md:p-6 lg:p-8 overflow-auto'>
          <Suspense
            fallback={
              <div className='flex items-center justify-center min-h-[400px]'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-border)] border-t-[var(--brand-primary)]' />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}





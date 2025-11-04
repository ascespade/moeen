'use client';

import Header from '@/components/shell/Header';
import Sidebar from '@/components/shell/Sidebar';

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='grid min-h-dvh bg-background text-foreground lg:grid-cols-[16rem_1fr]' role="application">
      <nav role="navigation" aria-label="??????? ????????">
        <Sidebar />
      </nav>
      <div className='grid grid-rows-[auto_1fr]'>
        <header role="banner" aria-label="??? ??????">
          <Header />
        </header>
        <main className='p-4 md:p-6 lg:p-8' role="main" aria-label="??????? ???????">{children}</main>
      </div>
    </div>
  );
}

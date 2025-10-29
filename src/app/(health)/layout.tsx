'use client';

import Header from '@/components/shell/Header';
import Sidebar from '@/components/shell/Sidebar';

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='grid min-h-dvh bg-background text-foreground lg:grid-cols-[16rem_1fr]'>
      <Sidebar />
      <div className='grid grid-rows-[auto_1fr]'>
        <Header />
        <main className='p-4 md:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}

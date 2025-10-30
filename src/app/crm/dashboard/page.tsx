'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function CrmDashboardPage() {
  const router = useRouter();

  // Minimal placeholder dashboard for CRM role testing
  useEffect(() => {
    // no-op
  }, []);

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <div className='container-app py-10'>
        <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>لوحة تحكم CRM</h1>
        <p className='text-[var(--text-secondary)] mb-6'>هذه الصفحة مخصصة لدور Agent لاختبار الدخول السريع.</p>
        <div className='flex gap-3'>
          <Button onClick={() => router.replace('/admin/dashboard')} className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'>عودة للوحة الإدارة</Button>
        </div>
      </div>
    </div>
  );
}



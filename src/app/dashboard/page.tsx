'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultRoute } from '@/lib/auth/RouteManager';
import { logger } from '@/lib/utils/logger';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    let role = 'agent'; // default

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        role = user.role || 'agent';
      } catch (e) {
        logger.error('Error parsing user:', e, {})
      }
    }

    // Get default route for role
    const targetRoute = getDefaultRoute(role);

    // Redirect if not already on target route
    if (
      window.location.pathname !== targetRoute &&
      targetRoute !== '/dashboard'
    ) {
      router.replace(targetRoute);
    } else if (targetRoute === '/dashboard') {
      // If agent role, show <maindashboard instead of redirecting
      // This allows them to see the dashboard
    }
  }, [router]);

  // Show main dashboard for agent role or as fallback
  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
          لوحة التحكم الرئيسية
        </h1>
        <p className='text-[var(--text-secondary)]'>مرحباً بك في لوحة التحكم</p>
      </div>

      {/* Dashboard Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Stats Cards */}
        <div className='bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
            إحصائيات سريعة
          </h3>
          <p className='text-[var(--text-secondary)]'>
            عرض الإحصائيات والبيانات الرئيسية
          </p>
        </div>

        <div className='bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
            النشاطات الأخيرة
          </h3>
          <p className='text-[var(--text-secondary)]'>آخر الأنشطة والتحديثات</p>
        </div>

        <div className='bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
            إشعارات
          </h3>
          <p className='text-[var(--text-secondary)]'>
            الإشعارات والتنبيهات المهمة
          </p>
        </div>
      </div>
    </div>
  );
}

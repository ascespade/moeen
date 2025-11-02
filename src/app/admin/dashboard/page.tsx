/**
 * Admin Dashboard - Enhanced
 * لوحة تحكم المدير المحسّنة
 */

'use client';

import { useEffect, useState } from 'react';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useCustomAuth();
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Fetch stats (placeholder - implement with real API)
    // This would call your actual API endpoints
  }, []);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
          <p className="text-[var(--text-secondary)]">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          لوحة تحكم المدير
        </h1>
        <p className="text-[var(--text-secondary)]">
          مرحباً {user.name || user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="المستخدمون"
          value={stats.users}
          icon="👥"
          link="/admin/users"
        />
        <StatCard
          title="المرضى"
          value={stats.patients}
          icon="🏥"
          link="/admin/patients"
        />
        <StatCard
          title="المواعيد"
          value={stats.appointments}
          icon="📅"
          link="/admin/appointments"
        />
        <StatCard
          title="الإيرادات"
          value={`${stats.revenue.toLocaleString()} ر.س`}
          icon="💰"
          link="/admin/payments"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              إضافة مستخدم
            </div>
          </Link>
          <Link
            href="/admin/patients"
            className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              إضافة مريض
            </div>
          </Link>
          <Link
            href="/admin/appointments"
            className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              موعد جديد
            </div>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--brand-primary)] transition-colors text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              الإعدادات
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, link }: {
  title: string;
  value: string | number;
  icon: string;
  link?: string;
}) {
  const content = (
    <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--text-secondary)]">{title}</div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

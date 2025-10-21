'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'claim' | 'patient' | 'staff' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface DashboardData {
  statistics: DashboardStats;
  recentActivities: RecentActivity[];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/statistics');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-background text-foreground flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4'></div>
          <p className='text-gray-600'>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background text-foreground flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <p className='text-red-600 mb-4'>خطأ في تحميل البيانات: {error}</p>
          <Button onClick={fetchDashboardData} className='btn-brand'>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className='min-h-screen bg-background text-foreground flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData.statistics;

  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-[var(--color-primary-500)]">
        <div className="container-app py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--color-primary-500)]">لوحة التحكم</h1>
          <div className="text-sm text-[var(--color-text-secondary)]">اليوم: {new Date().toLocaleDateString("ar-SA")}</div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--color-primary-500)] rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">📊</span>
                </div>
                <h3 className="card-title">التنقل</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li><a className="nav-link" href="#stats">
                <span className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full"></span>
                الإحصائيات
              </a></li>
              <li><a className="nav-link" href="#charts">
                <span className="w-2 h-2 bg-[var(--color-secondary-500)] rounded-full"></span>
                الرسوم البيانية
              </a></li>
              <li><a className="nav-link" href="#activity">
                <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full"></span>
                آخر الأنشطة
              </a></li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <section className="lg:col-span-9 space-y-6">
          {/* KPIs */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">المستخدمون</h3>
              </div>
              <div className="card-body">
                <div className="text-3xl font-bold text-[var(--color-primary-500)]">1,248</div>
                <div className="text-sm text-[var(--color-text-secondary)]">+4% هذا الأسبوع</div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">الخدمات</h3>
              </div>
              <div className="card-body">
                <div className="text-3xl font-bold text-[var(--color-secondary-500)]">12</div>
                <div className="text-sm text-[var(--color-text-secondary)]">-1% هذا الأسبوع</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">المشاريع</h3>
              </div>
              <div className="card-body">
                <div className="text-3xl font-bold text-[var(--color-accent-500)]">3,420</div>
                <div className="text-sm text-[var(--color-text-secondary)]">+12%</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">الرسائل</h3>
              </div>
              <div className="card-body">
                <div className="text-3xl font-bold text-[var(--color-success-500)]">18,305</div>
                <div className="text-sm text-[var(--color-text-secondary)]">+7%</div>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div id="activity" className="card">
            <div className="card-header">
              <h3 className="card-title">آخر الأنشطة</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full"></span>
                تم إنشاء مشروع جديد: التطوير الفني
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-secondary-500)] rounded-full"></span>
                تم تسجيل مستخدم: Ahmed@example.com
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full"></span>
                تم إرسال 230 رسالة خلال الساعة الماضية
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

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
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='container-app py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                لوحة التحكم
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                مرحباً بك في مركز الهمم
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-8 rounded-lg bg-brand text-white grid place-items-center'>
                م
              </div>
              <span className='text-lg font-bold text-gray-900 dark:text-white'>
                مركز الهمم
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container-app py-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Patients Stats */}
          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  إجمالي المرضى
                </p>
                <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalPatients.toLocaleString()}
                </p>
                <p className='text-sm text-green-600'>
                  +{stats.activePatients} نشط
                </p>
              </div>
              <div className='h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                <span className='text-2xl'>👥</span>
              </div>
            </div>
          </Card>

          {/* Appointments Stats */}
          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  إجمالي المواعيد
                </p>
                <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalAppointments.toLocaleString()}
                </p>
                <p className='text-sm text-blue-600'>
                  {stats.completedAppointments} مكتمل
                </p>
              </div>
              <div className='h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                <span className='text-2xl'>📅</span>
              </div>
            </div>
          </Card>

          {/* Revenue Stats */}
          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  إجمالي الإيرادات
                </p>
                <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalRevenue.toLocaleString()} ر.س
                </p>
                <p className='text-sm text-green-600'>
                  {stats.monthlyRevenue.toLocaleString()} ر.س هذا الشهر
                </p>
              </div>
              <div className='h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center'>
                <span className='text-2xl'>💰</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className='p-6'>
            <div className='text-center'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-4'>
                إجراءات سريعة
              </p>
              <div className='space-y-2'>
                <Button className='btn-brand w-full'>حجز موعد جديد</Button>
                <Button className='btn-outline w-full'>إضافة مريض</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              النشاط الأخير
            </h2>
            <Button
              variant='outline'
              size='sm'
              onClick={fetchDashboardData}
              className='text-xs'
            >
              تحديث
            </Button>
          </div>
          <div className='space-y-4'>
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700'
                >
                  <div className='h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center'>
                    {activity.type === 'appointment' && '📅'}
                    {activity.type === 'claim' && '📋'}
                    {activity.type === 'patient' && '👤'}
                    {activity.type === 'staff' && '👨‍⚕️'}
                    {activity.type === 'payment' && '💰'}
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900 dark:text-white'>
                      {activity.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {activity.description}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {activity.timestamp}
                    </p>
                  </div>
                  <Badge
                    className={
                      activity.status === 'success'
                        ? 'badge-success'
                        : activity.status === 'warning'
                          ? 'badge-warning'
                          : activity.status === 'error'
                            ? 'badge-error'
                            : 'badge-info'
                    }
                  >
                    {activity.status === 'success' && 'نجح'}
                    {activity.status === 'warning' && 'تحذير'}
                    {activity.status === 'error' && 'خطأ'}
                    {activity.status === 'info' && 'معلومات'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p>لا توجد نشاطات حديثة</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

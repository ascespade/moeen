'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import DynamicCharts from '@/components/dashboard/DynamicCharts';
import Image from 'next/image';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  blockedPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  totalStaff: number;
  activeStaff: number;
  onDutyStaff: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'claim' | 'patient' | 'staff' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface StaffWorkHours {
  id: string;
  name: string;
  position: string;
  totalHours: number;
  todayHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  isOnDuty: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
}

interface DynamicDashboardData {
  statistics: DashboardStats;
  recentActivities: RecentActivity[];
  staffWorkHours: StaffWorkHours[];
  charts: {
    appointmentTrends: Array<{ month: string; count: number }>;
    doctorSpecialties: Array<{ specialty: string; count: number }>;
    therapySessions: Array<{ therapy_type: string; count: number }>;
    revenueTrends: Array<{ month: string; total_revenue: number }>;
    patientAnalytics: {
      by_age: Array<{ age_group: string; count: number }>;
      by_condition: Array<{ condition_name: string; count: number }>;
      by_gender: Array<{ gender: string; count: number }>;
    };
  };
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('month');
  const [dashboardData, setDashboardData] =
    useState<DynamicDashboardData | null>(null);
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

  const activityTypeConfig = {
    appointment: { icon: '📅', color: 'blue', bg: 'bg-blue-50' },
    claim: { icon: '📋', color: 'green', bg: 'bg-green-50' },
    patient: { icon: '👤', color: 'red', bg: 'bg-red-50' },
    staff: { icon: '👨‍⚕️', color: 'purple', bg: 'bg-purple-50' },
    payment: { icon: '💰', color: 'green', bg: 'bg-green-50' },
  } as const;

  const statusConfig = {
    success: { color: 'text-green-600', bg: 'bg-green-50' },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
    error: { color: 'text-red-600', bg: 'bg-red-50' },
    info: { color: 'text-blue-600', bg: 'bg-blue-50' },
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const config = activityTypeConfig[type];
    return (
      <div
        className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center text-sm`}
      >
        {config.icon}
      </div>
    );
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    const config = statusConfig[status];
    return `${config.color} ${config.bg}`;
  };

  const getOnDutyStatus = (staff: StaffWorkHours) => {
    if (staff.isOnDuty) {
      return (
        <div className='flex items-center gap-2 text-green-600'>
          <span className='h-2 w-2 animate-pulse rounded-full bg-green-500'></span>
          <span className='text-sm font-medium'>في الخدمة</span>
        </div>
      );
    }
    return (
      <div className='flex items-center gap-2 text-gray-600'>
        <span className='h-2 w-2 rounded-full bg-gray-400'></span>
        <span className='text-sm font-medium'>خارج الخدمة</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[var(--primary-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-primary)] mx-auto mb-4'></div>
          <p className='text-gray-600'>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[var(--primary-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <p className='text-red-600 mb-4'>خطأ في تحميل البيانات: {error}</p>
          <Button onClick={fetchDashboardData} variant='primary'>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className='min-h-screen bg-[var(--primary-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData.statistics;

  return (
    <div className='min-h-screen bg-[var(--primary-surface)]'>
      {/* Header */}
      <header className='border-primary sticky top-0 z-10 border-b bg-white dark:bg-gray-900'>
        <div className='container-app py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src='/logo.png'
                alt='مركز الهمم'
                width={50}
                height={50}
                className='rounded-lg'
              />
              <div>
                <h1 className='text-primary text-2xl font-bold'>
                  لوحة تحكم الإدارة
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  مركز الهمم للرعاية الصحية المتخصصة
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value as any)}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm'
              >
                <option value='today'>اليوم</option>
                <option value='week'>هذا الأسبوع</option>
                <option value='month'>هذا الشهر</option>
                <option value='year'>هذا العام</option>
              </select>
              <Button variant='outline' size='sm' onClick={fetchDashboardData}>
                تحديث البيانات
              </Button>
              <Button variant='outline' size='sm'>
                تصدير التقرير
              </Button>
              <Button variant='primary' size='sm'>
                إعدادات
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8'>
        {/* Main Stats Grid */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='p-6 text-center'>
            <div className='text-primary mb-2 text-3xl font-bold'>
              {stats.totalPatients.toLocaleString()}
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي المرضى
            </div>
            <div className='text-sm text-green-600'>
              {stats.activePatients} نشط • {stats.blockedPatients} محظور
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-green-600'>
              {stats.totalAppointments.toLocaleString()}
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي المواعيد
            </div>
            <div className='text-sm text-blue-600'>
              {stats.completedAppointments} مكتمل • {stats.pendingAppointments}{' '}
              قيد الانتظار
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {stats.totalRevenue.toLocaleString()} ريال
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي الإيرادات
            </div>
            <div className='text-sm text-green-600'>
              {stats.monthlyRevenue.toLocaleString()} ريال هذا الشهر
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-orange-600'>
              {stats.totalStaff}
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي الموظفين
            </div>
            <div className='text-sm text-blue-600'>
              {stats.activeStaff} نشط • {stats.onDutyStaff} في الخدمة الآن
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>المطالبات التأمينية</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  إجمالي المطالبات:
                </span>
                <span className='font-semibold'>{stats.totalClaims}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  موافق عليها:
                </span>
                <span className='font-semibold text-green-600'>
                  {stats.approvedClaims}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  قيد المراجعة:
                </span>
                <span className='font-semibold text-yellow-600'>
                  {stats.pendingClaims}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  مرفوضة:
                </span>
                <span className='font-semibold text-red-600'>
                  {stats.rejectedClaims}
                </span>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>الجلسات العلاجية</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  إجمالي الجلسات:
                </span>
                <span className='font-semibold'>
                  {stats.totalSessions.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  مكتملة:
                </span>
                <span className='font-semibold text-green-600'>
                  {stats.completedSessions.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>قادمة:</span>
                <span className='font-semibold text-blue-600'>
                  {stats.upcomingSessions.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>معدلات الأداء</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  معدل إكمال المواعيد:
                </span>
                <span className='font-semibold text-green-600'>
                  {Math.round(
                    (stats.completedAppointments / stats.totalAppointments) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  معدل الموافقة على المطالبات:
                </span>
                <span className='font-semibold text-green-600'>
                  {Math.round((stats.approvedClaims / stats.totalClaims) * 100)}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  معدل إكمال الجلسات:
                </span>
                <span className='font-semibold text-green-600'>
                  {Math.round(
                    (stats.completedSessions / stats.totalSessions) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Charts Section */}
        <div className='mb-8'>
          <Card className='p-6'>
            <h3 className='mb-6 text-lg font-semibold'>
              الرسوم البيانية والإحصائيات
            </h3>
            <DynamicCharts data={dashboardData.charts} />
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Recent Activities */}
          <Card className='p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>النشاطات الأخيرة</h3>
              <Button variant='outline' size='sm'>
                عرض الكل
              </Button>
            </div>
            <div className='space-y-4'>
              {dashboardData.recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800'
                >
                  {getActivityIcon(activity.type)}
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        {activity.title}
                      </h4>
                      <span className='text-xs text-gray-500'>
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Staff Work Hours */}
          <Card className='p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>ساعات عمل الموظفين</h3>
              <Button variant='outline' size='sm'>
                عرض التقرير الكامل
              </Button>
            </div>
            <div className='space-y-4'>
              {dashboardData.staffWorkHours.map(staff => (
                <div key={staff.id} className='rounded-lg border p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        {staff.name}
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {staff.position}
                      </p>
                    </div>
                    {getOnDutyStatus(staff)}
                  </div>
                  <div className='grid grid-cols-3 gap-4 text-sm'>
                    <div className='text-center'>
                      <div className='text-primary font-semibold'>
                        {staff.todayHours}س
                      </div>
                      <div className='text-gray-600 dark:text-gray-300'>
                        اليوم
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='font-semibold text-blue-600'>
                        {staff.thisWeekHours}س
                      </div>
                      <div className='text-gray-600 dark:text-gray-300'>
                        هذا الأسبوع
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='font-semibold text-green-600'>
                        {staff.thisMonthHours}س
                      </div>
                      <div className='text-gray-600 dark:text-gray-300'>
                        هذا الشهر
                      </div>
                    </div>
                  </div>
                  {staff.isOnDuty && staff.lastCheckIn && (
                    <div className='mt-2 text-xs text-gray-500'>
                      آخر تسجيل دخول: {staff.lastCheckIn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className='mt-8 p-6'>
          <h3 className='mb-6 text-lg font-semibold'>إجراءات سريعة</h3>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>👤</span>
              <span className='text-sm'>إضافة مريض</span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>📅</span>
              <span className='text-sm'>حجز موعد</span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>📋</span>
              <span className='text-sm'>مطالبة تأمين</span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>👨‍⚕️</span>
              <span className='text-sm'>إضافة موظف</span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>📊</span>
              <span className='text-sm'>تقرير مالي</span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
            >
              <span className='mb-2 text-2xl'>⚙️</span>
              <span className='text-sm'>الإعدادات</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

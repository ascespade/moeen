'use client';
import Link from 'next/link';
import { useState } from 'react';

import { AdminCard, AdminStatsCard, AdminHeader } from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { cn } from '@/lib/utils';
import { AdminPageWrapper } from '@/lib/admin/page-wrapper';
import { ADMIN_PAGES } from '@/lib/admin/page-config';
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  RefreshCw,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

// Types from hook (used in component)
// interface RecentActivity {
//   id: string;
//   type: 'appointment' | 'claim' | 'patient' | 'staff' | 'payment';
//   title: string;
//   description: string;
//   timestamp: string;
//   status: 'success' | 'warning' | 'error' | 'info';
//   user?: string;
// }

interface StaffWorkHours {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  totalHours: number;
  todayHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  isOnDuty: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
  attendanceStatus: string;
}

const activityTypeConfig = {
  appointment: {
    icon: '📅',
    color: 'var(--brand-info)',
    bgStyle: 'bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)]',
    borderStyle:
      'border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]',
  },
  claim: {
    icon: '📋',
    color: 'var(--brand-success)',
    bgStyle: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)]',
    borderStyle:
      'border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]',
  },
  patient: {
    icon: '👤',
    color: 'var(--brand-error)',
    bgStyle: 'bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)]',
    borderStyle:
      'border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]',
  },
  staff: {
    icon: '👨‍⚕️',
    color: 'var(--brand-primary)',
    bgStyle: 'bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)]',
    borderStyle:
      'border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)]',
  },
  payment: {
    icon: '💰',
    color: 'var(--brand-success)',
    bgStyle: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)]',
    borderStyle:
      'border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]',
  },
} as const;

function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('month');

  const localizedNumber = useLocalizedNumber();

  const { stats, activities, staffWorkHours, loading, error, refetch } =
    useAdminDashboard(selectedPeriod);

  const getActivityIcon = (type: string) => {
    const config =
      activityTypeConfig[type as keyof typeof activityTypeConfig] ||
      activityTypeConfig.appointment;
    return (
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center text-sm border',
          config.bgStyle,
          config.borderStyle
        )}
      >
        {config.icon}
      </div>
    );
  };

  const getOnDutyStatus = (staff: StaffWorkHours) => {
    if (staff.isOnDuty) {
      return (
        <div
          className='flex items-center gap-2'
          style={{ color: 'var(--brand-success)' }}
        >
          <span
            className='h-2 w-2 animate-pulse rounded-full'
            style={{ backgroundColor: 'var(--brand-success)' }}
          ></span>
          <span className='text-sm font-medium'>في الخدمة</span>
        </div>
      );
    }
    return (
      <div className='flex items-center gap-2 text-[var(--text-secondary)]'>
        <span className='h-2 w-2 rounded-full bg-[var(--text-muted)]'></span>
        <span className='text-sm font-medium'>خارج الخدمة</span>
      </div>
    );
  };

  // Show loading state - minimal, only in content area
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 mx-auto'></div>
          <p className='text-sm text-gray-600'>
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </div>
    );
  }

  // Show error state - minimal, only in content area
  if (error) {
    return (
      <div className='min-h-[400px]'>
        <AdminHeader
          title='لوحة تحكم الإدارة'
          description='حدث خطأ في تحميل البيانات'
        >
          <Button
            onClick={refetch}
            className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
          >
            <RefreshCw className='w-4 h-4 ml-2' />
            إعادة المحاولة
          </Button>
        </AdminHeader>

        <main className='container-app py-8' id="main-content">
          <div className='text-center py-16'>
            <AlertTriangle
              className='w-16 h-16 mx-auto mb-4'
              style={{ color: 'var(--brand-error)' }}
            />
            <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
              فشل في تحميل البيانات
            </h3>
            <p className='text-[var(--text-secondary)] mb-4'>{error}</p>
            <Button onClick={refetch}>
              <RefreshCw className='w-4 h-4 ml-2' />
              إعادة المحاولة
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <AdminHeader
        title='لوحة تحكم الإدارة'
        description='مركز الهمم للرعاية الصحية المتخصصة'
      >
        <Button
          variant='outline'
          size='sm'
          className='border-[var(--brand-border)] hover:bg-[var(--brand-error)]/10'
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', {
                method: 'POST',
                cache: 'no-store',
                credentials: 'include',
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
            try {
              localStorage.removeItem('user');
            } catch (error) {
              console.error('LocalStorage error:', error);
            }
            router.push('/login');
          }}
        >
          خروج
        </Button>
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month' | 'year')}
          className='rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm bg-[var(--panel)] text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20'
        >
          <option value='today'>اليوم</option>
          <option value='week'>هذا الأسبوع</option>
          <option value='month'>هذا الشهر</option>
          <option value='year'>هذا العام</option>
        </select>
        <Button
          variant='outline'
          size='sm'
          className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
        >
          <Download className='w-4 h-4 ml-2' />
          تصدير التقرير
        </Button>
        <Button
          asChild
          className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
        >
          <Link href='/admin/settings'>
            <Settings className='w-4 h-4 ml-2' />
            إعدادات
          </Link>
        </Button>
      </AdminHeader>

      <main className='container-app py-8 space-y-8' id="main-content">
        {/* Main Stats Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <AdminStatsCard
            title='إجمالي المرضى'
            value={localizedNumber(
              (stats?.totalPatients || 0).toLocaleString()
            )}
            subtitle={`${localizedNumber((stats?.activePatients || 0).toString())} نشط • ${stats?.blockedPatients || 0} محظور`}
            icon={Users}
            iconColor='var(--brand-primary)'
            trend={{ value: 12, isPositive: true }}
          />

          <AdminStatsCard
            title='إجمالي المواعيد'
            value={localizedNumber(
              (stats?.totalAppointments || 0).toLocaleString()
            )}
            subtitle={`${localizedNumber((stats?.completedAppointments || 0).toString())} مكتمل • ${localizedNumber((stats?.pendingAppointments || 0).toString())} قيد الانتظار`}
            icon={Calendar}
            iconColor='var(--brand-success)'
            trend={{ value: 8, isPositive: true }}
          />

          <AdminStatsCard
            title='إجمالي الإيرادات'
            value={`${localizedNumber((stats?.totalRevenue || 0).toLocaleString())} ريال`}
            subtitle={`${localizedNumber((stats?.monthlyRevenue || 0).toLocaleString())} ريال هذا الشهر`}
            icon={DollarSign}
            iconColor='var(--brand-primary)'
            trend={{ value: 15, isPositive: true }}
          />

          <AdminStatsCard
            title='إجمالي الموظفين'
            value={localizedNumber((stats?.totalStaff || 0).toString())}
            subtitle={`${localizedNumber((stats?.activeStaff || 0).toString())} نشط • ${stats?.onDutyStaff || 0} في الخدمة الآن`}
            icon={UserCheck}
            iconColor='var(--brand-warning)'
          />
        </div>

        {/* Secondary Stats */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div
                className='w-12 h-12 rounded-xl border flex items-center justify-center'
                style={{
                  backgroundColor:
                    'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
                  borderColor:
                    'color-mix(in srgb, var(--brand-primary) 20%, transparent)',
                }}
              >
                <FileText
                  className='w-6 h-6'
                  style={{ color: 'var(--brand-primary)' }}
                />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                المطالبات التأمينية
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>
                  إجمالي المطالبات:
                </span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {stats?.totalClaims || 0}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>
                  موافق عليها:
                </span>
                <span className='font-semibold text-[var(--brand-success)]'>
                  {stats?.approvedClaims || 0}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>
                  قيد المراجعة:
                </span>
                <span className='font-semibold text-[var(--brand-warning)]'>
                  {stats?.pendingClaims || 0}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>مرفوضة:</span>
                <span className='font-semibold text-[var(--brand-error)]'>
                  {stats?.rejectedClaims || 0}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div
                className='w-12 h-12 rounded-xl border flex items-center justify-center'
                style={{
                  backgroundColor:
                    'color-mix(in srgb, var(--brand-info) 10%, transparent)',
                  borderColor:
                    'color-mix(in srgb, var(--brand-info) 20%, transparent)',
                }}
              >
                <Activity
                  className='w-6 h-6'
                  style={{ color: 'var(--brand-info)' }}
                />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                الجلسات العلاجية
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>
                  إجمالي الجلسات:
                </span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {localizedNumber(
                    (stats?.totalSessions || 0).toLocaleString()
                  )}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>مكتملة:</span>
                <span className='font-semibold text-[var(--brand-success)]'>
                  {localizedNumber(
                    (stats?.completedSessions || 0).toLocaleString()
                  )}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>قادمة:</span>
                <span className='font-semibold text-[var(--brand-info)]'>
                  {localizedNumber(
                    (stats?.upcomingSessions || 0).toLocaleString()
                  )}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div
                className='w-12 h-12 rounded-xl border flex items-center justify-center'
                style={{
                  backgroundColor:
                    'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
                  borderColor:
                    'color-mix(in srgb, var(--brand-primary) 20%, transparent)',
                }}
              >
                <TrendingUp
                  className='w-6 h-6'
                  style={{ color: 'var(--brand-primary)' }}
                />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
                معدلات الأداء
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>
                  معدل إكمال المواعيد:
                </span>
                <span className='font-semibold text-[var(--brand-success)]'>
                  {stats?.totalAppointments
                    ? Math.round(
                        ((stats.completedAppointments || 0) /
                          stats.totalAppointments) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>
                  معدل الموافقة على المطالبات:
                </span>
                <span className='font-semibold text-[var(--brand-success)]'>
                  {stats?.totalClaims
                    ? Math.round(
                        ((stats.approvedClaims || 0) / stats.totalClaims) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>
                  معدل إكمال الج��سات:
                </span>
                <span className='font-semibold text-[var(--brand-success)]'>
                  {stats?.totalSessions
                    ? Math.round(
                        ((stats.completedSessions || 0) / stats.totalSessions) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Recent Activities */}
          <AdminCard className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-10 h-10 rounded-xl border flex items-center justify-center'
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--brand-success) 10%, transparent)',
                    borderColor:
                      'color-mix(in srgb, var(--brand-success) 20%, transparent)',
                  }}
                >
                  <Clock
                    className='w-5 h-5'
                    style={{ color: 'var(--brand-success)' }}
                  />
                </div>
                <h3 className='text-xl font-semibold text-[var(--text-primary)]'>
                  النشاطات الأخيرة
                </h3>
              </div>
              <Button
                asChild
                variant='outline'
                size='sm'
                className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
              >
                <Link href='/admin/audit-logs'>عرض الكل</Link>
              </Button>
            </div>
            <div className='space-y-3'>
              {activities && activities.length > 0 ? (
                activities.map(activity => (
                  <div
                    key={activity.id}
                    className='group flex items-start gap-4 p-4 rounded-xl border border-[var(--brand-border)]/50 hover:border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)]/5 transition-all duration-200'
                  >
                    {getActivityIcon(activity.type)}
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <h4 className='font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]'>
                          {activity.title}
                        </h4>
                        <span className='text-xs text-[var(--text-secondary)] bg-[var(--brand-surface)] px-2 py-1 rounded-md'>
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className='text-sm text-[var(--text-secondary)] leading-relaxed'>
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-[var(--text-secondary)]'>
                  لا توجد نشاطات حديثة
                </div>
              )}
            </div>
          </AdminCard>

          {/* Staff Work Hours */}
          <AdminCard className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-10 h-10 rounded-xl border flex items-center justify-center'
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--brand-info) 10%, transparent)',
                    borderColor:
                      'color-mix(in srgb, var(--brand-info) 20%, transparent)',
                  }}
                >
                  <Users
                    className='w-5 h-5'
                    style={{ color: 'var(--brand-info)' }}
                  />
                </div>
                <h3 className='text-xl font-semibold text-[var(--text-primary)]'>
                  ساعات عمل الموظفين
                </h3>
              </div>
              <Button
                asChild
                variant='outline'
                size='sm'
                className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
              >
                <Link href='/admin/therapists/schedules'>
                  عرض التقرير الكامل
                </Link>
              </Button>
            </div>
            <div className='space-y-4'>
              {staffWorkHours && staffWorkHours.length > 0 ? (
                staffWorkHours.map(staff => (
                  <div
                    key={staff.id}
                    className='group p-4 rounded-xl border border-[var(--brand-border)]/50 hover:border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)]/5 transition-all duration-200'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center'>
                          <span className='text-sm font-semibold text-[var(--brand-primary)]'>
                            {staff.name?.split(' ')[0]?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <h4 className='font-semibold text-[var(--text-primary)]'>
                            {staff.name}
                          </h4>
                          <p className='text-sm text-[var(--text-secondary)]'>
                            {staff.position}
                          </p>
                        </div>
                      </div>
                      {getOnDutyStatus(staff)}
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='text-center p-3 bg-[var(--brand-surface)] rounded-lg'>
                        <div className='text-lg font-bold text-[var(--brand-primary)]'>
                          {staff.todayHours}س
                        </div>
                        <div className='text-xs text-[var(--text-secondary)]'>
                          اليوم
                        </div>
                      </div>
                      <div className='text-center p-3 bg-[var(--brand-surface)] rounded-lg'>
                        <div className='text-lg font-bold text-[var(--brand-info)]'>
                          {staff.thisWeekHours}س
                        </div>
                        <div className='text-xs text-[var(--text-secondary)]'>
                          هذا الأسبوع
                        </div>
                      </div>
                      <div className='text-center p-3 bg-[var(--brand-surface)] rounded-lg'>
                        <div className='text-lg font-bold text-[var(--brand-success)]'>
                          {staff.thisMonthHours}س
                        </div>
                        <div className='text-xs text-[var(--text-secondary)]'>
                          هذا الشهر
                        </div>
                      </div>
                    </div>
                    {staff.isOnDuty && staff.lastCheckIn && (
                      <div className='mt-3 text-xs text-[var(--text-secondary)] bg-[var(--brand-surface)] px-3 py-1 rounded-md inline-block'>
                        آخر تسجيل دخول: {staff.lastCheckIn}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-[var(--text-secondary)]'>
                  لا توجد بيانات للموظفين
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <Card className='mt-8 p-6'>
          <h3 className='mb-6 text-lg font-semibold text-[var(--text-primary)]'>
            إجراءات سريعة
          </h3>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <UserCheck className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                إضافة مريض
              </span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <Calendar className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                حجز موعد
              </span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <FileText className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                مطالبة تأمين
              </span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <Users className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                إضافة موظف
              </span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <TrendingUp className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                تقرير مالي
              </span>
            </Button>
            <Button
              variant='outline'
              className='flex h-20 flex-col items-center justify-center border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <Settings className='mb-2 w-6 h-6 text-[var(--brand-primary)]' />
              <span className='text-sm text-[var(--text-primary)]'>
                الإعدادات
              </span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const pageConfig = ADMIN_PAGES.dashboard;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig?.requiredPermissions}
      pageTitle={pageConfig?.title || 'لوحة التحكم'}
    >
      <AdminDashboardPage />
    </AdminPageWrapper>
  );
}

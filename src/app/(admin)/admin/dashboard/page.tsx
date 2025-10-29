'use client';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { AdminHeader, AdminStatsCard, AdminCard } from '@/components/admin/ui';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  UserCheck,
  Activity,
  FileText,
  Settings,
  Download,
  Plus,
  TrendingUp,
  AlertTriangle,
  Clock,
  RefreshCw
} from 'lucide-react';

// Types are now imported from the hook


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
  info: { color: 'text-orange-600', bg: 'bg-orange-50' },
};

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('month');
  
  const localizedNumber = useLocalizedNumber();
  
  // Use the new hook for real data
  const { 
    stats, 
    activities, 
    staffWorkHours, 
    loading, 
    error,
    refetch 
  } = useAdminDashboard(selectedPeriod);

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

  // Show loading state
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--background)]'>
        <div className='text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[var(--brand-primary)] mx-auto'></div>
          <p className='text-[var(--text-secondary)]'>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='min-h-screen bg-[var(--background)]'>
        <AdminHeader
          title="لوحة تحكم الإدارة"
          description="حدث خطأ في تحميل البيانات"
        >
          <Button 
            onClick={refetch}
            className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
          >
            <RefreshCw className='w-4 h-4 ml-2' />
            إعادة المحاولة
          </Button>
        </AdminHeader>
        
        <main className='container-app py-8'>
          <div className='text-center py-16'>
            <AlertTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
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
      {/* Modern Header */}
      <AdminHeader
        title="لوحة تحكم الإدارة"
        description="مركز الهمم للرعاية الصحية المتخصصة"
      >
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value as any)}
          className='rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm bg-[var(--panel)] text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20'
        >
          <option value='today'>اليوم</option>
          <option value='week'>هذا الأسبوع</option>
          <option value='month'>هذا الشهر</option>
          <option value='year'>هذا العام</option>
        </select>
        <Button variant='outline' size='sm' className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'>
          <Download className='w-4 h-4 ml-2' />
          تصدير التقرير
        </Button>
        <Button asChild className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'>
          <Link href="/admin/settings">
            <Settings className='w-4 h-4 ml-2' />
            إعدادات
          </Link>
        </Button>
      </AdminHeader>

      <main className='container-app py-8 space-y-8'>
        {/* Main Stats Grid - Modern Design */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <AdminStatsCard
            title="إجمالي المرضى"
            value={localizedNumber(stats.totalPatients.toLocaleString())}
            subtitle={`${localizedNumber(stats.activePatients.toString())} نشط • ${stats.blockedPatients} محظور`}
            icon={Users}
            iconColor="var(--brand-primary)"
            trend={{
              value: 12,
              isPositive: true
            }}
          />
          
          <AdminStatsCard
            title="إجمالي المواعيد"
            value={localizedNumber(stats.totalAppointments.toLocaleString())}
            subtitle={`${localizedNumber(stats.completedAppointments.toString())} مكتمل • ${localizedNumber(stats.pendingAppointments.toString())} قيد الانتظار`}
            icon={Calendar}
            iconColor="var(--brand-success)" // Changed from hardcoded #10b981
            trend={{
              value: 8,
              isPositive: true
            }}
          />
          
          <AdminStatsCard
            title="إجمالي الإيرادات"
            value={`${localizedNumber(stats.totalRevenue.toLocaleString())} ريال`}
            subtitle={`${localizedNumber(stats.monthlyRevenue.toLocaleString())} ريال هذا الشهر`}
            icon={DollarSign}
            iconColor="var(--brand-primary)" // Changed from hardcoded #8b5cf6
            trend={{
              value: 15,
              isPositive: true
            }}
          />
          
          <AdminStatsCard
            title="إجمالي الموظفين"
            value={localizedNumber(stats.totalStaff.toString())}
            subtitle={`${localizedNumber(stats.activeStaff.toString())} نشط • ${stats.onDutyStaff} في الخدمة الآن`}
            icon={UserCheck}
            iconColor="var(--brand-warning)" // Changed from hardcoded #f59e0b
          />
        </div>

        {/* Secondary Stats - Enhanced Design */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-[var(--brand-primary)]' />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>المطالبات التأمينية</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>إجمالي المطالبات:</span>
                <span className='font-semibold text-[var(--text-primary)]'>{stats.totalClaims}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>موافق عليها:</span>
                <span className='font-semibold text-green-600'>{stats.approvedClaims}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>قيد المراجعة:</span>
                <span className='font-semibold text-yellow-600'>{stats.pendingClaims}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>مرفوضة:</span>
                <span className='font-semibold text-red-600'>{stats.rejectedClaims}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center'>
                <Activity className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>الجلسات العلاجية</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>إجمالي الجلسات:</span>
                <span className='font-semibold text-[var(--text-primary)]'>
                  {localizedNumber(stats.totalSessions.toLocaleString())}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>مكتملة:</span>
                <span className='font-semibold text-green-600'>
                  {localizedNumber(stats.completedSessions.toLocaleString())}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>قادمة:</span>
                <span className='font-semibold text-blue-600'>
                  {localizedNumber(stats.upcomingSessions.toLocaleString())}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>معدلات الأداء</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-[var(--brand-border)]/50'>
                <span className='text-[var(--text-secondary)]'>معدل إكمال المواعيد:</span>
                <span className='font-semibold text-green-600'>
                  {Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>معدل الموافقة على المطالبات:</span>
                <span className='font-semibold text-green-600'>
                  {Math.round((stats.approvedClaims / stats.totalClaims) * 100)}%
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-[var(--text-secondary)]'>معدل إكمال الجلسات:</span>
                <span className='font-semibold text-green-600'>
                  {Math.round((stats.completedSessions / stats.totalSessions) * 100)}%
                </span>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Recent Activities - Enhanced */}
          <AdminCard className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center'>
                  <Clock className='w-5 h-5 text-green-600' />
                </div>
                <h3 className='text-xl font-semibold text-[var(--text-primary)]'>النشاطات الأخيرة</h3>
              </div>
              <Button 
                asChild
                variant='outline' 
                size='sm'
                className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
              >
                <Link href="/admin/audit-logs">
                  عرض الكل
                </Link>
              </Button>
            </div>
            <div className='space-y-3'>
              {activities.map(activity => (
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
              ))}
            </div>
          </AdminCard>

          {/* Staff Work Hours - Enhanced */}
          <AdminCard className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center'>
                  <Users className='w-5 h-5 text-blue-600' />
                </div>
                <h3 className='text-xl font-semibold text-[var(--text-primary)]'>ساعات عمل الموظفين</h3>
              </div>
              <Button 
                asChild
                variant='outline' 
                size='sm'
                className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
              >
                <Link href="/admin/therapists/schedules">
                  عرض التقرير الكامل
                </Link>
              </Button>
            </div>
            <div className='space-y-4'>
              {staffWorkHours.map(staff => (
                <div key={staff.id} className='group p-4 rounded-xl border border-[var(--brand-border)]/50 hover:border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)]/5 transition-all duration-200'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center'>
                        <span className='text-sm font-semibold text-[var(--brand-primary)]'>
                          {staff.name.split(' ')[0].charAt(0)}
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
                      <div className='text-lg font-bold text-blue-600'>
                        {staff.thisWeekHours}س
                      </div>
                      <div className='text-xs text-[var(--text-secondary)]'>
                        هذا الأسبوع
                      </div>
                    </div>
                    <div className='text-center p-3 bg-[var(--brand-surface)] rounded-lg'>
                      <div className='text-lg font-bold text-green-600'>
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
              ))}
            </div>
          </AdminCard>
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

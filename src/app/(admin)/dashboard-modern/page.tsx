'use client';

import { useMemo, useState } from 'react';

import { AdminHeader } from '@/components/admin/ui';
import { DashboardGrid, GridItem } from '@/components/dashboard/DashboardGrid';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import KPICard from '@/components/dashboard/widgets/KPICard';
import NotificationPanel, { Notification } from '@/components/dashboard/widgets/NotificationPanel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  FileText,
  RefreshCw,
  Settings,
  Stethoscope,
  UserCheck,
  Users
} from 'lucide-react';

// Mock data for demonstration - replace with real data from useAdminDashboard
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'تحذير: انخفاض في المخزون',
    message: 'مخزون الأدوية الطارئة منخفض. يرجى إعادة التزويد قريباً.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    priority: 'high',
    category: 'المخزون',
    actionLabel: 'عرض المخزون',
    actionUrl: '/admin/inventory'
  },
  {
    id: '2',
    type: 'success',
    title: 'تم إكمال النسخ الاحتياطي',
    message: 'تم بنجاح إنشاء نسخة احتياطية من قاعدة البيانات.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    priority: 'medium',
    category: 'النظام'
  },
  {
    id: '3',
    type: 'info',
    title: 'موعد جديد محجوز',
    message: 'تم حجز موعد جديد للمريض أحمد محمد.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isRead: false,
    priority: 'low',
    category: 'الحجوزات',
    actionLabel: 'عرض الموعد',
    actionUrl: '/admin/appointments'
  }
];

const mockChartData = {
  patientGrowth: [
    { label: 'يناير', value: 120 },
    { label: 'فبراير', value: 135 },
    { label: 'مارس', value: 148 },
    { label: 'أبريل', value: 162 },
    { label: 'مايو', value: 178 },
    { label: 'يونيو', value: 195 },
  ],
  appointments: [
    { label: 'السبت', value: 45 },
    { label: 'الأحد', value: 52 },
    { label: 'الاثنين', value: 48 },
    { label: 'الثلاثاء', value: 61 },
    { label: 'الأربعاء', value: 55 },
    { label: 'الخميس', value: 49 },
    { label: 'الجمعة', value: 38 },
  ],
  revenue: [
    { label: 'عيادة', value: 45000 },
    { label: 'عمليات', value: 120000 },
    { label: 'أدوية', value: 35000 },
    { label: 'تحاليل', value: 28000 },
    { label: 'أخرى', value: 15000 },
  ]
};

export default function ModernAdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'year'
  >('month');

  const [isGridEditable, setIsGridEditable] = useState(false);
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

  // Dashboard grid items configuration
  const gridItems: GridItem[] = useMemo(() => [
    {
      id: 'total-patients',
      x: 0,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'إجمالي المرضى',
        value: stats?.totalPatients || 1250,
        subtitle: 'مريض مسجل',
        trend: { value: 12.5, label: 'من الشهر الماضي', isPositive: true },
        icon: Users,
        variant: 'info',
        size: 'lg'
      }
    },
    {
      id: 'total-appointments',
      x: 3,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'إجمالي الحجوزات',
        value: stats?.totalAppointments || 342,
        subtitle: 'حجز هذا الشهر',
        trend: { value: 8.2, label: 'من الشهر الماضي', isPositive: true },
        icon: Calendar,
        variant: 'success',
        size: 'lg'
      }
    },
    {
      id: 'total-revenue',
      x: 6,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'إجمالي الإيرادات',
        value: `${localizedNumber(stats?.totalRevenue || 245000)} ريال`,
        subtitle: 'إيرادات هذا الشهر',
        trend: { value: 15.3, label: 'من الشهر الماضي', isPositive: true },
        icon: DollarSign,
        variant: 'success',
        size: 'lg'
      }
    },
    {
      id: 'active-staff',
      x: 9,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'الموظفين النشطين',
        value: stats?.activeStaff || 28,
        subtitle: 'موظف متاح الآن',
        trend: { value: 2.1, label: 'من الأسبوع الماضي', isPositive: false },
        icon: UserCheck,
        variant: 'warning',
        size: 'lg'
      }
    },
    {
      id: 'patient-growth-chart',
      x: 0,
      y: 2,
      width: 6,
      height: 4,
      component: ChartWidget,
      title: 'نمو المرضى',
      props: {
        type: 'bar',
        data: mockChartData.patientGrowth,
        height: 300
      }
    },
    {
      id: 'appointments-chart',
      x: 6,
      y: 2,
      width: 6,
      height: 4,
      component: ChartWidget,
      title: 'المواعيد',
      props: {
        type: 'line',
        data: mockChartData.appointments,
        height: 300
      }
    },
    {
      id: 'revenue-breakdown',
      x: 0,
      y: 6,
      width: 4,
      height: 4,
      component: ChartWidget,
      title: 'توزيع الإيرادات',
      props: {
        type: 'pie',
        data: mockChartData.revenue,
        height: 300
      }
    },
    {
      id: 'notifications',
      type: 'component',
      component: NotificationPanel,
      props: {
        notifications: mockNotifications,
        maxHeight: 400,
        onMarkAsRead: (id: string) => console.log('Mark as read:', id),
        onMarkAllAsRead: () => console.log('Mark all as read'),
        onActionClick: (notification: any) => console.log('Action:', notification)
      }
    }
  ], [stats, localizedNumber]);

  return (
    <div className='flex h-screen flex-col bg-neutral-50 dark:bg-neutral-950'>
      <AdminHeader
        title='لوحة التحكم الإدارية المحدثة'
        actions={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsGridEditable(!isGridEditable)}
            >
              <Settings className='w-4 h-4 mr-2' />
              {isGridEditable ? 'إنهاء التخصيص' : 'تخصيص الداشبورد'}
            </Button>
            <Button variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              تصدير البيانات
            </Button>
            <Button variant='primary' onClick={refetch}>
              <RefreshCw className='w-4 h-4 mr-2' />
              تحديث
            </Button>
          </div>
        }
      />

      <main className='flex-1 overflow-auto'>
        {/* Period Selector */}
        <div className='p-6 pb-0'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex gap-2'>
              {(['today', 'week', 'month', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'primary' : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === 'today' && 'اليوم'}
                  {period === 'week' && 'الأسبوع'}
                  {period === 'month' && 'الشهر'}
                  {period === 'year' && 'السنة'}
                </Button>
              ))}
            </div>

            {isGridEditable && (
              <div className='text-sm text-neutral-600 dark:text-neutral-400'>
                اسحب المكونات لإعادة ترتيبها • اضغط لتغيير الحجم
              </div>
            )}
          </div>

          {/* Enhanced Dashboard Grid */}
          <DashboardGrid
            items={gridItems}
            columns={12}
            rowHeight={80}
            isEditable={isGridEditable}
            onItemChange={(items) => {
              // Handle layout changes
              console.log('Layout changed:', items);
            }}
            onItemAdd={() => {
              // Handle adding new widget
              console.log('Add new widget');
            }}
            onItemRemove={(id) => {
              // Handle removing widget
              console.log('Remove widget:', id);
            }}
            className='mb-8'
          />
        </div>

        {/* Quick Actions */}
        <div className='px-6 pb-6'>
          <Card variant="elevated">
            <div className='p-6'>
              <h3 className='text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4'>
                الإجراءات السريعة
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <Users className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>إضافة مريض</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <Calendar className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>حجز موعد</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <FileText className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>مطالبة تأمين</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <Stethoscope className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>إضافة موظف</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <BarChart3 className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>تقرير مالي</span>
                </Button>
                <Button
                  variant='outline'
                  className='flex h-20 flex-col items-center justify-center hover-lift'
                >
                  <Settings className='w-6 h-6 mb-2 text-primary-600' />
                  <span className='text-sm'>الإعدادات</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

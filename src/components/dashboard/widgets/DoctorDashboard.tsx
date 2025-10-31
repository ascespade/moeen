'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    FileText,
    Pill,
    Stethoscope,
    Timer,
    Users
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DashboardGrid, GridItem } from '../DashboardGrid';
import ChartWidget from './ChartWidget';
import KPICard from './KPICard';

export interface DoctorDashboardProps {
  doctorId: string;
  className?: string;
}

// Mock data - replace with real API calls
const mockDoctorStats = {
  todayAppointments: 12,
  completedToday: 8,
  pendingToday: 4,
  averageConsultationTime: 25,
  patientSatisfaction: 4.8,
  totalPatients: 245,
  monthlyAppointments: 156,
  prescriptionAccuracy: 98.5
};

const mockTodaySchedule = [
  {
    id: '1',
    time: '09:00',
    patientName: 'أحمد محمد',
    type: 'استشارة أولية',
    status: 'completed',
    duration: 30
  },
  {
    id: '2',
    time: '09:30',
    patientName: 'فاطمة علي',
    type: 'متابعة',
    status: 'in-progress',
    duration: 20
  },
  {
    id: '3',
    time: '10:00',
    patientName: 'محمد حسن',
    type: 'طوارئ',
    status: 'pending',
    duration: 15
  }
];

const mockPerformanceData = [
  { label: 'يناير', value: 92 },
  { label: 'فبراير', value: 88 },
  { label: 'مارس', value: 95 },
  { label: 'أبريل', value: 97 },
  { label: 'مايو', value: 94 },
  { label: 'يونيو', value: 98.5 },
];

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorId,
  className,
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'schedule' | 'performance'>('overview');

  const gridItems: GridItem[] = useMemo(() => [
    {
      id: 'today-appointments',
      x: 0,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'مواعيد اليوم',
        value: mockDoctorStats.todayAppointments,
        subtitle: `${mockDoctorStats.completedToday} مكتمل`,
        trend: { value: 5.2, label: 'من الأمس', isPositive: true },
        icon: Calendar,
        variant: 'info',
        size: 'lg'
      }
    },
    {
      id: 'patient-satisfaction',
      x: 3,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'رضا المرضى',
        value: `${mockDoctorStats.patientSatisfaction}/5`,
        subtitle: 'متوسط التقييم',
        trend: { value: 0.3, label: 'من الشهر الماضي', isPositive: true },
        icon: CheckCircle,
        variant: 'success',
        size: 'lg'
      }
    },
    {
      id: 'avg-consultation-time',
      x: 6,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'متوسط الاستشارة',
        value: `${mockDoctorStats.averageConsultationTime} دقيقة`,
        subtitle: 'وقت فعال',
        trend: { value: 2.1, label: 'تحسن', isPositive: false },
        icon: Timer,
        variant: 'warning',
        size: 'lg'
      }
    },
    {
      id: 'total-patients',
      x: 9,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'إجمالي المرضى',
        value: mockDoctorStats.totalPatients,
        subtitle: 'مريض تحت الرعاية',
        trend: { value: 8.7, label: 'من الشهر الماضي', isPositive: true },
        icon: Users,
        variant: 'success',
        size: 'lg'
      }
    },
    {
      id: 'performance-chart',
      x: 0,
      y: 2,
      width: 8,
      height: 4,
      component: ChartWidget,
      title: 'أداء الطبيب',
      props: {
        type: 'line',
        data: mockPerformanceData,
        height: 300
      }
    },
    {
      id: 'today-schedule',
      x: 8,
      y: 2,
      width: 4,
      height: 4,
      component: Card,
      props: {
        variant: 'elevated',
        className: 'p-6'
      },
      children: (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            جدول اليوم
          </h3>
          <div className="space-y-3">
            {mockTodaySchedule.map((appointment) => (
              <div
                key={appointment.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  appointment.status === 'completed' && 'bg-success-50 dark:bg-success-900/20 border-success-200',
                  appointment.status === 'in-progress' && 'bg-primary-50 dark:bg-primary-900/20 border-primary-200',
                  appointment.status === 'pending' && 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    appointment.status === 'completed' && 'bg-success-500',
                    appointment.status === 'in-progress' && 'bg-primary-500',
                    appointment.status === 'pending' && 'bg-neutral-400'
                  )} />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-50">
                      {appointment.patientName}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {appointment.time} • {appointment.type}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    appointment.status === 'completed' ? 'success' :
                    appointment.status === 'in-progress' ? 'info' : 'secondary'
                  }
                >
                  {appointment.status === 'completed' && 'مكتمل'}
                  {appointment.status === 'in-progress' && 'جاري'}
                  {appointment.status === 'pending' && 'في الانتظار'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ], []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            لوحة الطبيب
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            إدارة المواعيد والمرضى بكفاءة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={selectedView === 'overview' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('overview')}
          >
            نظرة عامة
          </Button>
          <Button
            variant={selectedView === 'schedule' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('schedule')}
          >
            الجدول الزمني
          </Button>
          <Button
            variant={selectedView === 'performance' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('performance')}
          >
            الأداء
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 hover-lift"
        >
          <Stethoscope className="w-6 h-6 mb-2 text-primary-600" />
          <span className="text-sm">بدء استشارة</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 hover-lift"
        >
          <Pill className="w-6 h-6 mb-2 text-primary-600" />
          <span className="text-sm">وصفة طبية</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 hover-lift"
        >
          <FileText className="w-6 h-6 mb-2 text-primary-600" />
          <span className="text-sm">سجل المريض</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 hover-lift"
        >
          <AlertTriangle className="w-6 h-6 mb-2 text-primary-600" />
          <span className="text-sm">حالة طوارئ</span>
        </Button>
      </div>

      {/* Dashboard Grid */}
      <DashboardGrid
        items={gridItems}
        columns={12}
        rowHeight={80}
        className="min-h-[600px]"
      />

      {/* Additional Sections Based on View */}
      {selectedView === 'schedule' && (
        <Card variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            جدول الأسبوع
          </h3>
          <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
            جدول الأسبوع المفصل - سيتم تطويره في المرحلة التالية
          </div>
        </Card>
      )}

      {selectedView === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              إحصائيات الشهر
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">إجمالي المواعيد:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                  {mockDoctorStats.monthlyAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">معدل الدقة في الوصفات:</span>
                <span className="font-semibold text-success-600">
                  {mockDoctorStats.prescriptionAccuracy}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-600 dark:text-neutral-400">رضا المرضى:</span>
                <span className="font-semibold text-primary-600">
                  {mockDoctorStats.patientSatisfaction}/5 نجوم
                </span>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              مؤشرات الأداء
            </h3>
            <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
              رسوم بيانية تفصيلية للأداء - سيتم تطويرها في المرحلة التالية
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

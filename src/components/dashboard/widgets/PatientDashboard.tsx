'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Activity,
    Calendar,
    FileText,
    Heart,
    Pill,
    Stethoscope,
    Thermometer,
    Weight
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DashboardGrid, GridItem } from '../DashboardGrid';
import ChartWidget from './ChartWidget';
import KPICard from './KPICard';

export interface PatientDashboardProps {
  patientId: string;
  className?: string;
}

// Mock data - replace with real API calls
const mockPatientStats = {
  upcomingAppointments: 2,
  activeMedications: 3,
  recentResults: 5,
  healthScore: 85,
  lastVisit: '2024-01-15',
  nextAppointment: '2024-01-25',
  primaryDoctor: 'د. أحمد محمد'
};

const mockUpcomingAppointments = [
  {
    id: '1',
    date: '2024-01-25',
    time: '10:00',
    doctor: 'د. أحمد محمد',
    type: 'متابعة شهرية',
    location: 'العيادة الرئيسية'
  },
  {
    id: '2',
    date: '2024-02-01',
    time: '14:30',
    doctor: 'د. فاطمة علي',
    type: 'تحاليل دورية',
    location: 'مختبر التحاليل'
  }
];

const mockMedications = [
  {
    id: '1',
    name: 'أموكسيسيلين',
    dosage: '500mg',
    frequency: '3 مرات يومياً',
    remainingDays: 5,
    status: 'active'
  },
  {
    id: '2',
    name: 'إيبوبروفين',
    dosage: '200mg',
    frequency: 'عند الحاجة',
    remainingDays: 12,
    status: 'active'
  },
  {
    id: '3',
    name: 'فيتامين D',
    dosage: '1000 IU',
    frequency: 'مرة يومياً',
    remainingDays: 25,
    status: 'active'
  }
];

const mockHealthMetrics = [
  { label: 'كانون الثاني', value: 82 },
  { label: 'شباط', value: 85 },
  { label: 'آذار', value: 78 },
  { label: 'نيسان', value: 88 },
  { label: 'أيار', value: 92 },
  { label: 'حزيران', value: 85 },
];

const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patientId,
  className,
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'health' | 'appointments'>('overview');

  const gridItems: GridItem[] = useMemo(() => [
    {
      id: 'upcoming-appointments',
      x: 0,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'المواعيد القادمة',
        value: mockPatientStats.upcomingAppointments,
        subtitle: 'موعد في الأسبوع الحالي',
        icon: Calendar,
        variant: 'info',
        size: 'lg'
      }
    },
    {
      id: 'active-medications',
      x: 3,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'الأدوية النشطة',
        value: mockPatientStats.activeMedications,
        subtitle: 'دواء قيد الاستخدام',
        icon: Pill,
        variant: 'warning',
        size: 'lg'
      }
    },
    {
      id: 'health-score',
      x: 6,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'مؤشر الصحة',
        value: `${mockPatientStats.healthScore}%`,
        subtitle: 'ممتاز',
        trend: { value: 3.2, label: 'تحسن', isPositive: true },
        icon: Heart,
        variant: 'success',
        size: 'lg'
      }
    },
    {
      id: 'recent-results',
      x: 9,
      y: 0,
      width: 3,
      height: 2,
      component: KPICard,
      props: {
        title: 'النتائج الأخيرة',
        value: mockPatientStats.recentResults,
        subtitle: 'تقرير متاح',
        icon: FileText,
        variant: 'info',
        size: 'lg'
      }
    },
    {
      id: 'health-trend-chart',
      x: 0,
      y: 2,
      width: 8,
      height: 4,
      component: ChartWidget,
      title: 'اتجاه الصحة',
      props: {
        type: 'line',
        data: mockHealthMetrics,
        height: 300
      }
    },
    {
      id: 'quick-actions',
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
            الإجراءات السريعة
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Calendar className="w-4 h-4 ml-2" />
              حجز موعد جديد
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Pill className="w-4 h-4 ml-2" />
              طلب تجديد الدواء
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="w-4 h-4 ml-2" />
              عرض السجلات الطبية
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Activity className="w-4 h-4 ml-2" />
              تحديث البيانات الصحية
            </Button>
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
            بوابة المريض
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            إدارة صحتك ورعايتك الطبية
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
            variant={selectedView === 'health' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('health')}
          >
            الصحة
          </Button>
          <Button
            variant={selectedView === 'appointments' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('appointments')}
          >
            المواعيد
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <Card variant="elevated" className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
              مرحباً بك في نظام الرعاية الصحية
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              طبيبك المعالج: {mockPatientStats.primaryDoctor} • آخر زيارة: {mockPatientStats.lastVisit}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {mockPatientStats.healthScore}%
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              مؤشر الصحة
            </div>
          </div>
        </div>
      </Card>

      {/* Dashboard Grid */}
      <DashboardGrid
        items={gridItems}
        columns={12}
        rowHeight={80}
        className="min-h-[600px]"
      />

      {/* Additional Sections Based on View */}
      {selectedView === 'appointments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              المواعيد القادمة
            </h3>
            <div className="space-y-4">
              {mockUpcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-50">
                        {appointment.doctor}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.date} في {appointment.time}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">
                        {appointment.type} • {appointment.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant="info">
                    قادم
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              حجز موعد جديد
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="w-4 h-4 ml-2" />
                استشارة طبيب
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 ml-2" />
                فحص دوري
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Thermometer className="w-4 h-4 ml-2" />
                تحاليل مخبرية
              </Button>
              <Button variant="primary" className="w-full">
                حجز موعد
              </Button>
            </div>
          </Card>
        </div>
      )}

      {selectedView === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              الأدوية الحالية
            </h3>
            <div className="space-y-4">
              {mockMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-50">
                        {medication.name}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {medication.dosage} • {medication.frequency}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={medication.remainingDays < 7 ? 'error' : 'success'}
                    >
                      {medication.remainingDays} يوم متبقي
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              المؤشرات الصحية
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-error-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">درجة الحرارة</span>
                </div>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">36.8°C</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">الوزن</span>
                </div>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">75 كجم</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-error-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">ضغط الدم</span>
                </div>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">120/80</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                تحديث القياسات
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;

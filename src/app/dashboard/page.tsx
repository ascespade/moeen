'use client';
import { useState } from 'react';
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

// Mock data
const mockStats: DashboardStats = {
  totalPatients: 1247,
  activePatients: 1156,
  totalAppointments: 3421,
  completedAppointments: 2987,
  totalRevenue: 2450000,
  monthlyRevenue: 187500,
};

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>(mockStats);

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
          <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
            النشاط الأخير
          </h2>
          <div className='space-y-4'>
            <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700'>
              <div className='h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center'>
                📅
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  موعد جديد
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  تم حجز موعد جديد للمريض أحمد العتيبي مع د. سارة أحمد
                </p>
                <p className='text-xs text-gray-500'>منذ 5 دقائق</p>
              </div>
              <Badge className='badge-success'>نجح</Badge>
            </div>

            <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700'>
              <div className='h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center'>
                ✓
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  موعد مكتمل
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  تم إكمال جلسة العلاج الطبيعي للمريض فاطمة علي
                </p>
                <p className='text-xs text-gray-500'>منذ 15 دقيقة</p>
              </div>
              <Badge className='badge-success'>مكتمل</Badge>
            </div>

            <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700'>
              <div className='h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center'>
                💰
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  دفعة جديدة
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  تم استلام دفعة بقيمة 2,500 ريال من شركة التأمين
                </p>
                <p className='text-xs text-gray-500'>منذ ساعتين</p>
              </div>
              <Badge className='badge-success'>مدفوع</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

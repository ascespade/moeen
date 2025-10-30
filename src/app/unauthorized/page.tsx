'use client';

import React from 'react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <div className='w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6'>
            <ShieldAlert className='w-12 h-12 text-red-600 dark:text-red-400' />
          </div>
          <h1 className='text-4xl font-bold text-foreground mb-4'>
            403 - غير مصرح
          </h1>
          <h2 className='text-2xl font-semibold text-muted-foreground mb-4'>
            Unauthorized Access
          </h2>
          <p className='text-lg text-muted-foreground mb-8'>
            ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
            <br />
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className='bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8'>
          <h3 className='font-semibold text-amber-900 dark:text-amber-100 mb-2'>
            الصلاحيات المطلوبة / Required Permissions
          </h3>
          <p className='text-sm text-amber-800 dark:text-amber-200'>
            هذه الصفحة مخصصة للمستخدمين ذوي الصلاحيات الخاصة فقط. إذا كنت تعتقد
            أن هذا خطأ، يرجى الاتصال بمدير النظام.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button asChild size='lg' className='btn-default'>
            <Link href='/'>
              <Home className='w-5 h-5 mr-2' />
              الصفحة الرئيسية
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/login' prefetch={false}>
              <ArrowLeft className='w-5 h-5 mr-2' />
              تسجيل الدخول
            </Link>
          </Button>
        </div>

        <div className='mt-8 p-4 bg-surface rounded-lg'>
          <h4 className='text-sm font-semibold text-muted-foreground mb-2'>
            أنواع المستخدمين / User Roles:
          </h4>
          <div className='space-y-1 text-xs text-muted-foreground'>
            <p>
              👑 <strong>Admin:</strong> صلاحيات كاملة - Full Access
            </p>
            <p>
              👨‍⚕️ <strong>Doctor:</strong> إدارة المرضى والمواعيد
            </p>
            <p>
              👔 <strong>Staff:</strong> إدارة المواعيد والملفات
            </p>
            <p>
              📊 <strong>Supervisor:</strong> عرض التقارير والإحصائيات
            </p>
            <p>
              🏥 <strong>Patient:</strong> الوصول إلى السجلات الطبية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

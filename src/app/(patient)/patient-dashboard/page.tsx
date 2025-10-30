'use client';

import React from 'react';
import { DashboardLayout, DashboardHeader, DashboardSidebar, DashboardContent } from '@/components/dashboard/layouts/DashboardLayout';
import PatientDashboard from '@/components/dashboard/widgets/PatientDashboard';
import {
  Heart,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Pill,
  Activity,
  MessageSquare,
  CreditCard,
  User
} from 'lucide-react';

const patientNavigation = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: BarChart3,
    href: '/patient/patient-dashboard',
  },
  {
    id: 'appointments',
    label: 'المواعيد',
    icon: Calendar,
    href: '/patient/appointments',
  },
  {
    id: 'health',
    label: 'السجلات الصحية',
    icon: Heart,
    href: '/patient/health',
  },
  {
    id: 'medications',
    label: 'الأدوية',
    icon: Pill,
    href: '/patient/medications',
  },
  {
    id: 'messages',
    label: 'الرسائل',
    icon: MessageSquare,
    href: '/patient/messages',
  },
  {
    id: 'billing',
    label: 'الفواتير',
    icon: CreditCard,
    href: '/patient/billing',
  },
  {
    id: 'profile',
    label: 'الملف الشخصي',
    icon: User,
    href: '/patient/profile',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    href: '/patient/settings',
  },
];

export default function PatientDashboardPage() {
  return (
    <DashboardLayout
      header={
        <DashboardHeader
          title="أحمد محمد علي"
          subtitle="مريض - رقم الملف: 12345"
          user={{
            name: "أحمد محمد علي",
            role: "مريض",
            avatar: undefined // يمكن إضافة صورة لاحقاً
          }}
          onThemeToggle={() => console.log('Toggle theme')}
          isDarkMode={false}
          onSearch={(query) => console.log('Search:', query)}
          showNotifications={true}
          notificationCount={2}
          onNotificationsClick={() => console.log('Show notifications')}
        />
      }
      sidebar={
        <DashboardSidebar
          navigation={patientNavigation}
          activeItem="dashboard"
          collapsed={false}
        />
      }
      content={
        <DashboardContent>
          <PatientDashboard patientId="patient-123" />
        </DashboardContent>
      }
    />
  );
}

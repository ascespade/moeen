'use client';

import React from 'react';
import { DashboardLayout, DashboardHeader, DashboardSidebar, DashboardContent } from '@/components/dashboard/layouts/DashboardLayout';
import DoctorDashboard from '@/components/dashboard/widgets/DoctorDashboard';
import {
  Calendar,
  Users,
  FileText,
  Settings,
  BarChart3,
  Clock,
  Stethoscope,
  Pill,
  Heart,
  Activity
} from 'lucide-react';

const doctorNavigation = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: BarChart3,
    href: '/doctor/doctor-dashboard',
  },
  {
    id: 'schedule',
    label: 'الجدول الزمني',
    icon: Calendar,
    href: '/doctor/schedule',
  },
  {
    id: 'patients',
    label: 'المرضى',
    icon: Users,
    href: '/doctor/patients',
  },
  {
    id: 'consultations',
    label: 'الاستشارات',
    icon: Stethoscope,
    href: '/doctor/consultations',
  },
  {
    id: 'prescriptions',
    label: 'الوصفات الطبية',
    icon: Pill,
    href: '/doctor/prescriptions',
  },
  {
    id: 'reports',
    label: 'التقارير',
    icon: FileText,
    href: '/doctor/reports',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    href: '/doctor/settings',
  },
];

export default function DoctorDashboardPage() {
  return (
    <DashboardLayout
      header={{
        title: "د. أحمد محمد",
        subtitle: "طبيب أسرة - عيادة الهمم",
        user: {
          name: "د. أحمد محمد",
          role: "طبيب أسرة",
          avatar: undefined
        },
        onSearch: (query) => {
          // Search functionality - implement as needed
        },
        showNotifications: true,
        notificationCount: 3,
        onNotificationsClick: () => {
          // Show notifications - implement as needed
        }
      }}
      sidebar={{
        navigation: doctorNavigation,
        activeItem: "dashboard",
        collapsed: false
      }}
      content={{
        children: (
          <DashboardContent>
            <DoctorDashboard doctorId="doctor-123" />
          </DashboardContent>
        )
      }}
    />
  );
}

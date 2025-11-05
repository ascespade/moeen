/**
 * Navigation Configuration - إعدادات التنقل
 * 
 * Navigation menu configuration
 */

import { ROUTES } from '../constants/routes';

export interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

export const navigationConfig = {
  // Public Navigation
  public: [
    {
      label: 'Home',
      labelAr: 'الرئيسية',
      href: ROUTES.HOME,
    },
    {
      label: 'About',
      labelAr: 'من نحن',
      href: ROUTES.ABOUT,
    },
    {
      label: 'Contact',
      labelAr: 'اتصل بنا',
      href: ROUTES.CONTACT || '/contact',
    },
    {
      label: 'FAQ',
      labelAr: 'الأسئلة الشائعة',
      href: ROUTES.FAQ || '/faq',
    },
  ] as NavItem[],

  // Authenticated Navigation
  authenticated: [
    {
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      href: ROUTES.DASHBOARD,
      requiresAuth: true,
    },
    {
      label: 'Patients',
      labelAr: 'المرضى',
      href: ROUTES.HEALTH.PATIENTS,
      requiresAuth: true,
      roles: ['admin', 'doctor', 'therapist', 'staff'],
    },
    {
      label: 'Appointments',
      labelAr: 'المواعيد',
      href: ROUTES.HEALTH.SESSIONS,
      requiresAuth: true,
    },
    {
      label: 'Profile',
      labelAr: 'الملف الشخصي',
      href: ROUTES.USER.PROFILE,
      requiresAuth: true,
    },
  ] as NavItem[],

  // Admin Navigation
  admin: [
    {
      label: 'Admin Dashboard',
      labelAr: 'لوحة تحكم المدير',
      href: ROUTES.ADMIN.DASHBOARD,
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
    },
    {
      label: 'Users',
      labelAr: 'المستخدمون',
      href: ROUTES.ADMIN.USERS,
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
    },
    {
      label: 'CRM',
      labelAr: 'إدارة العملاء',
      href: ROUTES.ADMIN.CRM,
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
    },
    {
      label: 'Analytics',
      labelAr: 'التحليلات',
      href: ROUTES.ADMIN.ANALYTICS,
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
    },
    {
      label: 'Settings',
      labelAr: 'الإعدادات',
      href: ROUTES.ADMIN.SETTINGS,
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
    },
  ] as NavItem[],
} as const;

/**
 * 🗺️ Centralized Navigation Configuration
 * إعدادات الملاحة المركزية
 * 
 * Single source of truth - all navigation items defined here
 * Translations read from database
 */

import { NavigationSection } from './central-navigation';

/**
 * Navigation configuration
 * This is the master list - all sidebar items come from here
 */
export const NAVIGATION_CONFIG: NavigationSection[] = [
  {
    id: 'dashboard',
    title: 'dashboard.section', // Translation key
    items: [
      {
        id: 'main-dashboard',
        label: 'dashboard.main',
        icon: 'LayoutDashboard',
        href: '/admin/dashboard',
      },
      {
        id: 'analytics',
        label: 'dashboard.analytics',
        icon: 'BarChart3',
        href: '/admin/analytics',
      },
    ],
  },
  {
    id: 'management',
    title: 'management.section',
    items: [
      {
        id: 'patients',
        label: 'patients.title',
        icon: 'Users',
        href: '/admin/patients',
      },
      {
        id: 'users',
        label: 'users.title',
        icon: 'UserCheck',
        href: '/admin/users',
      },
      {
        id: 'roles',
        label: 'roles.title',
        icon: 'Shield',
        href: '/admin/roles',
      },
      {
        id: 'audit-logs',
        label: 'audit_logs.title',
        icon: 'FileText',
        href: '/admin/audit-logs',
      },
    ],
  },
  {
    id: 'crm',
    title: 'crm.section',
    items: [
      {
        id: 'crm-dashboard',
        label: 'crm.dashboard',
        icon: 'TrendingUp',
        href: '/admin/crm/dashboard',
      },
    ],
  },
  {
    id: 'ai',
    title: 'ai.section',
    items: [
      {
        id: 'chatbot',
        label: 'chatbot.title',
        icon: 'Bot',
        href: '/admin/chatbot',
      },
    ],
  },
  {
    id: 'communications',
    title: 'communications.section',
    items: [
      {
        id: 'messages',
        label: 'messages.title',
        icon: 'MessageSquare',
        href: '/admin/messages',
      },
      {
        id: 'notifications',
        label: 'notifications.title',
        icon: 'Bell',
        href: '/admin/notifications',
      },
    ],
  },
  {
    id: 'financial',
    title: 'financial.section',
    items: [
      {
        id: 'payments',
        label: 'payments.title',
        icon: 'CreditCard',
        href: '/admin/payments/invoices',
      },
    ],
  },
  {
    id: 'system',
    title: 'system.section',
    items: [
      {
        id: 'settings',
        label: 'settings.title',
        icon: 'Settings',
        href: '/admin/settings',
      },
    ],
  },
];
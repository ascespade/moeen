/**
 * Admin Page Configuration
 * إعدادات موحدة لجميع صفحات Admin
 */

export interface AdminPageConfig {
  path: string;
  title: string;
  requiredPermissions: string[];
  requiredRoles?: string[];
  apiEndpoint?: string;
}

export const ADMIN_PAGES: Record<string, AdminPageConfig> = {
  dashboard: {
    path: '/admin/dashboard',
    title: 'لوحة تحكم الإدارة',
    requiredPermissions: ['dashboard:view'],
    apiEndpoint: '/api/dashboard/statistics',
  },
  analytics: {
    path: '/analytics',
    title: 'التحليلات والإحصائيات',
    requiredPermissions: ['analytics:view'],
    apiEndpoint: '/api/analytics/data',
  },
  patients: {
    path: '/admin/patients',
    title: 'إدارة المرضى',
    requiredPermissions: ['patients:view'],
    apiEndpoint: '/api/admin/patients',
  },
  users: {
    path: '/admin/users',
    title: 'إدارة المستخدمين',
    requiredPermissions: ['users:view'],
    apiEndpoint: '/api/admin/users',
  },
  roles: {
    path: '/admin/roles',
    title: 'إدارة الأدوار والصلاحيات',
    requiredPermissions: ['roles:view'],
    apiEndpoint: '/api/admin/roles',
  },
  auditLogs: {
    path: '/admin/audit-logs',
    title: 'سجلات التدقيق',
    requiredPermissions: ['audit_logs:view'],
    apiEndpoint: '/api/admin/audit-logs',
  },
  crmDashboard: {
    path: '/crm/dashboard',
    title: 'لوحة تحكم CRM',
    requiredPermissions: ['crm:view'],
    apiEndpoint: '/api/admin/crm-data',
  },
  chatbot: {
    path: '/chatbot',
    title: 'إدارة المساعد الذكي',
    requiredPermissions: ['chatbot:view'],
    apiEndpoint: '/api/chatbot/stats',
  },
  messages: {
    path: '/admin/messages',
    title: 'مركز الرسائل',
    requiredPermissions: ['messages:view'],
    apiEndpoint: '/api/admin/messages',
  },
  notifications: {
    path: '/admin/notifications',
    title: 'إدارة الإشعارات',
    requiredPermissions: ['notifications:view'],
    apiEndpoint: '/api/admin/notifications',
  },
  payments: {
    path: '/admin/payments/invoices',
    title: 'إدارة المدفوعات',
    requiredPermissions: ['payments:view'],
    apiEndpoint: '/api/admin/payments',
  },
  dynamicData: {
    path: '/test-crud',
    title: 'إدارة البيانات الديناميكية',
    requiredPermissions: ['data:view'],
    apiEndpoint: '/api/dynamic-data',
  },
  review: {
    path: '/admin/review',
    title: 'إدارة المراجعات',
    requiredPermissions: ['review:view'],
    apiEndpoint: '/api/admin/review',
  },
  settings: {
    path: '/admin/settings',
    title: 'إعدادات النظام',
    requiredPermissions: ['settings:view'],
    apiEndpoint: '/api/admin/settings',
  },
};

export function getPageConfig(path: string): AdminPageConfig | null {
  return (
    Object.values(ADMIN_PAGES).find(config => path.startsWith(config.path)) ||
    null
  );
}

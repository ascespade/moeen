'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Bell,
    Bot,
    Building2,
    Calendar,
    CreditCard,
    FileText,
    LayoutDashboard,
    MessageSquare,
  Package,
    Settings,
    Shield,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  permissions?: string[];
  badge?: string | number;
}

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { hasPermission } = usePermissions({ userRole: 'admin' });

  const sidebarSections: SidebarSection[] = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      items: [
        {
          id: 'main-dashboard',
          label: 'الرئيسية',
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: '/admin/dashboard',
          permissions: ['dashboard:view']
        },
        {
          id: 'analytics',
          label: 'التحليلات',
          icon: <BarChart3 className="h-4 w-4" />,
          href: '/analytics',
          permissions: ['analytics:view']
        },
      ],
        },
        {
      id: 'management',
      title: 'الإدارة',
      items: [
        {
          id: 'patients',
          label: 'المرضى',
          icon: <Users className="h-4 w-4" />,
          href: '/admin/patients',
          permissions: ['patients:view']
        },
        {
          id: 'users',
          label: 'المستخدمون',
          icon: <UserCheck className="h-4 w-4" />,
          href: '/admin/users',
          permissions: ['users:view']
        },
        {
          id: 'roles',
          label: 'الأدوار والصلاحيات',
          icon: <Shield className="h-4 w-4" />,
          href: '/admin/roles',
          permissions: ['roles:view']
        },
        {
          id: 'audit-logs',
          label: 'سجلات التدقيق',
          icon: <FileText className="h-4 w-4" />,
          href: '/admin/audit-logs',
          permissions: ['audit_logs:view']
        },
      ],
    },
    {
      id: 'crm',
      title: 'إدارة العلاقات',
      items: [
        {
          id: 'crm-dashboard',
          label: 'لوحة CRM',
          icon: <TrendingUp className="h-4 w-4" />,
          href: '/crm/dashboard',
          permissions: ['crm:view']
        },
      ],
    },
    {
      id: 'ai',
      title: 'الذكاء الاصطناعي',
      items: [
        {
          id: 'chatbot',
          label: 'المساعد الذكي',
          icon: <Bot className="h-4 w-4" />,
          href: '/admin/chatbot',
          permissions: ['chatbot:view']
            },
      ],
        },
        {
      id: 'communications',
      title: 'التواصل',
      items: [
        {
          id: 'messages',
          label: 'الرسائل',
          icon: <MessageSquare className="h-4 w-4" />,
          href: '/admin/messages',
          permissions: ['messages:view']
        },
        {
          id: 'notifications',
          label: 'الإشعارات',
          icon: <Bell className="h-4 w-4" />,
          href: '/admin/notifications',
          permissions: ['notifications:view']
        },
      ],
    },
    {
      id: 'financial',
      title: 'المالية',
      items: [
        {
          id: 'payments',
          label: 'المدفوعات',
          icon: <CreditCard className="h-4 w-4" />,
              href: '/admin/payments/invoices',
          permissions: ['payments:view']
        },
      ],
    },
    {
      id: 'data',
      title: 'البيانات',
      items: [
        {
          id: 'dynamic-data',
          label: 'البيانات الديناميكية',
          icon: <Package className="h-4 w-4" />,
          href: '/test-crud',
          permissions: ['data:view']
        },
      ],
    },
    {
      id: 'workflow',
      title: 'سير العمل',
      items: [
        {
          id: 'review',
          label: 'المراجعة',
          icon: <FileText className="h-4 w-4" />,
          href: '/admin/review',
          permissions: ['review:view']
        },
      ],
    },
    {
      id: 'system',
      title: 'النظام',
      items: [
        {
          id: 'users-management',
          label: 'إدارة المستخدمين',
          icon: <Users className="h-4 w-4" />,
          href: '/admin/users',
          permissions: ['users:manage']
        },
        {
          id: 'settings',
          label: 'الإعدادات',
          icon: <Settings className="h-4 w-4" />,
          href: '/admin/settings',
          permissions: ['settings:view']
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const filteredSections = sidebarSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }
      return item.permissions.some(permission => hasPermission(permission));
    })
  })).filter(section => section.items.length > 0);

    return (
    <div className="flex h-full w-64 flex-col border-r border-[var(--brand-border)] bg-[var(--panel)]">
      <div className="flex h-16 items-center justify-between border-b border-[var(--brand-border)] px-6">
          <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10">
            <Building2 className="h-5 w-5 text-[var(--brand-primary)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">مركز الهمم</h2>
            <p className="text-xs text-[var(--text-secondary)]">لوحة الإدارة</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
    return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--brand-surface)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <span className={cn(
                      'flex-shrink-0',
                      active ? 'text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                    )}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        'flex h-5 min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-medium',
                        active
                          ? 'bg-[var(--brand-primary)] text-white'
                          : 'bg-[var(--brand-surface)] text-[var(--text-secondary)]'
                      )}>
                        {item.badge}
          </span>
                    )}
                  </Link>
    );
              })}
            </div>
          </div>
        ))}
      </nav>
        
      <div className="border-t border-[var(--brand-border)] p-4">
        <div className="rounded-lg bg-[var(--brand-surface)] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
              <Settings className="h-4 w-4 text-[var(--brand-primary)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[var(--text-primary)]">الإعدادات السريعة</p>
              <p className="text-xs text-[var(--text-secondary)]">إدارة النظام</p>
            </div>
          </div>
        </div>
          </div>
        </div>
  );
}

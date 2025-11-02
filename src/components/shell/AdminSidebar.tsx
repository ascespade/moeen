'use client';

import React, { useEffect, useState } from 'react';
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
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAVIGATION_CONFIG } from '@/lib/navigation/navigation-config';
import { useT } from '@/components/providers/I18nProvider';

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

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCheck,
  Shield,
  FileText,
  TrendingUp,
  Bot,
  MessageSquare,
  Bell,
  CreditCard,
  Package,
  Settings,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useT();
  const [navigationSections, setNavigationSections] = useState<NavigationSection[]>([]);

  // ✅ Load navigation from centralized config with translations
  useEffect(() => {
    const loadNavigation = () => {
      // Transform config with translations
      const sections = NAVIGATION_CONFIG.map(section => ({
        ...section,
        title: t(section.title) || section.title,
        items: section.items.map(item => {
          const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
          return {
            ...item,
            label: t(item.label) || item.label,
            icon: IconComponent ? React.createElement(IconComponent, { className: "h-4 w-4" }) : null,
          };
        }),
      }));
      setNavigationSections(sections);
    };

    loadNavigation();
  }, [t]);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // ✅ Show all navigation items - no permission checks
  const filteredSections = React.useMemo(() => {
    return navigationSections;
  }, [navigationSections]);

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
                    <span className="flex-1">{item.label || item.id}</span>
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

/**
 * 🗺️ Centralized Navigation System
 * نظام الملاحة المركزي
 * 
 * Single source of truth for all navigation items
 * Reads from database - fully dynamic
 */

import { createClient } from '@/lib/supabase/server';

export interface NavigationItem {
  id: string;
  label: string; // Translation key or direct text
  icon?: string;
  href: string;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  title: string; // Translation key or direct text
  items: NavigationItem[];
}

/**
 * Get navigation items from database
 * Reads from navigation_menu table (if exists) or uses fallback
 */
export async function getNavigationItems(): Promise<NavigationSection[]> {
  try {
    const supabase = await createClient();
    
    // Try to fetch from database
    const { data: dbNav, error } = await supabase
      .from('navigation_menu')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && dbNav && dbNav.length > 0) {
      // Transform DB data to NavigationSection format
      return transformDbNavigation(dbNav);
    }
  } catch (error) {
    console.warn('[Navigation] Could not fetch from database, using default');
  }

  // Fallback: Default navigation structure
  return getDefaultNavigation();
}

/**
 * Transform database navigation data to NavigationSection format
 */
function transformDbNavigation(dbData: any[]): NavigationSection[] {
  // Group by section
  const sectionsMap = new Map<string, NavigationSection>();

  dbData.forEach((item) => {
    const sectionId = item.section_id || 'main';
    const sectionTitle = item.section_title || 'Main';

    if (!sectionsMap.has(sectionId)) {
      sectionsMap.set(sectionId, {
        id: sectionId,
        title: sectionTitle,
        items: [],
      });
    }

    sectionsMap.get(sectionId)!.items.push({
      id: item.id,
      label: item.label,
      icon: item.icon,
      href: item.href,
      badge: item.badge,
    });
  });

  return Array.from(sectionsMap.values());
}

/**
 * Default navigation structure (fallback)
 */
function getDefaultNavigation(): NavigationSection[] {
  return [
    {
      id: 'dashboard',
      title: 'dashboard',
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
      title: 'management.title',
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
      title: 'crm.title',
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
      title: 'ai.title',
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
      title: 'communications.title',
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
      title: 'financial.title',
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
      title: 'system.title',
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
}
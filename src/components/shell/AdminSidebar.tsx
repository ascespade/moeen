'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/components/providers/I18nProvider';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  MessageSquare,
  Bot,
  Workflow,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Database,
  Zap,
  Eye,
  UserCog,
  Activity,
  TrendingUp,
  PieChart,
  Building2,
  Phone,
  ClipboardList,
  BookOpen,
  Headphones,
  Globe,
  Lock,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Home,
  Heart,
  Brain,
  Target,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  Key
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  permissions?: string[];
  children?: SidebarItem[];
  badge?: string | number;
  isNew?: boolean;
  isComingSoon?: boolean;
}

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
  permissions?: string[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useT();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dashboard', 'healthcare', 'crm', 'ai']));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock user role - in real app, get from auth context
  const userRole = 'admin';
  const { hasPermission, hasAnyPermission } = usePermissions({ userRole });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const sidebarSections: SidebarSection[] = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      items: [
        {
          id: 'main-dashboard',
          label: 'الرئيسية',
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: '/dashboard',
          permissions: ['dashboard:view']
        },
        {
          id: 'analytics',
          label: 'التحليلات',
          icon: <BarChart3 className="h-4 w-4" />,
          href: '/analytics',
          permissions: ['analytics:view']
        },
        {
          id: 'reports',
          label: 'التقارير',
          icon: <FileText className="h-4 w-4" />,
          href: '/reports',
          permissions: ['reports:view']
        },
        {
          id: 'performance',
          label: 'الأداء',
          icon: <Activity className="h-4 w-4" />,
          href: '/performance',
          permissions: ['performance:view']
        }
      ]
    },
    {
      id: 'healthcare',
      title: 'الرعاية الصحية',
      items: [
        {
          id: 'patients',
          label: 'المرضى',
          icon: <Users className="h-4 w-4" />,
          href: '/patients',
          permissions: ['patients:view'],
          badge: 1247
        },
        {
          id: 'doctors',
          label: 'الأطباء',
          icon: <Stethoscope className="h-4 w-4" />,
          href: '/doctors',
          permissions: ['doctors:view'],
          badge: 45
        },
        {
          id: 'appointments',
          label: 'المواعيد',
          icon: <Calendar className="h-4 w-4" />,
          href: '/appointments',
          permissions: ['appointments:view'],
          badge: 89
        },
        {
          id: 'sessions',
          label: 'الجلسات',
          icon: <BookOpen className="h-4 w-4" />,
          href: '/sessions',
          permissions: ['sessions:view'],
          children: [
            {
              id: 'session-notes',
              label: 'ملاحظات الجلسات',
              icon: <ClipboardList className="h-3 w-3" />,
              href: '/sessions/notes',
              permissions: ['sessions:notes']
            }
          ]
        },
        {
          id: 'medical-records',
          label: 'السجلات الطبية',
          icon: <FileText className="h-4 w-4" />,
          href: '/medical-records',
          permissions: ['patients:medical_records']
        }
      ]
    },
    {
      id: 'crm',
      title: 'إدارة العملاء',
      items: [
        {
          id: 'crm-dashboard',
          label: 'لوحة CRM',
          icon: <Building2 className="h-4 w-4" />,
          href: '/crm/dashboard',
          permissions: ['crm:view']
        },
        {
          id: 'leads',
          label: 'العملاء المحتملين',
          icon: <Target className="h-4 w-4" />,
          href: '/crm/leads',
          permissions: ['crm:leads'],
          badge: 23
        },
        {
          id: 'contacts',
          label: 'جهات الاتصال',
          icon: <Phone className="h-4 w-4" />,
          href: '/crm/contacts',
          permissions: ['crm:contacts'],
          badge: 156
        },
        {
          id: 'deals',
          label: 'الصفقات',
          icon: <TrendingUp className="h-4 w-4" />,
          href: '/crm/deals',
          permissions: ['crm:deals'],
          children: [
            {
              id: 'deals-kanban',
              label: 'لوحة الصفقات',
              icon: <PieChart className="h-3 w-3" />,
              href: '/crm/deals/kanban',
              permissions: ['crm:deals']
            }
          ]
        },
        {
          id: 'activities',
          label: 'الأنشطة',
          icon: <Activity className="h-4 w-4" />,
          href: '/crm/activities',
          permissions: ['crm:activities']
        }
      ]
    },
    {
      id: 'ai',
      title: 'الذكاء الاصطناعي',
      items: [
        {
          id: 'chatbot',
          label: 'المساعد الذكي',
          icon: <Bot className="h-4 w-4" />,
          href: '/chatbot',
          permissions: ['chatbot:view'],
          children: [
            {
              id: 'chatbot-flows',
              label: 'التدفقات',
              icon: <Workflow className="h-3 w-3" />,
              href: '/chatbot/flows',
              permissions: ['chatbot:flows']
            },
            {
              id: 'chatbot-templates',
              label: 'القوالب',
              icon: <FileText className="h-3 w-3" />,
              href: '/chatbot/templates',
              permissions: ['chatbot:templates']
            },
            {
              id: 'chatbot-analytics',
              label: 'تحليلات البوت',
              icon: <BarChart3 className="h-3 w-3" />,
              href: '/chatbot/analytics',
              permissions: ['chatbot:analytics']
            },
            {
              id: 'chatbot-integrations',
              label: 'التكاملات',
              icon: <Zap className="h-3 w-3" />,
              href: '/chatbot/integrations',
              permissions: ['chatbot:integrations']
            }
          ]
        },
        {
          id: 'conversations',
          label: 'المحادثات',
          icon: <MessageSquare className="h-4 w-4" />,
          href: '/conversations',
          permissions: ['conversations:view'],
          badge: 12
        },
        {
          id: 'flow-studio',
          label: 'استوديو التدفق',
          icon: <Workflow className="h-4 w-4" />,
          href: '/flow',
          permissions: ['flow:view'],
          isNew: true
        },
        {
          id: 'ai-agent',
          label: 'الوكيل الذكي',
          icon: <Brain className="h-4 w-4" />,
          href: '/ai-agent',
          permissions: ['chatbot:view'],
          isComingSoon: true
        }
      ]
    },
    {
      id: 'communication',
      title: 'التواصل',
      items: [
        {
          id: 'messages',
          label: 'الرسائل',
          icon: <Mail className="h-4 w-4" />,
          href: '/messages',
          permissions: ['messages:view'],
          badge: 5
        },
        {
          id: 'notifications',
          label: 'الإشعارات',
          icon: <Bell className="h-4 w-4" />,
          href: '/notifications',
          permissions: ['notifications:view'],
          badge: 3
        },
        {
          id: 'channels',
          label: 'قنوات التواصل',
          icon: <Globe className="h-4 w-4" />,
          href: '/admin/channels',
          permissions: ['integrations:view']
        }
      ]
    },
    {
      id: 'financial',
      title: 'المالية',
      items: [
        {
          id: 'payments',
          label: 'المدفوعات',
          icon: <CreditCard className="h-4 w-4" />,
          href: '/payments',
          permissions: ['payments:view'],
          children: [
            {
              id: 'invoices',
              label: 'الفواتير',
              icon: <FileText className="h-3 w-3" />,
              href: '/admin/payments/invoices',
              permissions: ['payments:invoices']
            }
          ]
        },
        {
          id: 'billing',
          label: 'الفواتير',
          icon: <FileText className="h-4 w-4" />,
          href: '/billing',
          permissions: ['payments:view']
        }
      ]
    },
    {
      id: 'content',
      title: 'المحتوى',
      items: [
        {
          id: 'dynamic-data',
          label: 'البيانات الديناميكية',
          icon: <Database className="h-4 w-4" />,
          href: '/dynamic-data',
          permissions: ['dynamic_data:view']
        },
        {
          id: 'content-management',
          label: 'إدارة المحتوى',
          icon: <Edit className="h-4 w-4" />,
          href: '/content',
          permissions: ['dynamic_data:manage']
        }
      ]
    },
    {
      id: 'quality',
      title: 'الجودة',
      items: [
        {
          id: 'review',
          label: 'المراجعة',
          icon: <Eye className="h-4 w-4" />,
          href: '/review',
          permissions: ['review:view']
        },
        {
          id: 'audit',
          label: 'التدقيق',
          icon: <Shield className="h-4 w-4" />,
          href: '/audit',
          permissions: ['security:audit_logs']
        }
      ]
    },
    {
      id: 'system',
      title: 'النظام',
      items: [
        {
          id: 'users-management',
          label: 'إدارة المستخدمين',
          icon: <UserCog className="h-4 w-4" />,
          href: '/admin/users',
          permissions: ['users:view'],
          children: [
            {
              id: 'roles',
              label: 'الأدوار',
              icon: <Shield className="h-3 w-3" />,
              href: '/admin/roles',
              permissions: ['roles:view']
            }
          ]
        },
        {
          id: 'settings',
          label: 'الإعدادات',
          icon: <Settings className="h-4 w-4" />,
          href: '/settings',
          permissions: ['settings:view'],
          children: [
            {
              id: 'api-keys',
              label: 'مفاتيح API',
              icon: <Key className="h-3 w-3" />,
              href: '/settings/api-keys',
              permissions: ['settings:api_keys']
            }
          ]
        },
        {
          id: 'security',
          label: 'الأمان',
          icon: <Lock className="h-4 w-4" />,
          href: '/security',
          permissions: ['security:view'],
          children: [
            {
              id: 'audit-logs',
              label: 'سجلات التدقيق',
              icon: <FileText className="h-3 w-3" />,
              href: '/admin/audit-logs',
              permissions: ['security:audit_logs']
            },
            {
              id: 'system-logs',
              label: 'سجلات النظام',
              icon: <Activity className="h-3 w-3" />,
              href: '/admin/logs',
              permissions: ['security:logs']
            }
          ]
        },
        {
          id: 'integrations',
          label: 'التكاملات',
          icon: <Zap className="h-4 w-4" />,
          href: '/integrations',
          permissions: ['integrations:view']
        }
      ]
    }
  ];

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const hasPermission = item.permissions ? hasAnyPermission(item.permissions) : true;
    
    if (!hasPermission) return null;

    const isActive = pathname === item.href || (item.href && pathname.startsWith(item.href + '/'));
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer group',
            level > 0 && 'ml-4',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else if (item.href) {
              // Navigate to the page
            }
          }}
        >
          <div className="flex items-center gap-3">
            <span className={cn(
              'transition-colors',
              isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
            )}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
            {item.isNew && (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                جديد
              </span>
            )}
            {item.isComingSoon && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                قريباً
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <span className="text-muted-foreground">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </span>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSidebarSection = (section: SidebarSection) => {
    const hasPermission = section.permissions ? hasAnyPermission(section.permissions) : true;
    const hasVisibleItems = section.items.some(item => 
      item.permissions ? hasAnyPermission(item.permissions) : true
    );
    
    if (!hasPermission || !hasVisibleItems) return null;

    const isExpanded = expandedSections.has(section.id);

    return (
      <div key={section.id} className="mb-6">
        <div
          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={() => toggleSection(section.id)}
        >
          <span>{section.title}</span>
          <span className="text-muted-foreground">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        </div>
        
        {isExpanded && (
          <div className="space-y-1">
            {section.items.map(item => renderSidebarItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        id="admin-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 bottom-0 z-50 w-80 bg-background border-e border-border transition-all duration-300 lg:hidden"
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold">مركز الهمم</div>
              <div className="text-xs text-muted-foreground">نظام إدارة الرعاية الصحية</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {sidebarSections.map(renderSidebarSection)}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 border-e border-border min-h-dvh bg-background">
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold">مركز الهمم</div>
              <div className="text-xs text-muted-foreground">نظام إدارة الرعاية الصحية</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {sidebarSections.map(renderSidebarSection)}
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">المدير العام</div>
              <div className="text-xs text-muted-foreground truncate">admin@hemam.com</div>
            </div>
            <button className="p-1 hover:bg-accent rounded-md transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
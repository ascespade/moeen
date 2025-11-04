/**
 * Enhanced Sidebar - Dynamic based on permissions
 * Sidebar محسّن - ديناميكي حسب الصلاحيات
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import { getNavMenuItems } from '@/lib/auth/enhanced-auth';
import type { RouteConfig } from '@/lib/auth/RouteManager';

export default function EnhancedSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useCustomAuth();
  const [menuItems, setMenuItems] = useState<RouteConfig[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch permissions and get menu items
      const fetchPermissions = async () => {
        try {
          // Try to get permissions from verify endpoint
          const token = localStorage.getItem('auth_token');
          if (token) {
            try {
              const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
              });

              if (response.ok) {
                const data = await response.json();
                const navItems = getNavMenuItems(
                  user,
                  data.permissions || null
                );
                setMenuItems(navItems);
                return;
              }
            } catch {
              // Fall through to basic menu
            }
          }

          // Fallback: create basic menu based on role (fast, no API call)
          const basicRoutes: RouteConfig[] = [
            {
              path: '/dashboard',
              label: 'لوحة التحكم',
              icon: 'dashboard',
            },
          ];

          if (user.role === 'admin' || user.role === 'manager') {
            basicRoutes.push({
              path: '/admin',
              label: 'الإدارة',
              icon: 'admin',
            });
          }

          basicRoutes.push({
            path: '/profile',
            label: 'الملف الشخصي',
            icon: 'profile',
          });

          setMenuItems(basicRoutes);
        } catch {
          // Set basic menu on error (silent fail)
          setMenuItems([
            { path: '/dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
            { path: '/profile', label: 'الملف الشخصي', icon: 'profile' },
          ]);
        }
      };

      fetchPermissions();
    } else {
      setMenuItems([]);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <aside
      className={`bg-[var(--background-secondary)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className='p-4 border-b border-[var(--border)] flex items-center justify-between'>
        {!collapsed && (
          <h2 className='text-lg font-bold text-[var(--text-primary)]'>
            لوحة التحكم
          </h2>
        )}
        <buttononClick={() = aria-label="Button"> setCollapsed(!collapsed)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setCollapsed(!collapsed);
            }
          }}
          className='p-2 rounded hover:bg-[var(--background-hover)]'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className='p-4 border-b border-[var(--border)]'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-semibold'>
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-[var(--text-primary)] truncate'>
                {user.name || user.email}
              </p>
              <p className='text-xs text-[var(--text-secondary)]'>
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto p-4'>
        <ul className='space-y-2'>
          {menuItems.map(item => {
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + '/');
            const Icon = item.icon ? getIconComponent(item.icon) : null;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-[var(--text-primary)] hover:bg-[var(--background-hover)]'
                  }`}
                >
                  {Icon && <Icon className='w-5 h-5 flex-shrink-0' />}
                  {!collapsed && <span className='flex-1'>{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className='px-2 py-0.5 text-xs bg-[var(--brand-secondary)] rounded'>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Children */}
                {item.children && !collapsed && isActive && (
                  <ul className='mt-2 ml-4 space-y-1'>
                    {item.children.map(child => {
                      const childActive = pathname === child.path;
                      const ChildIcon = child.icon
                        ? getIconComponent(child.icon)
                        : null;

                      return (
                        <li key={child.path}>
                          <Link
                            href={child.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                              childActive
                                ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--background-hover)]'
                            }`}
                          >
                            {ChildIcon && <ChildIcon className='w-4 h-4' />}
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className='p-4 border-t border-[var(--border)]'>
        <buttononClick={handleLogout}
          onKeyDown={(e) = aria-label="Button"> {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogout();
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          aria-label={!collapsed ? 'تسجيل الخروج' : 'خروج'}
        >
          <span>🚪</span>
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}

// Icon helper
function getIconComponent(iconName: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    dashboard: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        />
      </svg>
    ),
    admin: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
        />
      </svg>
    ),
    users: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        />
      </svg>
    ),
    patients: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
    ),
    appointments: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
    ),
    reports: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    ),
    settings: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        />
      </svg>
    ),
    profile: ({ className }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
        />
      </svg>
    ),
  };

  return icons[iconName] || icons.dashboard;
}

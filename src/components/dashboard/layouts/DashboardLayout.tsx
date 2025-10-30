'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
    Bell,
    LayoutGrid,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    Sun,
    User,
    X
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  onSearch?: (query: string) => void;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  user,
  onThemeToggle,
  isDarkMode = false,
  onSearch,
  showNotifications = true,
  notificationCount = 0,
  onNotificationsClick,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, [onSearch, searchQuery]);

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg',
      className
    )}>
      <div className="container-xl">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className={cn(
                  'relative flex items-center',
                  isSearchFocused && 'ring-2 ring-primary-500 ring-offset-2'
                )}>
                  <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="البحث في الداشبورد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {onThemeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
                icon={isDarkMode ? Sun : Moon}
                className="w-9 h-9 p-0"
                title={isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}
              />
            )}

            {/* Notifications */}
            {showNotifications && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotificationsClick}
                icon={Bell}
                className="w-9 h-9 p-0 relative"
                title="الإشعارات"
              >
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Button>
            )}

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              icon={Settings}
              className="w-9 h-9 p-0"
              title="الإعدادات"
            />

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {user.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  className="w-8 h-8 p-0 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                  title="تسجيل الخروج"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  navigation: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    badge?: string | number;
    children?: {
      id: string;
      label: string;
      href: string;
      badge?: string | number;
    }[];
  }[];
  activeItem?: string;
  collapsed?: boolean;
  onCollapse?: () => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onToggle,
  navigation,
  activeItem,
  collapsed = false,
  onCollapse,
  className,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        collapsed && 'lg:w-16',
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.href) {
                      // Handle navigation
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    activeItem === item.id
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.children && !collapsed && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          // Handle navigation
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
                          activeItem === child.id
                            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                            : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
                        )}
                      >
                        <span>{child.label}</span>
                        {child.badge && (
                          <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  إصدار 1.0.0
                </div>
              )}
              {onCollapse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCollapse}
                  className="w-8 h-8 p-0"
                  title={collapsed ? 'توسيع' : 'تصغير'}
                >
                  {collapsed ? '→' : '←'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export interface DashboardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  className,
  padding = 'lg',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <main className={cn(
      'flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950',
      paddingClasses[padding],
      className
    )}>
      <div className="max-w-full">
        {children}
      </div>
    </main>
  );
};

export interface DashboardFooterProps {
  className?: string;
  showCopyright?: boolean;
  additionalContent?: React.ReactNode;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({
  className,
  showCopyright = true,
  additionalContent,
}) => {
  return (
    <footer className={cn(
      'border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 py-4',
      className
    )}>
      <div className="flex items-center justify-between">
        {showCopyright && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            © 2024 مركز الهمم. جميع الحقوق محفوظة.
          </div>
        )}

        {additionalContent && (
          <div className="flex items-center gap-4">
            {additionalContent}
          </div>
        )}

        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </div>
      </div>
    </footer>
  );
};

// Main Dashboard Layout Component
export interface DashboardLayoutProps {
  header: Omit<DashboardHeaderProps, 'onThemeToggle' | 'isDarkMode'>;
  sidebar: Omit<DashboardSidebarProps, 'isOpen' | 'onToggle'>;
  content: DashboardContentProps;
  footer?: DashboardFooterProps;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  sidebar,
  content,
  footer,
  onThemeToggle,
  isDarkMode = false,
  className,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn('min-h-screen bg-neutral-50 dark:bg-neutral-950', className)}>
      {/* Header */}
      <DashboardHeader
        {...header}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
      />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          icon={sidebarOpen ? X : Menu}
          className="w-10 h-10 p-0"
        />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          {...sidebar}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className={cn(
          'flex-1 transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}>
          <DashboardContent {...content} />
          {footer && <DashboardFooter {...footer} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

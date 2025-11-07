'use client';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';
import { useT } from '@/components/providers/I18nProvider';
import { I18N_KEYS } from '@/constants/i18n-keys';
import { useLanguage, useTheme } from '@/design-system/hooks';
import { useSystemConfig } from '@/lib/config/system-config';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import { useEffect, useState } from 'react';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
  Calendar,
  Menu,
  X,
  Bot,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { _theme } = useTheme();
  const { language, direction } = useLanguage();
  // Use custom auth hook (preferred) or fallback to unified auth
  const customAuth = useCustomAuth();
  const unifiedAuth = useUnifiedAuth();

  // Prefer custom auth if available and authenticated
  const user = customAuth.user || unifiedAuth.user;
  const isAuthenticated =
    customAuth.isAuthenticated || unifiedAuth.isAuthenticated;
  const logout = customAuth.logout || unifiedAuth.logout;
  const router = useRouter();
  const _pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  // Initialize with null to prevent hydration mismatch, then set on client
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { config: systemConfig } = useSystemConfig();
  const { t } = useT();

  // Fetch real notifications from API with error handling to prevent loops
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setNotificationsLoading(false);
      setNotifications([]);
      return;
    }

    let retryCount = 0;
    const MAX_RETRIES = 3;
    let isMounted = true;

    const fetchNotifications = async () => {
      // Prevent too many retries
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max retries reached for notifications, stopping fetch');
        setNotificationsLoading(false);
        setNotifications([]);
        return;
      }

      try {
        setNotificationsLoading(true);
        // Fetch real notifications from database using user_id
        const response = await fetch(
          `/api/notifications/schedule?recipientId=${user.id}&limit=10`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        // If response is not ok, treat as empty and stop retrying after max retries
        if (!response.ok) {
          console.warn(
            `Notifications API returned ${response.status}, using empty array`
          );
          if (isMounted) {
            setNotifications([]);
            setNotificationsLoading(false);
          }
          retryCount++;
          // Stop retrying if we've exceeded max retries
          if (retryCount >= MAX_RETRIES) {
            console.warn(
              'Max retries reached for notifications, stopping fetch'
            );
            return;
          }
          return;
        }

        const data = await response
          .json()
          .catch(() => ({ success: false, data: [] }));

        if (data.success && Array.isArray(data.data)) {
          // Filter notifications for this user and get real data
          const userNotifications = data.data.filter((n: any) => {
            // Match by recipientId or user_id
            return (
              n.recipientId === user.id ||
              n.user_id === user.id ||
              n.recipient_id === user.id ||
              n.userId === user.id
            );
          });

          // Sort: unread first, then by date
          const sorted = userNotifications.sort((a: unknown, b: unknown) => {
            const aUnread = !a.is_read && !a.read;
            const bUnread = !b.is_read && !b.read;
            if (aUnread !== bUnread) return aUnread ? -1 : 1;
            const aDate = new Date(a.created_at || a.createdAt || 0).getTime();
            const bDate = new Date(b.created_at || b.createdAt || 0).getTime();
            return bDate - aDate;
          });

          if (isMounted) {
            setNotifications(sorted.slice(0, 10));
            retryCount = 0; // Reset retry count on success
          }
        } else {
          // If response format is unexpected, use empty array
          if (isMounted) {
            setNotifications([]);
          }
          retryCount++;
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (isMounted) {
          setNotifications([]);
          retryCount++;
        }
      } finally {
        if (isMounted) {
          setNotificationsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchNotifications();

    // Refresh notifications every 60 seconds (increased from 30 to reduce load)
    // Only retry if previous attempt was successful or retry count is low
    const interval = setInterval(() => {
      if (retryCount < MAX_RETRIES) {
        fetchNotifications();
      }
    }, 60000); // 60 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.id]);

  const unreadCount = notifications.filter(
    (n: any) => !n.is_read && !n.read
  ).length;

  // Set initial time and mounted flag on client-side only
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time - use client-side only to prevent hydration mismatch
  const formatDate = (date: Date) => {
    if (typeof window === 'undefined') {
      // Server-side: return simple format to prevent hydration mismatch
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'gregory', // Force Gregorian calendar on server
      }).format(date);
    }
    // Client-side: can use any calendar
    return new Intl.DateTimeFormat('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory', // Use Gregorian consistently
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
        setShowAIFeatures(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get enabled modules for quick access
  const _enabledModules = Object.entries(systemConfig.modules)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({ name, ...config }));

  // Get AI features status
  const aiFeaturesEnabled = Object.values(systemConfig.ai_features).some(
    feature =>
      typeof feature === 'object' && 'enabled' in feature && feature.enabled
  );

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { getBrowserSupabase } = await import('@/lib/supabaseClient');
      const supabase = getBrowserSupabase();
      await supabase.auth.signOut();
    } catch {}
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
      });
    } catch {}
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      localStorage.removeItem('moeen_user_preferences');
    } catch {}
    setShowUserDropdown(false);
    logout();
    router.push('/login');
  };

  const userName = user?.full_name || user?.name || user?.email || 'مستخدم';
  const userRole = user?.role || 'user';
  const userEmail = user?.email || '';

  // Get role display name
  const roleNames: Record<string, string> = {
    admin: 'مدير',
    supervisor: 'مشرف',
    doctor: 'طبيب',
    patient: 'مريض',
    staff: 'موظف',
    manager: 'مدير',
    nurse: 'ممرض',
  };

  return (
    <header className='sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Header Bar */}
        <div className='h-16 flex items-center justify-between gap-4'>
          {/* Left Section: Logo & Search */}
          <div className='flex items-center gap-4 flex-1 min-w-0'>
            {/* Mobile Menu Button */}
            <button
              type='button'
              className='lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors'
              aria-label={t(I18N_KEYS.COMMON.OPEN_MENU)}
              data-hs-overlay='#app-sidebar'
            >
              <Menu className='w-5 h-5' />
            </button>

            {/* Logo */}
            <Link
              href='/admin/dashboard'
              className='hidden sm:flex items-center gap-3 group'
            >
              <div className='relative'>
                <div className='grid h-10 w-10 place-items-center rounded-xl text-white bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)]/80 shadow-lg group-hover:shadow-xl transition-shadow'>
                  <span className='text-lg font-bold'>?</span>
                </div>
                {aiFeaturesEnabled && (
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900'></div>
                )}
              </div>
              <div className='hidden md:block'>
                <div className='text-base font-bold text-gray-900 dark:text-white'>
                  {t(I18N_KEYS.COMMON.SYSTEM_NAME) || 'نظام معين'}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  إدارة الأنشطة والمواعيد
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className='hidden md:flex flex-1 max-w-xl ml-4'>
              <div className='relative w-full'>
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                <input type='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} aria-label="search" aria-invalid="true"
                  className='w-full h-10 pr-10 pl-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all'
                  placeholder={
                    t(I18N_KEYS.COMMON.SEARCH_PLACEHOLDER) || 'بحث...'
                  }
                  aria-label={t(I18N_KEYS.COMMON.SEARCH)}
                />
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500'>
                  <kbd className='font-sans'>?</kbd>
                  <kbd className='font-sans'>K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Actions & User */}
          <div className='flex items-center gap-2'>
            {/* Date & Time */}
            {mounted && currentTime && (
              <div className='hidden xl:flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                  <div className='text-xs text-gray-600 dark:text-gray-400'>
                    <div className='font-medium'>{formatDate(currentTime)}</div>
                  </div>
                </div>
                <div className='h-4 w-px bg-gray-300 dark:bg-gray-600'></div>
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                  <div className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                    {formatTime(currentTime)}
                  </div>
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* AI Features Indicator */}
            {aiFeaturesEnabled && (
              <div className='relative' data-dropdown>
                <button
                  onClick={() => setShowAIFeatures(!showAIFeatures)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowAIFeatures(!showAIFeatures);
                    }
                  }}
                  className='relative h-10 w-10 rounded-lg border border-[var(--brand-border)] dark:border-gray-700 grid place-items-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors'
                  aria-label='فتح قائمة الميزات'
                  aria-haspopup='menu'
                  aria-expanded={showAIFeatures}
                >
                  <Bot className='w-5 h-5' />
                  <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center'>
                    <span className='w-1.5 h-1.5 rounded-full bg-white'></span>
                  </span>
                </button>
                {showAIFeatures && (
                  <div
                    className='absolute left-0 mt-2 min-w-[280px] bg-white dark:bg-gray-900 shadow-xl rounded-xl p-3 border border-gray-200 dark:border-gray-700 z-50'
                    role='menu'
                  >
                    <div className='mb-3 px-2'>
                      <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {t(I18N_KEYS.HEADER.AI_FEATURES) ||
                          'ميزات الذكاء الاصطناعي'}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                        إدارة المحادثات
                      </div>
                    </div>
                    <div className='grid gap-2'>
                      {systemConfig.ai_features.chatbot.enabled && (
                        <div className='rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                              <Bot className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div className='flex-1'>
                              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                {t(I18N_KEYS.HEADER.CHATBOT) || 'المساعد معين'}
                              </div>
                              <div className='text-xs text-gray-500 dark:text-gray-400'>
                                {t(I18N_KEYS.HEADER.CHATBOT_STATUS) || 'حالة المساعد'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <div className='relative' data-dropdown>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowNotifDropdown(!showNotifDropdown);
                  }
                }}
                className='relative h-10 w-10 rounded-lg border border-[var(--brand-border)] dark:border-gray-700 grid place-items-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors'
                aria-label="إشعارات"
                aria-haspopup='menu'
                aria-expanded={showNotifDropdown}
              >
                <Bell className='w-5 h-5' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center shadow-lg'>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifDropdown && (
                <div
                  className='absolute left-0 mt-2 min-w-[320px] max-w-sm bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[480px] overflow-hidden flex flex-col'
                  role='menu'
                >
                  <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                          {t(I18N_KEYS.HEADER.NOTIFICATIONS) || 'الإشعارات'}
                        </div>
                        {unreadCount > 0 && (
                          <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                            {unreadCount} إشعار{unreadCount > 1 ? 'ات' : ''}{' '}
                            غير مقروء
                          </div>
                        )}
                      </div>
                      {unreadCount > 0 && notifications.length > 0 && (
                        <button
                          onClick={async () => {
                            try {
                              // Mark all as read
                              await Promise.all(
                                notifications
                                  .filter((n: any) => !n.is_read)
                                  .map((n: any) =>
                                    fetch(`/api/notifications/${n.id}/read`, {
                                      method: 'POST',
                                      credentials: 'include',
                                    }).catch(() => {})
                                  )
                                );
                              // Refresh notifications
                              const response = await fetch(
                                `/api/notifications/schedule?recipientId=${user?.id}&limit=5`,
                                {
                                  credentials: 'include',
                                  cache: 'no-store',
                                }
                              );
                              if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.data) {
                                  setNotifications(data.data || []);
                                }
                              }
                            } catch (error) {
                              console.error(
                                'Error marking notifications as read:',
                                error
                              );
                            }
                          }}
                          className='text-xs text-[var(--brand-primary)] hover:underline'
                        >
                          تحديد الكل كمقروء
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='flex-1 overflow-y-auto'>
                    {notificationsLoading ? (
                      <div className='p-8 text-center'>
                        <div className='w-6 h-6 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3'></div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          جاري التحميل...
                        </div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className='p-8 text-center'>
                        <Bell className='w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3' />
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          {t(I18N_KEYS.HEADER.NO_NOTIFICATIONS) ||
                            'لا توجد إشعارات'}
                        </div>
                      </div>
                    ) : (
                      <div className='p-2'>
                        {notifications
                          .slice(0, 5)
                          .map((notification: any) => {
                            const isUnread =
                              !notification.is_read && !notification.read;
                            const createdDate =
                              notification.created_at || notification.createdAt;
                            const timeAgo = createdDate
                              ? new Date(createdDate).toLocaleString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '';

                            return (
                              <div
                                key={notification.id}
                                tabIndex={0} onClick={async () => {
                                  if (isUnread) {
                                    try {
                                      // Try POST first
                                      let markResponse = await fetch(
                                        `/api/notifications/${notification.id}/read`,
                                        {
                                          method: 'POST',
                                          credentials: 'include',
                                        }
                                      );

                                      // If POST fails, try PATCH
                                      if (!markResponse.ok) {
                                        markResponse = await fetch(
                                          `/api/notifications/${notification.id}/read`,
                                          {
                                            method: 'PATCH',
                                            credentials: 'include',
                                          }
                                        );
                                      }

                                      // Update local state if successful
                                      if (markResponse.ok) {
                                        setNotifications(
                                          notifications.map((n: any) =>
                                            n.id === notification.id
                                              ? {
                                                  ...n,
                                                  is_read: true,
                                                  status: 'read',
                                                }
                                              : n
                                          )
                                        );
                                      }
                                    } catch (error) {
                                      console.error(
                                        'Error marking notification as read:',
                                        error
                                      );
                                    }
                                  }
                                }}
                                className={`rounded-lg border p-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                                  isUnread
                                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className='flex items-start gap-3'>
                                  {isUnread && (
                                    <div className='w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0'></div>
                                  )}
                                  <div className='flex-1 min-w-0'>
                                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                      {notification.title ||
                                        notification.message ||
                                        'رسالة'}
                                    </div>
                                    {notification.message &&
                                      notification.message !==
                                        notification.title && (
                                        <div className='text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2'>
                                          {notification.message}
                                        </div>
                                      )}
                                    {timeAgo && (
                                      <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                                        {timeAgo}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className='p-3 border-t border-gray-200 dark:border-gray-700'>
                      <Link
                        href='/admin/notifications'
                        onClick={() => setShowNotifDropdown(false)}
                        className='block w-full text-center text-sm text-[var(--brand-primary)] hover:underline py-2'
                      >
                        عرض جميع الإشعارات
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className='relative' data-dropdown>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowUserDropdown(!showUserDropdown);
                  }
                }}
                className='flex items-center gap-2 h-10 px-2 rounded-lg border border-[var(--brand-border)] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors'
                aria-label='فتح القائمة'
                aria-haspopup='menu'
                aria-expanded={showUserDropdown}
              >
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)]/80 flex items-center justify-center text-white font-semibold text-sm shadow-sm'>
                  {userName.charAt(0)}
                </div>
                <div className='hidden lg:block text-right'>
                  <div className='text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[120px]'>
                    {userName}
                  </div>
                  <div className='text-[10px] text-gray-500 dark:text-gray-400'>
                    {roleNames[userRole] || userRole}
                  </div>
                </div>
                <ChevronDown className='hidden lg:block w-4 h-4 text-gray-400' />
              </button>
              {showUserDropdown && (
                <div
                  className='absolute left-0 mt-2 min-w-[240px] bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50'
                  role='menu'
                >
                  {/* User Info */}
                  <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)]/80 flex items-center justify-center text-white font-bold text-lg shadow-md'>
                        {userName.charAt(0)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                          {userName}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {userEmail}
                        </div>
                        <div className='text-xs font-medium text-[var(--brand-primary)] mt-0.5'>
                          {roleNames[userRole] || userRole}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='py-2'>
                    <Link
                      href='/profile'
                      onClick={() => setShowUserDropdown(false)}
                      className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                    >
                      <User className='w-4 h-4' />
                      <span>
                        {t(I18N_KEYS.HEADER.PROFILE) || 'الملف الشخصي'}
                      </span>
                    </Link>
                    <Link
                      href='/admin/settings'
                      onClick={() => setShowUserDropdown(false)}
                      className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                    >
                      <Settings className='w-4 h-4' />
                      <span>{t(I18N_KEYS.HEADER.SETTINGS) || 'الإعدادات'}</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className='border-t border-gray-200 dark:border-gray-700 p-2'>
                    <button
                      onClick={handleLogout}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLogout();
                        }
                      }}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium'
                      aria-label={t(I18N_KEYS.HEADER.LOGOUT) || 'تسجيل الخروج'}
                    >
                      <LogOut className='w-4 h-4' />
                      <span>
                        {t(I18N_KEYS.HEADER.LOGOUT) || 'تسجيل الخروج'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

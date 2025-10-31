'use client';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';
import { useT } from '@/components/providers/I18nProvider';
import { useLanguage, useTheme } from '@/design-system/hooks';
import { useSystemConfig } from '@/lib/config/system-config';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, isLoading: themeLoading } = useTheme();
  const { language, isLoading: languageLoading, direction } = useLanguage();
  const [notif, setNotif] = useState(3);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const { config: systemConfig } = useSystemConfig();
  const { t } = useT();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifDropdown(false);
      setShowUserDropdown(false);
      setShowAIFeatures(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get enabled modules for quick access
  const enabledModules = Object.entries(systemConfig.modules)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({ name, ...config }));

  // Get AI features status
  const aiFeaturesEnabled = Object.values(systemConfig.ai_features).some(feature =>
    typeof feature === 'object' && 'enabled' in feature && feature.enabled
  );

  return (
    <header className='sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800'>
      <div className='mx-auto px-4 sm:px-6'>
        <div className='h-14 grid grid-cols-[auto_1fr_auto] items-center gap-3'>
          <button
            type='button'
            className='lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-[var(--brand-surface)] dark:hover:bg-gray-800 focus:outline-none focus:ring-2'
            aria-label={t('common.openMenu')}
            data-hs-overlay='#app-sidebar'
          >
            ☰
          </button>

          <div className='flex min-w-0 items-center gap-3'>
            <div className='hidden items-center gap-2 sm:flex'>
              <div className='grid h-8 w-8 place-items-center rounded-lg text-white bg-default'>
                م
              </div>
              <div className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate'>
                {t('common.systemName')}
              </div>
            </div>

            <div className='w-full max-w-[680px] ms-auto lg:ms-0'>
              <div className='relative'>
                <input
                  type='search'
                  className='py-2 pe-10 ps-3 block w-full border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 focus:ring-1 focus:border-[var(--brand-primary)]'
                  placeholder={t('common.searchPlaceholder')}
                  aria-label={t('common.search')}
                  style={{ outlineColor: 'var(--brand-primary)' }}
                />
                <div className='absolute inset-y-0 end-0 flex items-center pe-2 text-gray-400'>
                  ⌘K
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 justify-self-end'>
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* AI Features Indicator */}
            {aiFeaturesEnabled && (
              <div className='hs-dropdown [--trigger:hover] relative inline-flex'>
                <button
                  className='relative h-9 w-9 rounded-full border border-[var(--brand-border)] dark:border-gray-700 grid place-items-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2'
                  style={{ outlineColor: 'var(--brand-primary)' }}
                  aria-haspopup='menu'
                  aria-expanded='false'
                  onClick={() => setShowAIFeatures(!showAIFeatures)}
                >
                  🤖
                  <span className='absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-green-600 text-white text-xs grid place-items-center'>
                    AI
                  </span>
                </button>
                {showAIFeatures && (
                  <div
                    className='hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-100 min-w-80 bg-white dark:bg-gray-900 shadow-md rounded-lg p-2 border border-[var(--brand-border)] dark:border-gray-700'
                    role='menu'
                  >
                    <div className='mb-2 font-medium px-2 text-gray-800 dark:text-gray-100'>
                      {t('header.aiFeatures')}
                    </div>
                    <div className='grid gap-2'>
                      {systemConfig.ai_features.chatbot.enabled && (
                        <div className='rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100'>
                          <span>💬</span>
                          <div>
                            <div className='font-medium'>{t('header.chatbot')}</div>
                            <div className='text-xs text-gray-500'>{t('header.chatbotStatus')}</div>
                          </div>
                        </div>
                      )}
                      {systemConfig.ai_features.voice_bot.enabled && (
                        <div className='rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100'>
                          <span>🎤</span>
                          <div>
                            <div className='font-medium'>{t('header.voiceBot')}</div>
                            <div className='text-xs text-gray-500'>{t('header.voiceBotStatus')}</div>
                          </div>
                        </div>
                      )}
                      {systemConfig.ai_features.emotion_analytics.enabled && (
                        <div className='rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100'>
                          <span>📊</span>
                          <div>
                            <div className='font-medium'>{t('header.emotionAnalytics')}</div>
                            <div className='text-xs text-gray-500'>{t('header.emotionAnalyticsStatus')}</div>
                          </div>
                        </div>
                      )}
                      {systemConfig.ai_features.early_diagnosis.enabled && (
                        <div className='rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100'>
                          <span>🔍</span>
                          <div>
                            <div className='font-medium'>{t('header.earlyDiagnosis')}</div>
                            <div className='text-xs text-gray-500'>{t('header.earlyDiagnosisStatus')}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <div className='hs-dropdown [--trigger:hover] relative inline-flex'>
              <button
                className='relative h-9 w-9 rounded-full border border-[var(--brand-border)] dark:border-gray-700 grid place-items-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2'
                style={{ outlineColor: 'var(--brand-primary)' }}
                aria-haspopup='menu'
                aria-expanded='false'
              >
                🔔
                {notif > 0 && (
                  <span className='absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs grid place-items-center'>
                    {notif}
                  </span>
                )}
              </button>
              <div
                className='hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-64 bg-white dark:bg-gray-900 shadow-md rounded-lg p-2 border border-[var(--brand-border)] dark:border-gray-700'
                role='menu'
              >
                <div className='mb-2 font-medium px-2 text-gray-800 dark:text-gray-100'>
                  {t('header.notifications')}
                </div>
                {notif === 0 ? (
                  <div className='text-gray-500 px-2'>{t('header.noNotifications')}</div>
                ) : (
                  <div className='grid gap-2'>
                    {Array.from({ length: Math.min(3, notif) }).map((_, i) => (
                      <div
                        key={i}
                        className='rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100'
                      >
                        ℹ️ {t('header.notification').replace('{number}', (i + 1).toString())}
                      </div>
                    ))}
                    <button
                      className='h-8 rounded-md border border-gray-200 dark:border-gray-700 mx-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      onClick={() => setNotif(0)}
                    >
                      {t('header.markAsRead')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu with Logout */}
            <div className='hs-dropdown [--trigger:hover] relative inline-flex'>
              <button
                className='h-9 w-9 rounded-full bg-[var(--brand-surface)] dark:bg-gray-700 focus:outline-none focus:ring-2 border border-[var(--brand-border)] dark:border-gray-600'
                style={{ outlineColor: 'var(--brand-primary)' }}
                aria-haspopup='menu'
                aria-expanded='false'
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <svg className='w-5 h-5 text-gray-600 dark:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </button>
              {showUserDropdown && (
                <div
                  className='absolute right-0 mt-2 min-w-44 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50'
                  role='menu'
                >
                  <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>{t('header.welcome')}</p>
                  </div>
                  <div className='py-1'>
                    <button
                      className='w-full text-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                      onClick={() => setShowUserDropdown(false)}
                    >
                      👤 {t('header.profile')}
                    </button>
                    <button
                      className='w-full text-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                      onClick={() => setShowUserDropdown(false)}
                    >
                      ⚙️ {t('header.settings')}
                    </button>
                  </div>
                  <div className='border-t border-gray-200 dark:border-gray-700 py-1'>
                    <button
                      className='w-full text-start px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2'
                      onClick={async () => {
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
                            credentials: 'include'
                          });
                        } catch {}
                        try {
                          localStorage.removeItem('user');
                          localStorage.removeItem('permissions');
                        } catch {}
                        setShowUserDropdown(false);
                        window.location.replace('/login');
                      }}
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                      </svg>
                      {t('header.logout')}
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

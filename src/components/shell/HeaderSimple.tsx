'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import Image from 'next/image';

export default function HeaderSimple() {
  const [theme, setTheme] = useState<string>('light');
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('dir', dir);
    html.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('theme', theme);
    localStorage.setItem('dir', dir);
  }, [theme, dir]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowThemeDropdown(false);
      setShowLangDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className='sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80 border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 py-2'>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-3'>
            <Image
              src='/logo.png'
              alt='مُعين'
              width={32}
              height={32}
              className='rounded-lg'
            />
            <div className='text-base font-semibold text-gray-900 dark:text-white'>
              لوحة مُعين
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center gap-2'>
            {/* Theme Toggle */}
            <div className='relative'>
              <button
                className='inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                onClick={e => {
                  e.stopPropagation();
                  setShowThemeDropdown(!showThemeDropdown);
                }}
              >
                {theme === 'light' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )}
                <span className='hidden sm:inline'>الثيم</span>
              </button>
              {showThemeDropdown && (
                <div
                  className='absolute top-full right-0 z-50 min-w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900'
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className='w-full rounded-md px-3 py-2 text-start hover:bg-surface dark:hover:bg-gray-800'
                    onClick={() => {
                      setTheme('light');
                      setShowThemeDropdown(false);
                    }}
                  >
                    وضع نهاري
                  </button>
                  <button
                    className='w-full rounded-md px-3 py-2 text-start hover:bg-surface dark:hover:bg-gray-800'
                    onClick={() => {
                      setTheme('dark');
                      setShowThemeDropdown(false);
                    }}
                  >
                    وضع ليلي
                  </button>
                </div>
              )}
            </div>

            {/* Direction Toggle */}
            <button
              className='h-9 rounded-md border border-gray-200 px-3 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
              onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}
            >
              {dir === 'rtl' ? 'RTL' : 'LTR'}
            </button>

            {/* Language Dropdown */}
            <div className='relative'>
              <button
                className='inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                onClick={e => {
                  e.stopPropagation();
                  setShowLangDropdown(!showLangDropdown);
                }}
              >
                <Languages className='h-4 w-4' />
                <span className='hidden sm:inline'>اللغة</span>
              </button>
              {showLangDropdown && (
                <div
                  className='absolute top-full right-0 z-50 min-w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900'
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className='w-full rounded-md px-3 py-2 text-start hover:bg-surface dark:hover:bg-gray-800'
                    onClick={() => setShowLangDropdown(false)}
                  >
                    العربية
                  </button>
                  <button
                    className='w-full rounded-md px-3 py-2 text-start hover:bg-surface dark:hover:bg-gray-800'
                    onClick={() => setShowLangDropdown(false)}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

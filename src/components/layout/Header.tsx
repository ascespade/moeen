'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  const [currentTheme, setCurrentTheme] = useState('light');
  const router = useRouter();

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const themes = [
    { code: 'light', name: 'فاتح', icon: '☀️' },
    { code: 'dark', name: 'داكن', icon: '🌙' },
    { code: 'auto', name: 'تلقائي', icon: '🔄' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setIsLanguageMenuOpen(false);
    // يمكن إضافة منطق تغيير اللغة هنا
    if (langCode === 'en') {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    }
  };

  const handleThemeChange = (themeCode: string) => {
    setCurrentTheme(themeCode);
    setIsThemeMenuOpen(false);
    
    // تطبيق الثيم
    if (themeCode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (themeCode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      // تلقائي - يتبع إعدادات النظام
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-[var(--color-border-primary)] shadow-sm ${className}`}>
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">م</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">مُعين</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">مساعدك الذكي</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link 
              href="/features" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors font-medium"
            >
              المميزات
            </Link>
            <Link 
              href="/about" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors font-medium"
            >
              عنا
            </Link>
            <Link 
              href="/contact" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors font-medium"
            >
              اتصل بنا
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <span className="text-lg">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                </span>
                <svg 
                  className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[var(--color-border-primary)] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-right hover:bg-[var(--color-bg-secondary)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currentLanguage === lang.code ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)]' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <svg className="w-4 h-4 text-[var(--color-primary-500)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <span className="text-lg">
                  {themes.find(theme => theme.code === currentTheme)?.icon}
                </span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {themes.find(theme => theme.code === currentTheme)?.name}
                </span>
                <svg 
                  className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[var(--color-border-primary)] z-50">
                  {themes.map((theme) => (
                    <button
                      key={theme.code}
                      onClick={() => handleThemeChange(theme.code)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-right hover:bg-[var(--color-bg-secondary)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currentTheme === theme.code ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)]' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className="font-medium">{theme.name}</span>
                      {currentTheme === theme.code && (
                        <svg className="w-4 h-4 text-[var(--color-primary-500)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Link
                href="/login"
                className="px-4 py-2 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg font-medium transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden border-t border-[var(--color-border-primary)]">
        <div className="container-app py-3">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-6 rtl:space-x-reverse">
              <Link 
                href="/features" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors text-sm font-medium"
              >
                المميزات
              </Link>
              <Link 
                href="/about" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors text-sm font-medium"
              >
                عنا
              </Link>
              <Link 
                href="/contact" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors text-sm font-medium"
              >
                اتصل بنا
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
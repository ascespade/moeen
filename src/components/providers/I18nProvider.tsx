'use client';
import { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  t: (key: string, fallback?: string) => string;
  language: string;
  direction: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const t = (_key: string, fallback?: string) => {
    // Simple translation function - in real app, this would use a proper i18n library
    return fallback || _key;
  };

  const value = {
    t,
    language: 'ar',
    direction: 'rtl' as const,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useT must be used within an I18nProvider');
  }
  return context;
}

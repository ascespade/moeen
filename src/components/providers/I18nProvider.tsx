'use client';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

interface I18nContextType {
  t: (key: string, fallback?: string) => string;
  language: 'ar' | 'en';
  direction: 'ltr' | 'rtl';
  isLoading: boolean;
  toggleLanguage: () => void;
  setArabic: () => void;
  setEnglish: () => void;
  isArabic: boolean;
  isEnglish: boolean;
  isRTL: boolean;
  isLTR: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: string, fallback?: string) => {
    // Simple translation function - in real app, this would use a proper i18n library
    return fallback || key;
  };

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const setArabic = useCallback(() => {
    setLanguage('ar');
  }, []);

  const setEnglish = useCallback(() => {
    setLanguage('en');
  }, []);

  const value = {
    t,
    language,
    direction: language === 'ar' ? ('rtl' as const) : ('ltr' as const),
    isLoading,
    toggleLanguage,
    setArabic,
    setEnglish,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
    isRTL: language === 'ar',
    isLTR: language === 'en',
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

export function useLanguage() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within an I18nProvider');
  }
  return context;
}

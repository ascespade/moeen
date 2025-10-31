'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoading, setTranslationsLoading] = useState(true);

  // Load language from localStorage only (avoid duplicate API calls)
  // usePreferences hook handles API loading centrally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('moeen_user_preferences');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.language) {
            setLanguage(parsed.language);
          }
        }
      } catch (error) {
        // Ignore errors
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch translations from database
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/api/translations/${language}`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      } finally {
        setTranslationsLoading(false);
      }
    };

    if (!isLoading) {
      fetchTranslations();
    }
  }, [language, isLoading]);

  const t = useCallback((key: string, fallback?: string): string => {
    // Try to get translation from database
    if (translations[key]) {
      return translations[key];
    }
    // Try with namespace.key format if key doesn't include namespace
    if (!key.includes('.')) {
      const commonKey = `common.${key}`;
      if (translations[commonKey]) {
        return translations[commonKey];
      }
    }
    // Return fallback or key
    return fallback || key;
  }, [translations]);

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
    isLoading: isLoading || translationsLoading,
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

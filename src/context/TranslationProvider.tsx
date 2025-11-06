'use client';
import { logger } from '@/lib/utils/logger';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { createClient } from '@/lib/supabase/client';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState<string>('ar');
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('translations')
        .select('key, value, namespace')
        .eq('locale', locale);

      if (error) {
        logger.error('Error loading translations', {
          error: error instanceof Error ? error.message : String(error),
        });
        return;
      }

      if (data) {
        const translationsMap = data.reduce(
          (acc, item) => {
            const fullKey = item.namespace
              ? `${item.namespace}.${item.key}`
              : item.key;
            acc[fullKey] = item.value;
            return acc;
          },
          {} as Record<string, string>
        );
        setTranslations(translationsMap);
      }
    } catch (error) {
      logger.error('Error loading translations', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

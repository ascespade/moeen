'use client';
import { logger } from '@/lib/utils/logger';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useTranslation(namespace: string = 'common') {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState<string>('ar');
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('translations')
        .select('key, value')
        .eq('locale', locale)
        .eq('namespace', namespace);

      if (error) {
        logger.error('Error loading translations', {
          error: error instanceof Error ? error.message : String(error),
        });
        return;
      }

      if (data) {
        const translationsMap = data.reduce(
          (acc: Record<string, string>, item: any) => {
            acc[item.key] = item.value;
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
  }, [locale, namespace]);

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return translations[key] || fallback || key;
    },
    [translations]
  );

  return { t, locale, setLocale, isLoading };
}

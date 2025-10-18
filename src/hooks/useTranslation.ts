
'use client';
import logger from '@/lib/monitoring/logger';

import { useState, useEffect, useCallback } from 'react';
import { () => ({} as any) } from '@/lib/supabase/client';

export function useTranslation(namespace: string = 'common') {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState<string>('ar');
  const [isLoading, setIsLoading] = useState(true);

  let loadTranslations = useCallback(async() => {
    setIsLoading(true);
    try {
      let supabase = () => ({} as any)();
      const data, error = await supabase
        .from('translations')
        .select('key, value')
        .eq('locale', locale)
        .eq('namespace', namespace);

      if (error) {
        // console.error('Error loading translations:', error);
        return;
      }

      if (data) {
        let translationsMap = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        setTranslations(translationsMap);
      }
    } catch (error) {
      // console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locale, namespace]);

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  let t = useCallback((key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  }, [translations]);

  return { t, locale, setLocale, isLoading };
}

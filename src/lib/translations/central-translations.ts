/**
 * 🌐 Centralized Translation System
 * نظام الترجمة المركزي
 * 
 * Reads translations from database
 * Fully dynamic - no hardcoded strings
 */

import { createClient } from '@/lib/supabase/server';

export interface Translation {
  key: string;
  value: string;
  lang_code: string;
}

const translationCache = new Map<string, Map<string, string>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

/**
 * Get translation from database
 */
export async function getTranslation(
  key: string,
  langCode: string = 'ar'
): Promise<string> {
  const cacheKey = `${langCode}:${key}`;
  
  // Check cache first
  const cached = translationCache.get(langCode)?.get(key);
  const cacheTime = cacheTimestamps.get(cacheKey);
  
  if (cached && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    return cached;
  }

  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('translations')
      .select('value')
      .eq('key', key)
      .eq('lang_code', langCode)
      .maybeSingle();

    if (error || !data) {
      // Fallback: return key if translation not found
      return key;
    }

    // Cache the translation
    if (!translationCache.has(langCode)) {
      translationCache.set(langCode, new Map());
    }
    translationCache.get(langCode)!.set(key, data.value);
    cacheTimestamps.set(cacheKey, Date.now());

    return data.value;
  } catch (error) {
    console.warn(`[Translations] Failed to fetch translation for key: ${key}`);
    return key; // Fallback to key
  }
}

/**
 * Get multiple translations at once (batch)
 */
export async function getTranslations(
  keys: string[],
  langCode: string = 'ar'
): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('translations')
      .select('key, value')
      .eq('lang_code', langCode)
      .in('key', keys);

    if (error || !data) {
      // Return keys as fallback
      const result: Record<string, string> = {};
      keys.forEach(key => result[key] = key);
      return result;
    }

    const result: Record<string, string> = {};
    
    // Cache translations
    if (!translationCache.has(langCode)) {
      translationCache.set(langCode, new Map());
    }
    
    data.forEach((item) => {
      result[item.key] = item.value;
      translationCache.get(langCode)!.set(item.key, item.value);
      cacheTimestamps.set(`${langCode}:${item.key}`, Date.now());
    });

    // Fill missing keys with key itself
    keys.forEach(key => {
      if (!result[key]) {
        result[key] = key;
      }
    });

    return result;
  } catch (error) {
    console.warn('[Translations] Failed to fetch translations batch');
    // Return keys as fallback
    const result: Record<string, string> = {};
    keys.forEach(key => result[key] = key);
    return result;
  }
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear();
  cacheTimestamps.clear();
}

/**
 * Get all translations for a language (useful for preloading)
 */
export async function getAllTranslations(
  langCode: string = 'ar'
): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('translations')
      .select('key, value')
      .eq('lang_code', langCode);

    if (error || !data) {
      return {};
    }

    const result: Record<string, string> = {};
    
    // Cache all translations
    if (!translationCache.has(langCode)) {
      translationCache.set(langCode, new Map());
    }
    
    data.forEach((item) => {
      result[item.key] = item.value;
      translationCache.get(langCode)!.set(item.key, item.value);
      cacheTimestamps.set(`${langCode}:${item.key}`, Date.now());
    });

    return result;
  } catch (error) {
    console.warn('[Translations] Failed to fetch all translations');
    return {};
  }
}
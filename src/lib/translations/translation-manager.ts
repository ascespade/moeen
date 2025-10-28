/**
 * Centralized Translation Manager - مدير الترجمة المركزي
 *
 * This system manages all translations from the database
 * No hardcoded labels are allowed - everything must come from DB
 */

import { realDB } from '@/lib/supabase-real';

export interface Translation {
  id: string;
  key: string;
  ar: string;
  en: string;
  context?: string;
  module?: string;
  created_at: string;
  updated_at: string;
}

export interface TranslationCache {
  [key: string]: {
    ar: string;
    en: string;
    context?: string;
  };
}

class TranslationManager {
  private cache: TranslationCache = {};
  private isLoaded = false;
  private currentLanguage: 'ar' | 'en' = 'ar';

  async initialize() {
    if (this.isLoaded) return;

    try {
      const translations = await realDB.getTranslations();
      this.cache = {};

      translations.forEach((translation: Translation) => {
        this.cache[translation.key] = {
          ar: translation.ar,
          en: translation.en,
          context: translation.context,
        };
      });

      this.isLoaded = true;
      console.log(`✅ Loaded ${Object.keys(this.cache).length} translations`);
    } catch (error) {
      console.error('❌ Failed to load translations:', error);
      // Fallback to empty cache
      this.cache = {};
      this.isLoaded = true;
    }
  }

  setLanguage(language: 'ar' | 'en') {
    this.currentLanguage = language;
  }

  getLanguage(): 'ar' | 'en' {
    return this.currentLanguage;
  }

  t(key: string, fallback?: string): string {
    if (!this.isLoaded) {
      console.warn(`Translation not loaded, using fallback for key: ${key}`);
      return fallback || key;
    }

    const translation = this.cache[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return fallback || key;
    }

    return translation[this.currentLanguage] || fallback || key;
  }

  // Get all translations for a specific module
  getModuleTranslations(module: string): { [key: string]: string } {
    const moduleTranslations: { [key: string]: string } = {};

    Object.entries(this.cache).forEach(([key, translation]) => {
      if (key.startsWith(`${module}.`)) {
        moduleTranslations[key] = translation[this.currentLanguage];
      }
    });

    return moduleTranslations;
  }

  // Add new translation
  async addTranslation(
    key: string,
    ar: string,
    en: string,
    context?: string,
    module?: string
  ) {
    try {
      await realDB.createTranslation({
        key,
        ar,
        en,
        context,
        module,
      });

      // Update cache
      this.cache[key] = { ar, en, context };
    } catch (error) {
      console.error('Failed to add translation:', error);
    }
  }

  // Get missing translations (keys that exist in code but not in DB)
  async getMissingTranslations(): Promise<string[]> {
    // This would scan the codebase for translation keys
    // For now, return empty array
    return [];
  }

  // Validate all translations are present
  async validateTranslations(): Promise<{
    missing: string[];
    unused: string[];
  }> {
    // This would validate all translation keys
    return { missing: [], unused: [] };
  }
}

export const translationManager = new TranslationManager();

// React hook for translations
export function useTranslation() {
  return {
    t: translationManager.t.bind(translationManager),
    setLanguage: translationManager.setLanguage.bind(translationManager),
    getLanguage: translationManager.getLanguage.bind(translationManager),
    getModuleTranslations:
      translationManager.getModuleTranslations.bind(translationManager),
  };
}

// Initialize translations on module load
if (typeof window !== 'undefined') {
  translationManager.initialize();
}

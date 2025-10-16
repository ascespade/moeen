/**
 * useT Hook - خطاف الترجمة
 * React hook for accessing translations with automatic re-rendering
 */

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

import translationService from "@/lib/i18n/translationService";

interface TranslationContextType {
  language: string;
  setLanguage: (_lang: string) => void;
  t: (_key: string) => string;
  isLoading: boolean;
}

const __TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>("ar");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    {},
  );

  // Load language from localStorage on mount
  useEffect(() => {
    const __savedLanguage = localStorage.getItem("language") || "ar";
    setLanguageState(savedLanguage);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const __loadTranslations = async () => {
      setIsLoading(true);
      try {
        const fetchedTranslations =
          await translationService.fetchTranslations(language);
        setTranslations(fetchedTranslations);
      } catch (error) {
        // Use cached translations as fallback
        const __cached = translationService.getCachedTranslations(language);
        if (cached) {
          setTranslations(cached);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const __setLanguage = useCallback((_lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const __t = useCallback(
    (_key: string): string => {
      // Return cached translation if available
      if (translations[key]) {
        return translations[key] as string;
      }

      // Return key as fallback
      return key;
    },
    [translations],
  );

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const __useT = (): TranslationContextType => {
  const __context = useContext(TranslationContext);
  if (context === undefined) {
    // Return a fallback function during static generation or when not in provider
    return {
      t: (_key: string) => key,
      language: "ar",
      setLanguage: () => {},
      isLoading: false,
    };
  }
  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage,
    isLoading: context.isLoading,
  };
};

export default useT;

import {

import translationService from "@/lib/i18n/translationService";

/**
 * useT Hook - خطاف الترجمة
 * React hook for accessing translations with automatic re-rendering
 */

  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

}
interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isLoading: boolean;

}

const TranslationContext = createContext<TranslationContextType | undefined>(
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "ar";
    setLanguageState(savedLanguage);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const fetchedTranslations =
          await translationService.fetchTranslations(language);
        setTranslations(fetchedTranslations);
      } catch (error) {
        // Use cached translations as fallback
        const cached = translationService.getCachedTranslations(language);
        if (cached) {
          setTranslations(cached);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Return cached translation if available
      if (translations[key]) {
        return translations[key] as string;

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

export const useT = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    // Return a fallback function during static generation
    if (typeof window === "undefined") {
      return {
        t: (key: string) => key,
        language: "ar",
        setLanguage: () => {},
        isLoading: false,
      };
    throw new Error("useT must be used within a TranslationProvider");
  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage,
    isLoading: context.isLoading,
  };
};

export default useT;
}}}}

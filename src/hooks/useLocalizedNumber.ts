/**
 * Centralized hook for formatting numbers based on current language
 * Automatically converts numbers to Arabic-Indic digits when language is Arabic
 */

import { usePreferences } from '@/hooks/usePreferences';
import { toArabicNumbers, toEnglishNumbers } from '@/lib/utils/numbers';

/**
 * Hook to format numbers based on current language preference
 * Returns a function that formats numbers based on current language
 * @returns A function that takes a number or string and returns formatted string
 * 
 * @example
 * const localizedNumber = useLocalizedNumber();
 * const formatted = localizedNumber('1,247');
 * // Returns '١,٢٤٧' if language is Arabic
 * // Returns '1,247' if language is English
 */
export function useLocalizedNumber(): (value: string | number) => string {
  const { language } = usePreferences();
  
  return (value: string | number) => {
    const stringValue = typeof value === 'number' ? value.toString() : value;
    
    // If language is Arabic, convert to Arabic-Indic digits
    if (language === 'ar') {
      return toArabicNumbers(stringValue);
    }
    
    // If language is English, ensure English digits
    return toEnglishNumbers(stringValue);
  };
}

/**
 * Utility function to format numbers (can be used outside React components)
 * @param value - The number or string to format
 * @param language - Current language ('ar' | 'en')
 * @returns Formatted number string
 */
export function formatNumberByLanguage(
  value: string | number,
  language: 'ar' | 'en' = 'ar'
): string {
  const stringValue = typeof value === 'number' ? value.toString() : value;
  
  if (language === 'ar') {
    return toArabicNumbers(stringValue);
  }
  
  return toEnglishNumbers(stringValue);
}


/**
 * Localized Number Display Component
 * Centralized component for displaying numbers with automatic localization
 */

'use client';

import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';

interface LocalizedNumberProps {
  value: string | number;
  /**
   * Format the number with commas (e.g., 1,247)
   */
  format?: boolean;
  /**
   * Suffix to add after the number (e.g., '%', '+', 'ريال')
   */
  suffix?: string;
  /**
   * Prefix to add before the number
   */
  prefix?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component to display numbers with automatic Arabic/English localization
 * 
 * @example
 * <LocalizedNumber value={1247} format /> 
 * // Displays: ١,٢٤٧ (Arabic) or 1,247 (English)
 * 
 * @example
 * <LocalizedNumber value={98} suffix="%" />
 * // Displays: ٩٨٪ (Arabic) or 98% (English)
 */
export function LocalizedNumber({
  value,
  format = false,
  suffix = '',
  prefix = '',
  className = '',
}: LocalizedNumberProps) {
  const localizedNumber = useLocalizedNumber();
  
  const stringValue = typeof value === 'number' ? value.toString() : value;
  const formattedValue = format 
    ? Number(stringValue.replace(/,/g, '')).toLocaleString()
    : stringValue;
  
  const localized = localizedNumber(formattedValue);
  
  return (
    <span className={className}>
      {prefix}{localized}{suffix}
    </span>
  );
}

export default LocalizedNumber;


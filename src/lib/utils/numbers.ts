/**
 * Number conversion utilities for Arabic/English
 */

/**
 * Convert English digits to Arabic-Indic digits
 */
export function toArabicNumbers(value: string | number): string {
  if (typeof value === 'number') {
    value = value.toString();
  }
  
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return value.replace(/\d/g, (digit) => {
    return arabicDigits[parseInt(digit)];
  });
}

/**
 * Convert Arabic-Indic digits to English digits
 */
export function toEnglishNumbers(value: string): string {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return value.replace(/[٠-٩]/g, (digit) => {
    const index = arabicDigits.indexOf(digit);
    return index !== -1 ? englishDigits[index] : digit;
  });
}

/**
 * Format phone number with Arabic digits if needed
 */
export function formatPhoneNumber(phone: string, useArabic: boolean = true): string {
  return useArabic ? toArabicNumbers(phone) : phone;
}

/**
 * Format date with Arabic digits if needed
 */
export function formatDate(date: Date | string, useArabic: boolean = true): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  
  const dateStr = `${day}/${month}/${year}`;
  return useArabic ? toArabicNumbers(dateStr) : dateStr;
}



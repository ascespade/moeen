/**
 * Format Utilities - أدوات التنسيق
 *
 * Formatting utilities for dates, numbers, currency, etc.
 */

import { format as dateFormat, formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { CONFIG } from '../constants/config';

/**
 * Format date
 */
export function formatDate(
  date: Date | string | number,
  format: string = CONFIG.DATE_FORMAT,
  locale: 'ar' | 'en' = 'ar'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const localeObj = locale === 'ar' ? ar : enUS;

  return dateFormat(dateObj, format, { locale: localeObj });
}

/**
 * Format datetime
 */
export function formatDateTime(
  date: Date | string | number,
  locale: 'ar' | 'en' = 'ar'
): string {
  return formatDate(date, CONFIG.DATETIME_FORMAT, locale);
}

/**
 * Format time
 */
export function formatTime(
  date: Date | string | number,
  locale: 'ar' | 'en' = 'ar'
): string {
  return formatDate(date, CONFIG.TIME_FORMAT, locale);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: 'ar' | 'en' = 'ar'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const localeObj = locale === 'ar' ? ar : enUS;

  return formatDistanceToNow(dateObj, { addSuffix: true, locale: localeObj });
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'SAR',
  locale: 'ar' | 'en' = 'ar'
): string {
  const localeString = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.NumberFormat(localeString, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number
 */
export function formatNumber(
  number: number,
  locale: 'ar' | 'en' = 'ar'
): string {
  const localeString = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.NumberFormat(localeString).format(number);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as: +966 XX XXX XXXX
  if (cleaned.length === 12 && cleaned.startsWith('966')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  // Format as: 05XX XXX XXXX
  if (cleaned.length === 10 && cleaned.startsWith('05')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Date Utilities - أدوات التاريخ
 * 
 * Date manipulation utilities
 */

import { format, addDays, addMonths, addYears, isBefore, isAfter, differenceInDays, differenceInHours } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { _CONFIG } from '../constants/config';

/**
 * Get current date
 */
export function getCurrentDate(): Date {
  return new Date();
}

/**
 * Add days to date
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Add months to date
 */
export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months);
}

/**
 * Add years to date
 */
export function addYearsToDate(date: Date, years: number): Date {
  return addYears(date, years);
}

/**
 * Check if date is before another date
 */
export function isDateBefore(date1: Date, date2: Date): boolean {
  return isBefore(date1, date2);
}

/**
 * Check if date is after another date
 */
export function isDateAfter(date1: Date, date2: Date): boolean {
  return isAfter(date1, date2);
}

/**
 * Get days difference
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  return differenceInDays(date1, date2);
}

/**
 * Get hours difference
 */
export function getHoursDifference(date1: Date, date2: Date): number {
  return differenceInHours(date1, date2);
}

/**
 * Format date for display
 */
export function formatDateForDisplay(
  date: Date | string | number,
  locale: 'ar' | 'en' = 'ar'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const localeObj = locale === 'ar' ? ar : enUS;
  const formatStr = locale === 'ar' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
  
  return format(dateObj, formatStr, { locale: localeObj });
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = getStartOfDay(getCurrentDate());
  const dateToCheck = getStartOfDay(date);
  return today.getTime() === dateToCheck.getTime();
}

/**
 * Check if date is in past
 */
export function isPast(date: Date): boolean {
  return isBefore(date, getCurrentDate());
}

/**
 * Check if date is in future
 */
export function isFuture(date: Date): boolean {
  return isAfter(date, getCurrentDate());
}

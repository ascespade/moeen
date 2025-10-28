/**
 * Design System Utilities
 * Re-export commonly used utilities for the design system
 */

// Basic utility functions
export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('ar-SA');
export const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString('ar-SA');
export const formatCurrency = (amount: number) =>
  `${amount.toLocaleString('ar-SA')} ريال`;
export const formatPhone = (phone: string) =>
  phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
export const formatNationalId = (id: string) =>
  id.replace(/(\d{1})(\d{4})(\d{5})(\d{1})/, '$1-$2-$3-$4');

// Validation utilities
export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone: string) =>
  /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
export const isValidNationalId = (id: string) => /^[1-2]\d{9}$/.test(id);

// String utilities
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const truncate = (str: string, length: number) =>
  str.length > length ? str.substring(0, length) + '...' : str;
export const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Array utilities
export const unique = <T>(arr: T[]) => [...new Set(arr)];
export const groupBy = <T>(arr: T[], key: keyof T) => {
  return arr.reduce(
    (groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
};

// Object utilities
export const pick = <T, K extends keyof T>(obj: T, keys: K[]) => {
  return keys.reduce(
    (result, key) => {
      result[key] = obj[key];
      return result;
    },
    {} as Pick<T, K>
  );
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

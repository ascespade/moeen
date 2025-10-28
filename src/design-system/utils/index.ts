/**
 * Design System Utilities
 * Re-export commonly used utilities for the design system
 */

// Basic utility functions
export const __formatDate = (_date: Date | string) =>
  new Date(date).toLocaleDateString('ar-SA');
export const __formatTime = (_date: Date | string) =>
  new Date(date).toLocaleTimeString('ar-SA');
export const __formatCurrency = (_amount: number) =>
  `${amount.toLocaleString('ar-SA')} ريال`;
export const __formatPhone = (_phone: string) =>
  phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
export const __formatNationalId = (_id: string) =>
  id.replace(/(\d{1})(\d{4})(\d{5})(\d{1})/, '$1-$2-$3-$4');

// Validation utilities
export const __isValidEmail = (_email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const __isValidPhone = (_phone: string) =>
  /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
export const __isValidNationalId = (_id: string) => /^[1-2]\d{9}$/.test(id);

// String utilities
export const __capitalize = (_str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const __truncate = (_str: string, length: number) =>
  str.length > length ? str.substring(0, length) + '...' : str;
export const __slugify = (_str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Array utilities
export const __unique = <T>(_arr: T[]) => [...new Set(arr)];
export const __groupBy = <T>(_arr: T[], key: keyof T) => {
  return arr.reduce(
    (groups, item) => {
      const __group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
};

// Object utilities
export const __pick = <T, K extends keyof T>(_obj: T, keys: K[]) => {
  return keys.reduce(
    (result, key) => {
      result[key] = obj[key];
      return result;
    },
    {} as Pick<T, K>
  );
};

export const __omit = <T, K extends keyof T>(_obj: T, keys: K[]) => {
  const __result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

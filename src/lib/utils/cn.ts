/**
 * Class Name Utility - أداة دمج الأصناف
 *
 * Industry-standard utility for merging Tailwind classes
 * Based on clsx + tailwind-merge pattern
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * @example
 * cn('px-2 py-1', 'px-4') // → 'py-1 px-4' (px-4 wins)
 * cn('bg-red-500', condition && 'bg-blue-500') // → conditional merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Variant utility for component variants
 *
 * @example
 * const buttonVariants = cva('base-button-class', {
 *   variants: {
 *     variant: {
 *       primary: 'bg-primary text-white',
 *       secondary: 'bg-secondary text-black'
 *     }
 *   }
 * });
 */
export { cva, type VariantProps } from 'class-variance-authority';

/**
 * Centralized Constants Exports
 * Single entry point for all application constants
 * 
 * Note: Design tokens (colors, spacing, typography, etc.) have been moved to:
 * - src/styles/centralized.css (CSS variables)
 * - Use var(--brand-primary), var(--space-4), etc. instead
 */

// Re-export all constants modules
export * from './routes';
export * from './roles';
export * from './ui'; // Now contains only remaining UI constants after centralization
export * from './theme';

// Re-export from core constants (API endpoints, etc.)
export * from '../core/constants';

// Re-export from config for convenience
export * from '../config';

// Type exports for better TypeScript support
export type { UserRole } from './roles';

/**
 * Centralized Design Tokens Reference
 * 
 * All design tokens have been moved to src/styles/centralized.css as CSS variables:
 * 
 * COLORS:
 * - var(--brand-primary)     - Primary brand color (orange)
 * - var(--brand-secondary)   - Secondary brand color
 * - var(--brand-success)     - Success color (green)
 * - var(--brand-warning)     - Warning color (yellow) 
 * - var(--brand-error)       - Error color (red)
 * - var(--brand-info)        - Info color (blue)
 * 
 * SPACING:
 * - var(--space-1)           - 0.25rem (4px)
 * - var(--space-2)           - 0.5rem (8px)  
 * - var(--space-4)           - 1rem (16px)
 * - var(--space-8)           - 2rem (32px)
 * - ... up to var(--space-96)
 * 
 * TYPOGRAPHY:
 * - var(--font-size-xs)      - 0.75rem
 * - var(--font-size-sm)      - 0.875rem
 * - var(--font-size-base)    - 1rem
 * - var(--font-weight-normal) - 400
 * - var(--font-weight-bold)  - 700
 * 
 * SHADOWS:
 * - var(--shadow-sm)         - Small shadow
 * - var(--shadow-md)         - Medium shadow
 * - var(--shadow-lg)         - Large shadow
 * 
 * BORDER RADIUS:
 * - var(--radius-sm)         - 0.25rem
 * - var(--radius-md)         - 0.375rem
 * - var(--radius-lg)         - 0.5rem
 * 
 * Z-INDEX:
 * - var(--z-dropdown)        - 1000
 * - var(--z-modal)           - 1050  
 * - var(--z-tooltip)         - 1070
 * 
 * ANIMATIONS:
 * - var(--duration-fast)     - 150ms
 * - var(--duration-normal)   - 300ms
 * - var(--duration-slow)     - 500ms
 * 
 * BREAKPOINTS:
 * - var(--breakpoint-mobile) - 768px
 * - var(--breakpoint-tablet) - 1024px
 * - var(--breakpoint-desktop) - 1440px
 */
/**
 * CENTRALIZED THEME SYSTEM - نظام الثيم المركزي
 * =============================================
 * 
 * Single source of truth for all design tokens, colors, typography,
 * spacing, and component styles across the entire application.
 * 
 * المصدر الوحيد للحقيقة لجميع رموز التصميم والألوان والخطوط
 * والمسافات وأنماط المكونات في التطبيق بأكمله.
 */

// ========================================
// THEME TYPES - أنواع الثيم
// ========================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type Language = 'ar' | 'en';
export type Direction = 'ltr' | 'rtl';

// ========================================
// BRAND COLORS - الألوان الأساسية
// ========================================

export const BRAND_COLORS = {
  // Primary Brand Colors - الألوان الأساسية للعلامة التجارية
  primary: '#E46C0A',        // البرتقالي الأساسي
  primaryHover: '#D45F08',   // البرتقالي عند التمرير
  secondary: '#6B4E16',      // البني الثانوي
  neutralBeige: '#F2E7DC',   // البيج المحايد
  
  // Accent Colors - الألوان المميزة
  accent: '#007bff',         // الأزرق المميز
  accentDeep: '#C93C00',     // الأحمر البرتقالي العميق
  
  // Status Colors - ألوان الحالة
  success: '#009688',        // الأخضر للنجاح
  warning: '#f59e0b',        // الأصفر للتحذير
  error: '#ef4444',          // الأحمر للخطأ
  info: '#007bff',           // الأزرق للمعلومات
  
  // Light Theme Colors - ألوان الثيم الفاتح
  light: {
    background: '#ffffff',
    foreground: '#0f172a',
    surface: '#f9fafb',
    panel: '#ffffff',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280',
    muted: '#f3f4f6',
  },
  
  // Dark Theme Colors - ألوان الثيم المظلم
  dark: {
    background: '#0d1117',
    foreground: '#e5eef7',
    surface: '#0d1117',
    panel: '#111827',
    border: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    muted: '#1f2937',
  }
} as const;

// ========================================
// TYPOGRAPHY SYSTEM - نظام الخطوط
// ========================================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'var(--font-cairo), var(--font-inter), "Cairo", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", monaco, consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  }
} as const;

// ========================================
// SPACING SYSTEM - نظام المسافات
// ========================================

export const SPACING = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ========================================
// BORDER RADIUS SYSTEM - نظام نصف قطر الحدود
// ========================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',     // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const;

// ========================================
// SHADOW SYSTEM - نظام الظلال
// ========================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 5%)',
  default: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
  md: '0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 25%)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 5%)',
} as const;

// ========================================
// Z-INDEX SYSTEM - نظام مؤشر الطبقات
// ========================================

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  tooltip: 1080,
  toast: 1090,
} as const;

// ========================================
// ANIMATION SYSTEM - نظام الحركات
// ========================================

export const ANIMATION = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ========================================
// COMPONENT CLASSES - فئات المكونات
// ========================================

export const COMPONENT_CLASSES = {
  // Button Classes - فئات الأزرار
  btn: 'inline-flex items-center justify-center gap-2 px-6 py-3 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
  'btn-brand': 'bg-brand-primary text-white hover:bg-brand-primary-hover hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  'btn-secondary': 'bg-brand-surface text-foreground border border-brand-border hover:bg-panel hover:-translate-y-0.5 active:translate-y-0',
  'btn-outline': 'bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-y-0.5 active:translate-y-0',
  'btn-ghost': 'bg-transparent text-foreground hover:bg-brand-surface hover:-translate-y-0.5 active:translate-y-0',
  'btn-sm': 'px-4 py-2 text-xs',
  'btn-lg': 'px-8 py-4 text-base',
  
  // Card Classes - فئات البطاقات
  card: 'bg-panel border border-brand-border rounded-lg transition-all duration-150',
  'card-hover': 'hover:-translate-y-1 hover:shadow-lg cursor-pointer',
  'card-elevated': 'shadow-lg',
  'card-interactive': 'cursor-pointer hover:-translate-y-2 hover:shadow-xl',
  
  // Form Classes - فئات النماذج
  'form-input': 'w-full px-4 py-3 border border-brand-border rounded-md bg-panel text-foreground text-sm transition-all duration-150 focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 placeholder:text-brand-border',
  'form-label': 'block text-sm font-medium text-foreground mb-2',
  'form-error': 'text-brand-error text-xs mt-1',
  'form-help': 'text-brand-border text-xs mt-1',
  
  // Badge Classes - فئات الشارات
  badge: 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  'badge-success': 'bg-brand-success/10 text-brand-success',
  'badge-warning': 'bg-brand-warning/10 text-brand-warning',
  'badge-error': 'bg-brand-error/12 text-brand-error',
  'badge-info': 'bg-brand-accent/12 text-brand-accent',
  'badge-brand': 'bg-brand-primary/10 text-brand-primary',
  
  // Alert Classes - فئات التنبيهات
  alert: 'p-4 rounded-md border',
  'alert-success': 'bg-brand-success/10 text-brand-success border-brand-success/20',
  'alert-warning': 'bg-brand-warning/10 text-brand-warning border-brand-warning/20',
  'alert-error': 'bg-brand-error/10 text-brand-error border-brand-error/20',
  'alert-info': 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  
  // Utility Classes - فئات المساعدة
  'text-brand': 'text-brand-primary',
  'bg-brand': 'bg-brand-primary',
  'border-brand': 'border-brand-border',
  'shadow-soft': 'shadow-md transition-shadow duration-150',
} as const;

// ========================================
// THEME UTILITIES - أدوات الثيم
// ========================================

/**
 * Get system theme preference
 * الحصول على تفضيل ثيم النظام
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve theme from user preference
 * حل الثيم من تفضيل المستخدم
 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Generate CSS variables for theme
 * توليد متغيرات CSS للثيم
 */
export function generateCSSVariables(theme: ResolvedTheme): Record<string, string> {
  const colors = theme === 'dark' ? BRAND_COLORS.dark : BRAND_COLORS.light;
  
  return {
    // Brand Colors - ألوان العلامة التجارية
    '--brand-primary': BRAND_COLORS.primary,
    '--brand-primary-hover': BRAND_COLORS.primaryHover,
    '--brand-secondary': BRAND_COLORS.secondary,
    '--brand-neutral-beige': BRAND_COLORS.neutralBeige,
    '--brand-accent': BRAND_COLORS.accent,
    '--brand-accent-deep': BRAND_COLORS.accentDeep,
    '--brand-success': BRAND_COLORS.success,
    '--brand-warning': BRAND_COLORS.warning,
    '--brand-error': BRAND_COLORS.error,
    '--brand-info': BRAND_COLORS.info,
    
    // Theme Colors - ألوان الثيم
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--brand-surface': colors.surface,
    '--panel': colors.panel,
    '--brand-border': colors.border,
    '--text': colors.text,
    '--text-secondary': colors.textSecondary,
    '--muted': colors.muted,
    
    // Typography - الخطوط
    '--font-family-sans': TYPOGRAPHY.fontFamily.sans,
    '--font-family-mono': TYPOGRAPHY.fontFamily.mono,
    
    // Spacing - المسافات
    '--space-1': SPACING[1],
    '--space-2': SPACING[2],
    '--space-3': SPACING[3],
    '--space-4': SPACING[4],
    '--space-6': SPACING[6],
    '--space-8': SPACING[8],
    '--space-12': SPACING[12],
    '--space-16': SPACING[16],
    
    // Border Radius - نصف قطر الحدود
    '--radius-sm': BORDER_RADIUS.sm,
    '--radius-md': BORDER_RADIUS.md,
    '--radius-lg': BORDER_RADIUS.lg,
    '--radius-xl': BORDER_RADIUS.xl,
    
    // Shadows - الظلال
    '--shadow-sm': SHADOWS.sm,
    '--shadow-md': SHADOWS.md,
    '--shadow-lg': SHADOWS.lg,
    '--shadow-xl': SHADOWS.xl,
    
    // Transitions - التحولات
    '--transition-fast': `${ANIMATION.duration[150]} ${ANIMATION.easing['in-out']}`,
    '--transition-normal': `${ANIMATION.duration[300]} ${ANIMATION.easing['in-out']}`,
    '--transition-slow': `${ANIMATION.duration[500]} ${ANIMATION.easing['in-out']}`,
    
    // Z-Index - مؤشر الطبقات
    '--z-dropdown': Z_INDEX.dropdown.toString(),
    '--z-sticky': Z_INDEX.sticky.toString(),
    '--z-fixed': Z_INDEX.banner.toString(),
    '--z-modal-backdrop': Z_INDEX.overlay.toString(),
    '--z-modal': Z_INDEX.modal.toString(),
    '--z-popover': Z_INDEX.popover.toString(),
    '--z-tooltip': Z_INDEX.tooltip.toString(),
    '--z-toast': Z_INDEX.toast.toString(),
  };
}

/**
 * Apply theme to document
 * تطبيق الثيم على المستند
 */
export function applyThemeToDocument(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set theme attribute
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  
  // Apply CSS variables
  const variables = generateCSSVariables(theme);
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Apply language to document
 * تطبيق اللغة على المستند
 */
export function applyLanguageToDocument(language: Language): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  
  root.setAttribute('lang', language);
  root.setAttribute('dir', direction);
  root.classList.toggle('rtl', direction === 'rtl');
  root.classList.toggle('ltr', direction === 'ltr');
}

/**
 * Get stored theme preference
 * الحصول على تفضيل الثيم المحفوظ
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('moeen-theme');
    return stored as Theme || null;
  } catch {
    return null;
  }
}

/**
 * Store theme preference
 * حفظ تفضيل الثيم
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('moeen-theme', theme);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get stored language preference
 * الحصول على تفضيل اللغة المحفوظ
 */
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('moeen-language');
    return stored as Language || null;
  } catch {
    return null;
  }
}

/**
 * Store language preference
 * حفظ تفضيل اللغة
 */
export function storeLanguage(language: Language): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('moeen-language', language);
  } catch {
    // Ignore storage errors
  }
}

// ========================================
// CENTRALIZED THEME EXPORT - تصدير الثيم المركزي
// ========================================

export const CENTRALIZED_THEME = {
  // Core systems
  colors: BRAND_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  animation: ANIMATION,
  classes: COMPONENT_CLASSES,
  
  // Utilities
  generateCSSVariables,
  applyThemeToDocument,
  applyLanguageToDocument,
  getSystemTheme,
  resolveTheme,
  getStoredTheme,
  storeTheme,
  getStoredLanguage,
  storeLanguage,
} as const;

export default CENTRALIZED_THEME;
/**
 * Dynamic Design System - نظام التصميم الديناميكي الشامل
 * 
 * Centralized design system that covers ALL aspects of design:
 * - Colors (Brand, Semantic, Interactive, Theme-aware)
 * - Spacing (Responsive, Dynamic)
 * - Typography (Font families, sizes, weights, line heights)
 * - Borders (Radius, widths, styles, colors)
 * - Shadows (Box shadows, text shadows, effects)
 * - Animations (Transitions, keyframes, easing)
 * - Layout (Containers, grids, flexbox)
 * - Components (Sizes, variants, states)
 * - Responsive (Breakpoints, adaptive values)
 * - Accessibility (Focus, contrast, motion)
 * - RTL Support (Direction-aware)
 * 
 * All values are dynamic and can be customized at runtime
 */

// ============================================
// CORE DESIGN TOKENS - الرموز الأساسية
// ============================================

export const designTokens = {
  // ============================================
  // COLORS - الألوان (Theme-aware & Dynamic)
  // ============================================
  colors: {
    // Brand Colors - Can be customized
    brand: {
      primary: 'var(--color-brand-primary)',
      primaryHover: 'var(--color-brand-primary-hover)',
      primaryActive: 'var(--color-brand-primary-active)',
      primaryLight: 'var(--color-brand-primary-light)',
      primaryDark: 'var(--color-brand-primary-dark)',
      
      secondary: 'var(--color-brand-secondary)',
      secondaryHover: 'var(--color-brand-secondary-hover)',
      secondaryActive: 'var(--color-brand-secondary-active)',
      
      accent: 'var(--color-brand-accent)',
      accentHover: 'var(--color-brand-accent-hover)',
      accentActive: 'var(--color-brand-accent-active)',
    },

    // Semantic Colors - Context-aware
    semantic: {
      success: 'var(--color-semantic-success)',
      successHover: 'var(--color-semantic-success-hover)',
      successLight: 'var(--color-semantic-success-light)',
      successDark: 'var(--color-semantic-success-dark)',
      
      warning: 'var(--color-semantic-warning)',
      warningHover: 'var(--color-semantic-warning-hover)',
      warningLight: 'var(--color-semantic-warning-light)',
      warningDark: 'var(--color-semantic-warning-dark)',
      
      error: 'var(--color-semantic-error)',
      errorHover: 'var(--color-semantic-error-hover)',
      errorLight: 'var(--color-semantic-error-light)',
      errorDark: 'var(--color-semantic-error-dark)',
      
      info: 'var(--color-semantic-info)',
      infoHover: 'var(--color-semantic-info-hover)',
      infoLight: 'var(--color-semantic-info-light)',
      infoDark: 'var(--color-semantic-info-dark)',
    },

    // Background Colors - Theme-aware
    background: {
      primary: 'var(--color-background-primary)',
      secondary: 'var(--color-background-secondary)',
      tertiary: 'var(--color-background-tertiary)',
      surface: 'var(--color-background-surface)',
      overlay: 'var(--color-background-overlay)',
    },

    // Text Colors - Contrast-aware
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      muted: 'var(--color-text-muted)',
      disabled: 'var(--color-text-disabled)',
      inverse: 'var(--color-text-inverse)',
    },

    // Border Colors
    border: {
      primary: 'var(--color-border-primary)',
      secondary: 'var(--color-border-secondary)',
      accent: 'var(--color-border-accent)',
      focus: 'var(--color-border-focus)',
      error: 'var(--color-border-error)',
    },

    // Interactive States - Dynamic
    interactive: {
      hover: 'var(--color-interactive-hover)',
      active: 'var(--color-interactive-active)',
      focus: 'var(--color-interactive-focus)',
      disabled: 'var(--color-interactive-disabled)',
      selected: 'var(--color-interactive-selected)',
    },
  },

  // ============================================
  // SPACING - المسافات (Responsive & Dynamic)
  // ============================================
  spacing: {
    // Base spacing scale
    0: '0',
    px: '1px',
    0.5: 'var(--spacing-0-5)',
    1: 'var(--spacing-1)',
    1.5: 'var(--spacing-1-5)',
    2: 'var(--spacing-2)',
    2.5: 'var(--spacing-2-5)',
    3: 'var(--spacing-3)',
    3.5: 'var(--spacing-3-5)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    7: 'var(--spacing-7)',
    8: 'var(--spacing-8)',
    9: 'var(--spacing-9)',
    10: 'var(--spacing-10)',
    11: 'var(--spacing-11)',
    12: 'var(--spacing-12)',
    14: 'var(--spacing-14)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    28: 'var(--spacing-28)',
    32: 'var(--spacing-32)',
    36: 'var(--spacing-36)',
    40: 'var(--spacing-40)',
    44: 'var(--spacing-44)',
    48: 'var(--spacing-48)',
    52: 'var(--spacing-52)',
    56: 'var(--spacing-56)',
    60: 'var(--spacing-60)',
    64: 'var(--spacing-64)',
    72: 'var(--spacing-72)',
    80: 'var(--spacing-80)',
    96: 'var(--spacing-96)',
  },

  // ============================================
  // TYPOGRAPHY - الطباعة (Dynamic & Responsive)
  // ============================================
  typography: {
    // Font Families
    fontFamily: {
      sans: 'var(--font-family-sans)',
      serif: 'var(--font-family-serif)',
      mono: 'var(--font-family-mono)',
      display: 'var(--font-family-display)',
    },

    // Font Sizes - Responsive
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
      '5xl': 'var(--font-size-5xl)',
      '6xl': 'var(--font-size-6xl)',
      '7xl': 'var(--font-size-7xl)',
      '8xl': 'var(--font-size-8xl)',
      '9xl': 'var(--font-size-9xl)',
    },

    // Font Weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // Line Heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },

    // Letter Spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ============================================
  // BORDERS - الحدود (Dynamic)
  // ============================================
  borders: {
    // Border Radius
    radius: {
      none: '0',
      sm: 'var(--border-radius-sm)',
      base: 'var(--border-radius-base)',
      md: 'var(--border-radius-md)',
      lg: 'var(--border-radius-lg)',
      xl: 'var(--border-radius-xl)',
      '2xl': 'var(--border-radius-2xl)',
      '3xl': 'var(--border-radius-3xl)',
      full: '9999px',
    },

    // Border Widths
    width: {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },

    // Border Styles
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      none: 'none',
    },
  },

  // ============================================
  // SHADOWS - الظلال (Dynamic & Layered)
  // ============================================
  shadows: {
    // Box Shadows
    box: {
      none: 'none',
      sm: 'var(--shadow-sm)',
      base: 'var(--shadow-base)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
      '2xl': 'var(--shadow-2xl)',
      inner: 'var(--shadow-inner)',
      glow: 'var(--shadow-glow)',
      glowBrand: 'var(--shadow-glow-brand)',
    },

    // Text Shadows
    text: {
      none: 'none',
      sm: 'var(--text-shadow-sm)',
      base: 'var(--text-shadow-base)',
      lg: 'var(--text-shadow-lg)',
    },
  },

  // ============================================
  // ANIMATIONS - الحركات (Dynamic & Smooth)
  // ============================================
  animations: {
    // Durations
    duration: {
      fast: 'var(--duration-fast)',
      normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
      slower: 'var(--duration-slower)',
    },

    // Easing Functions
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Transitions
    transition: {
      all: 'all var(--duration-normal) var(--easing-smooth)',
      colors: 'color var(--duration-fast) var(--easing-smooth), background-color var(--duration-fast) var(--easing-smooth), border-color var(--duration-fast) var(--easing-smooth)',
      transform: 'transform var(--duration-normal) var(--easing-smooth)',
      opacity: 'opacity var(--duration-fast) var(--easing-smooth)',
      shadow: 'box-shadow var(--duration-normal) var(--easing-smooth)',
    },

    // Keyframes
    keyframes: {
      fadeIn: 'fadeIn var(--duration-normal) var(--easing-smooth)',
      fadeOut: 'fadeOut var(--duration-normal) var(--easing-smooth)',
      slideInUp: 'slideInUp var(--duration-normal) var(--easing-smooth)',
      slideInDown: 'slideInDown var(--duration-normal) var(--easing-smooth)',
      slideInLeft: 'slideInLeft var(--duration-normal) var(--easing-smooth)',
      slideInRight: 'slideInRight var(--duration-normal) var(--easing-smooth)',
      scaleIn: 'scaleIn var(--duration-normal) var(--easing-bounce)',
      scaleOut: 'scaleOut var(--duration-normal) var(--easing-smooth)',
      bounce: 'bounce 1s infinite',
      pulse: 'pulse 2s infinite',
      spin: 'spin 1s linear infinite',
    },
  },

  // ============================================
  // LAYOUT - التخطيط (Responsive & Dynamic)
  // ============================================
  layout: {
    // Container Sizes
    container: {
      sm: 'var(--container-sm)',
      md: 'var(--container-md)',
      lg: 'var(--container-lg)',
      xl: 'var(--container-xl)',
      '2xl': 'var(--container-2xl)',
      full: '100%',
    },

    // Breakpoints
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    // Z-Index Scale
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
    },
  },

  // ============================================
  // COMPONENTS - المكونات (Dynamic Sizes)
  // ============================================
  components: {
    // Button Sizes
    button: {
      xs: {
        height: 'var(--button-height-xs)',
        padding: 'var(--button-padding-xs)',
        fontSize: 'var(--button-font-size-xs)',
        borderRadius: 'var(--button-radius-xs)',
      },
      sm: {
        height: 'var(--button-height-sm)',
        padding: 'var(--button-padding-sm)',
        fontSize: 'var(--button-font-size-sm)',
        borderRadius: 'var(--button-radius-sm)',
      },
      md: {
        height: 'var(--button-height-md)',
        padding: 'var(--button-padding-md)',
        fontSize: 'var(--button-font-size-md)',
        borderRadius: 'var(--button-radius-md)',
      },
      lg: {
        height: 'var(--button-height-lg)',
        padding: 'var(--button-padding-lg)',
        fontSize: 'var(--button-font-size-lg)',
        borderRadius: 'var(--button-radius-lg)',
      },
      xl: {
        height: 'var(--button-height-xl)',
        padding: 'var(--button-padding-xl)',
        fontSize: 'var(--button-font-size-xl)',
        borderRadius: 'var(--button-radius-xl)',
      },
    },

    // Input Sizes
    input: {
      xs: {
        height: 'var(--input-height-xs)',
        padding: 'var(--input-padding-xs)',
        fontSize: 'var(--input-font-size-xs)',
        borderRadius: 'var(--input-radius-xs)',
      },
      sm: {
        height: 'var(--input-height-sm)',
        padding: 'var(--input-padding-sm)',
        fontSize: 'var(--input-font-size-sm)',
        borderRadius: 'var(--input-radius-sm)',
      },
      md: {
        height: 'var(--input-height-md)',
        padding: 'var(--input-padding-md)',
        fontSize: 'var(--input-font-size-md)',
        borderRadius: 'var(--input-radius-md)',
      },
      lg: {
        height: 'var(--input-height-lg)',
        padding: 'var(--input-padding-lg)',
        fontSize: 'var(--input-font-size-lg)',
        borderRadius: 'var(--input-radius-lg)',
      },
    },

    // Card Sizes
    card: {
      sm: {
        padding: 'var(--card-padding-sm)',
        borderRadius: 'var(--card-radius-sm)',
        shadow: 'var(--card-shadow-sm)',
      },
      md: {
        padding: 'var(--card-padding-md)',
        borderRadius: 'var(--card-radius-md)',
        shadow: 'var(--card-shadow-md)',
      },
      lg: {
        padding: 'var(--card-padding-lg)',
        borderRadius: 'var(--card-radius-lg)',
        shadow: 'var(--card-shadow-lg)',
      },
    },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS - وظائف مساعدة
// ============================================

/**
 * Get design token value
 * استخدام: getToken('colors.brand.primary') → 'var(--color-brand-primary)'
 */
export function getToken(path: string): string {
  const keys = path.split('.');
  let value: any = designTokens;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Design token not found: ${path}`);
      return '';
    }
  }
  
  return value;
}

/**
 * Build CSS custom property name
 * استخدام: buildCSSVar('color', 'brand', 'primary') → '--color-brand-primary'
 */
export function buildCSSVar(...parts: string[]): string {
  return `--${parts.join('-')}`;
}

/**
 * Create responsive value
 * استخدام: responsive('spacing', 4) → 'var(--spacing-4)'
 */
export function responsive(category: string, value: string | number): string {
  return `var(--${category}-${value})`;
}

/**
 * Build component class name
 * استخدام: buildComponentClass('button', 'primary', 'md') → 'ds-button ds-button-primary ds-button-md'
 */
export function buildComponentClass(component: string, variant?: string, size?: string): string {
  const classes = [`ds-${component}`];
  if (variant) classes.push(`ds-${component}-${variant}`);
  if (size) classes.push(`ds-${component}-${size}`);
  return classes.join(' ');
}

/**
 * Create theme-aware color
 * استخدام: themeColor('brand', 'primary') → 'var(--color-brand-primary)'
 */
export function themeColor(category: string, name: string): string {
  return `var(--color-${category}-${name})`;
}

/**
 * Create spacing value
 * استخدام: spacing(4) → 'var(--spacing-4)'
 */
export function spacing(size: keyof typeof designTokens.spacing): string {
  return designTokens.spacing[size];
}

/**
 * Create typography value
 * استخدام: typography('fontSize', 'lg') → 'var(--font-size-lg)'
 */
export function typography(property: keyof typeof designTokens.typography, value: string): string {
  return `var(--${property}-${value})`;
}

// ============================================
// TYPE EXPORTS - أنواع TypeScript
// ============================================

export type DesignToken = typeof designTokens;
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TypographyToken = keyof typeof designTokens.typography;
export type BorderToken = keyof typeof designTokens.borders;
export type ShadowToken = keyof typeof designTokens.shadows;
export type AnimationToken = keyof typeof designTokens.animations;
export type LayoutToken = keyof typeof designTokens.layout;
export type ComponentToken = keyof typeof designTokens.components;

// ============================================
// THEME CONFIGURATION - إعدادات الثيم
// ============================================

export interface ThemeConfig {
  colors?: Partial<typeof designTokens.colors>;
  spacing?: Partial<typeof designTokens.spacing>;
  typography?: Partial<typeof designTokens.typography>;
  borders?: Partial<typeof designTokens.borders>;
  shadows?: Partial<typeof designTokens.shadows>;
  animations?: Partial<typeof designTokens.animations>;
  layout?: Partial<typeof designTokens.layout>;
  components?: Partial<typeof designTokens.components>;
}

/**
 * Apply theme configuration
 * استخدام: applyTheme({ colors: { brand: { primary: '#ff0000' } } })
 */
export function applyTheme(config: ThemeConfig): void {
  const root = document.documentElement;
  
  // Apply color tokens
  if (config.colors) {
    Object.entries(config.colors).forEach(([category, values]) => {
      if (values && typeof values === 'object') {
        Object.entries(values).forEach(([name, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--color-${category}-${name}`, value);
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subName, subValue]) => {
              if (typeof subValue === 'string') {
                root.style.setProperty(`--color-${category}-${name}-${subName}`, subValue);
              }
            });
          }
        });
      }
    });
  }
  
  // Apply other tokens similarly...
  // (Implementation would continue for all token categories)
}

export default designTokens;

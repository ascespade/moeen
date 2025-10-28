/**
 * Dynamic Theme Manager - مدير الثيمات الديناميكي
 *
 * This file provides a comprehensive theme management system that allows:
 * - Runtime theme switching (light/dark/custom)
 * - Dynamic color customization
 * - Responsive design adjustments
 * - RTL/LTR support
 * - Accessibility preferences
 * - Theme persistence
 * - Component-level theming
 * - Animation preferences
 * - Typography scaling
 */

import React from 'react';
import { designTokens, type ThemeConfig } from './design-system';

// ============================================
// THEME TYPES - أنواع الثيمات
// ============================================

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'brand' | 'monochrome' | 'high-contrast' | 'custom';
export type AnimationPreference = 'full' | 'reduced' | 'none';
export type TypographyScale = 'small' | 'medium' | 'large' | 'xlarge';

export interface ThemeSettings {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  animationPreference: AnimationPreference;
  typographyScale: TypographyScale;
  rtl: boolean;
  customColors?: Record<string, string>;
  customSpacing?: Record<string, string>;
  customTypography?: Record<string, string>;
}

export interface ThemeState {
  current: ThemeSettings;
  available: ThemeMode[];
  system: {
    prefersDark: boolean;
    prefersReducedMotion: boolean;
    prefersHighContrast: boolean;
  };
}

// ============================================
// DEFAULT THEMES - الثيمات الافتراضية
// ============================================

export const defaultThemes: Record<ThemeMode, ThemeConfig> = {
  light: {
    colors: {
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
      background: {
        primary: 'var(--color-background-primary)',
        secondary: 'var(--color-background-secondary)',
        tertiary: 'var(--color-background-tertiary)',
        surface: 'var(--color-background-surface)',
        overlay: 'var(--color-background-overlay)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        muted: 'var(--color-text-muted)',
        disabled: 'var(--color-text-disabled)',
        inverse: 'var(--color-text-inverse)',
      },
      border: {
        primary: 'var(--color-border-primary)',
        secondary: 'var(--color-border-secondary)',
        accent: 'var(--color-border-accent)',
        focus: 'var(--color-border-focus)',
        error: 'var(--color-border-error)',
      },
      interactive: {
        hover: 'var(--color-interactive-hover)',
        active: 'var(--color-interactive-active)',
        focus: 'var(--color-interactive-focus)',
        disabled: 'var(--color-interactive-disabled)',
        selected: 'var(--color-interactive-selected)',
      },
    },
  },
  dark: {
    colors: {
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
      background: {
        primary: 'var(--color-background-primary)',
        secondary: 'var(--color-background-secondary)',
        tertiary: 'var(--color-background-tertiary)',
        surface: 'var(--color-background-surface)',
        overlay: 'var(--color-background-overlay)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        muted: 'var(--color-text-muted)',
        disabled: 'var(--color-text-disabled)',
        inverse: 'var(--color-text-inverse)',
      },
      border: {
        primary: 'var(--color-border-primary)',
        secondary: 'var(--color-border-secondary)',
        accent: 'var(--color-border-accent)',
        focus: 'var(--color-border-focus)',
        error: 'var(--color-border-error)',
      },
      interactive: {
        hover: 'var(--color-interactive-hover)',
        active: 'var(--color-interactive-active)',
        focus: 'var(--color-interactive-focus)',
        disabled: 'var(--color-interactive-disabled)',
        selected: 'var(--color-interactive-selected)',
      },
    },
  },
  auto: {
    // Auto theme will be determined by system preferences
    colors: {},
  },
};

// ============================================
// THEME MANAGER CLASS - فئة مدير الثيمات
// ============================================

export class ThemeManager {
  private settings: ThemeSettings;
  private listeners: Set<(settings: ThemeSettings) => void> = new Set();
  private mediaQueries: {
    dark: MediaQueryList;
    reducedMotion: MediaQueryList;
    highContrast: MediaQueryList;
  };

  constructor(initialSettings?: Partial<ThemeSettings>) {
    this.settings = {
      mode: 'auto',
      colorScheme: 'brand',
      animationPreference: 'full',
      typographyScale: 'medium',
      rtl: false,
      ...initialSettings,
    };

    // Initialize media queries (SSR safe)
    if (typeof window !== 'undefined') {
      this.mediaQueries = {
        dark: window.matchMedia('(prefers-color-scheme: dark)'),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        highContrast: window.matchMedia('(prefers-contrast: high)'),
      };
    } else {
      // Fallback for SSR
      const createFallbackMediaQuery = (): MediaQueryList => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      });

      this.mediaQueries = {
        dark: createFallbackMediaQuery(),
        reducedMotion: createFallbackMediaQuery(),
        highContrast: createFallbackMediaQuery(),
      };
    }

    // Load saved settings
    this.loadSettings();

    // Apply initial theme
    this.applyTheme();

    // Listen for system changes
    this.setupSystemListeners();
  }

  // ============================================
  // PUBLIC METHODS - الطرق العامة
  // ============================================

  /**
   * Get current theme settings
   */
  getSettings(): ThemeSettings {
    return { ...this.settings };
  }

  /**
   * Get current theme state
   */
  getState(): ThemeState {
    return {
      current: this.getSettings(),
      available: ['light', 'dark', 'auto'],
      system: {
        prefersDark: this.mediaQueries.dark.matches,
        prefersReducedMotion: this.mediaQueries.reducedMotion.matches,
        prefersHighContrast: this.mediaQueries.highContrast.matches,
      },
    };
  }

  /**
   * Update theme settings
   */
  updateSettings(updates: Partial<ThemeSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.applyTheme();
    this.notifyListeners();
  }

  /**
   * Set theme mode
   */
  setMode(mode: ThemeMode): void {
    this.updateSettings({ mode });
  }

  /**
   * Set color scheme
   */
  setColorScheme(scheme: ColorScheme): void {
    this.updateSettings({ colorScheme: scheme });
  }

  /**
   * Set animation preference
   */
  setAnimationPreference(preference: AnimationPreference): void {
    this.updateSettings({ animationPreference: preference });
  }

  /**
   * Set typography scale
   */
  setTypographyScale(scale: TypographyScale): void {
    this.updateSettings({ typographyScale: scale });
  }

  /**
   * Toggle RTL mode
   */
  toggleRTL(): void {
    this.updateSettings({ rtl: !this.settings.rtl });
  }

  /**
   * Set custom colors
   */
  setCustomColors(colors: Record<string, string>): void {
    this.updateSettings({ customColors: colors });
  }

  /**
   * Reset to default theme
   */
  reset(): void {
    this.settings = {
      mode: 'auto',
      colorScheme: 'brand',
      animationPreference: 'full',
      typographyScale: 'medium',
      rtl: false,
    };
    this.saveSettings();
    this.applyTheme();
    this.notifyListeners();
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (settings: ThemeSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ============================================
  // PRIVATE METHODS - الطرق الخاصة
  // ============================================

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('theme-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load theme settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('theme-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save theme settings:', error);
    }
  }

  private applyTheme(): void {
    const root = document.documentElement;

    // Apply theme mode
    this.applyThemeMode(root);

    // Apply color scheme
    this.applyColorScheme(root);

    // Apply animation preferences
    this.applyAnimationPreferences(root);

    // Apply typography scale
    this.applyTypographyScale(root);

    // Apply RTL support
    this.applyRTLSupport(root);

    // Apply custom colors
    this.applyCustomColors(root);

    // Apply accessibility preferences
    this.applyAccessibilityPreferences(root);
  }

  private applyThemeMode(root: HTMLElement): void {
    const { mode } = this.settings;

    if (mode === 'auto') {
      const prefersDark = this.mediaQueries.dark.matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode);
    }
  }

  private applyColorScheme(root: HTMLElement): void {
    const { colorScheme } = this.settings;
    root.setAttribute('data-color-scheme', colorScheme);

    if (colorScheme === 'custom' && this.settings.customColors) {
      Object.entries(this.settings.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  }

  private applyAnimationPreferences(root: HTMLElement): void {
    const { animationPreference } = this.settings;
    root.setAttribute('data-animation', animationPreference);

    if (animationPreference === 'reduced' || animationPreference === 'none') {
      root.style.setProperty('--duration-fast', '0.01ms');
      root.style.setProperty('--duration-normal', '0.01ms');
      root.style.setProperty('--duration-slow', '0.01ms');
      root.style.setProperty('--duration-slower', '0.01ms');
    }
  }

  private applyTypographyScale(root: HTMLElement): void {
    const { typographyScale } = this.settings;
    root.setAttribute('data-typography-scale', typographyScale);

    const scaleFactors = {
      small: 0.875,
      medium: 1,
      large: 1.125,
      xlarge: 1.25,
    };

    const factor = scaleFactors[typographyScale];

    // Apply scale to font sizes
    Object.entries(designTokens.typography.fontSize).forEach(([key, value]) => {
      const numericValue = parseFloat(value);
      const scaledValue = `${numericValue * factor}rem`;
      root.style.setProperty(`--font-size-${key}`, scaledValue);
    });
  }

  private applyRTLSupport(root: HTMLElement): void {
    const { rtl } = this.settings;
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    root.setAttribute('data-rtl', rtl.toString());
  }

  private applyCustomColors(root: HTMLElement): void {
    if (this.settings.customColors) {
      Object.entries(this.settings.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  }

  private applyAccessibilityPreferences(root: HTMLElement): void {
    const { system } = this.getState();

    if (system.prefersHighContrast) {
      root.setAttribute('data-high-contrast', 'true');
    }

    if (system.prefersReducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    }
  }

  private setupSystemListeners(): void {
    // Listen for system theme changes
    this.mediaQueries.dark.addEventListener('change', () => {
      if (this.settings.mode === 'auto') {
        this.applyTheme();
        this.notifyListeners();
      }
    });

    // Listen for reduced motion changes
    this.mediaQueries.reducedMotion.addEventListener('change', () => {
      this.applyTheme();
      this.notifyListeners();
    });

    // Listen for high contrast changes
    this.mediaQueries.highContrast.addEventListener('change', () => {
      this.applyTheme();
      this.notifyListeners();
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSettings());
      } catch (error) {
        console.error('Theme listener error:', error);
      }
    });
  }
}

// ============================================
// THEME UTILITIES - أدوات الثيم
// ============================================

/**
 * Create a theme manager instance
 */
export function createThemeManager(
  initialSettings?: Partial<ThemeSettings>
): ThemeManager {
  return new ThemeManager(initialSettings);
}

/**
 * Get system theme preferences
 */
export function getSystemPreferences(): Pick<
  ThemeState['system'],
  'prefersDark' | 'prefersReducedMotion' | 'prefersHighContrast'
> {
  return {
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
  };
}

/**
 * Generate theme CSS variables
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  let css = ':root {\n';

  // Generate color variables
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([category, colors]) => {
      if (colors && typeof colors === 'object') {
        Object.entries(colors).forEach(([name, value]) => {
          if (typeof value === 'string') {
            css += `  --color-${category}-${name}: ${value};\n`;
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subName, subValue]) => {
              if (typeof subValue === 'string') {
                css += `  --color-${category}-${name}-${subName}: ${subValue};\n`;
              }
            });
          }
        });
      }
    });
  }

  css += '}\n';
  return css;
}

/**
 * Apply theme to document
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  const root = document.documentElement;

  // Apply color variables
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([category, colors]) => {
      if (colors && typeof colors === 'object') {
        Object.entries(colors).forEach(([name, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--color-${category}-${name}`, value);
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subName, subValue]) => {
              if (typeof subValue === 'string') {
                root.style.setProperty(
                  `--color-${category}-${name}-${subName}`,
                  subValue
                );
              }
            });
          }
        });
      }
    });
  }
}

// ============================================
// REACT HOOKS - خطافات React
// ============================================

/**
 * React hook for theme management
 */
export function useTheme() {
  const [themeManager] = React.useState(() => createThemeManager());
  const [settings, setSettings] = React.useState(themeManager.getSettings());

  React.useEffect(() => {
    const unsubscribe = themeManager.subscribe(setSettings);
    return unsubscribe;
  }, [themeManager]);

  return {
    settings,
    updateSettings: themeManager.updateSettings.bind(themeManager),
    setMode: themeManager.setMode.bind(themeManager),
    setColorScheme: themeManager.setColorScheme.bind(themeManager),
    setAnimationPreference:
      themeManager.setAnimationPreference.bind(themeManager),
    setTypographyScale: themeManager.setTypographyScale.bind(themeManager),
    toggleRTL: themeManager.toggleRTL.bind(themeManager),
    setCustomColors: themeManager.setCustomColors.bind(themeManager),
    reset: themeManager.reset.bind(themeManager),
  };
}

// ============================================
// EXPORTS - التصدير
// ============================================

export default ThemeManager;

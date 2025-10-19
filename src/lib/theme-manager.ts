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
        primary: '#e46c0a',
        primaryHover: '#d45f08',
        primaryActive: '#c25a07',
        primaryLight: '#f4a261',
        primaryDark: '#a0522d',
        secondary: '#ffa500',
        secondaryHover: '#ff8c00',
        secondaryActive: '#ff7f00',
        secondaryLight: '#ffb84d',
        secondaryDark: '#cc8400',
        accent: '#007bff',
        accentHover: '#0056b3',
        accentActive: '#004085',
        accentLight: '#66b3ff',
        accentDark: '#003d82',
      },
      semantic: {
        success: '#10b981',
        successHover: '#059669',
        successActive: '#047857',
        successLight: '#6ee7b7',
        successDark: '#064e3b',
        warning: '#f59e0b',
        warningHover: '#d97706',
        warningActive: '#b45309',
        warningLight: '#fbbf24',
        warningDark: '#92400e',
        error: '#ef4444',
        errorHover: '#dc2626',
        errorActive: '#b91c1c',
        errorLight: '#f87171',
        errorDark: '#7f1d1d',
        info: '#3b82f6',
        infoHover: '#2563eb',
        infoActive: '#1d4ed8',
        infoLight: '#93c5fd',
        infoDark: '#1e3a8a',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        surface: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#64748b',
        muted: '#94a3b8',
        disabled: '#cbd5e1',
        inverse: '#ffffff',
      },
      border: {
        primary: '#e2e8f0',
        secondary: '#cbd5e1',
        accent: '#e46c0a',
        focus: '#007bff',
        error: '#ef4444',
      },
      interactive: {
        hover: '#f8fafc',
        active: '#f1f5f9',
        focus: '#007bff',
        disabled: '#cbd5e1',
        selected: '#e46c0a',
      },
    },
  },
  dark: {
    colors: {
      brand: {
        primary: '#f4a261',
        primaryHover: '#e76f51',
        primaryActive: '#d62828',
        primaryLight: '#f77f00',
        primaryDark: '#e76f51',
        secondary: '#ffb84d',
        secondaryHover: '#ffa500',
        secondaryActive: '#ff8c00',
        secondaryLight: '#ffc266',
        secondaryDark: '#cc8400',
        accent: '#60a5fa',
        accentHover: '#3b82f6',
        accentActive: '#2563eb',
        accentLight: '#93c5fd',
        accentDark: '#1d4ed8',
      },
      semantic: {
        success: '#34d399',
        successHover: '#10b981',
        successActive: '#059669',
        successLight: '#6ee7b7',
        successDark: '#064e3b',
        warning: '#fbbf24',
        warningHover: '#f59e0b',
        warningActive: '#d97706',
        warningLight: '#fcd34d',
        warningDark: '#92400e',
        error: '#f87171',
        errorHover: '#ef4444',
        errorActive: '#dc2626',
        errorLight: '#fca5a5',
        errorDark: '#7f1d1d',
        info: '#60a5fa',
        infoHover: '#3b82f6',
        infoActive: '#2563eb',
        infoLight: '#93c5fd',
        infoDark: '#1e3a8a',
      },
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
        surface: '#1e293b',
        overlay: 'rgba(0, 0, 0, 0.7)',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        tertiary: '#94a3b8',
        muted: '#64748b',
        disabled: '#475569',
        inverse: '#0f172a',
      },
      border: {
        primary: '#334155',
        secondary: '#475569',
        accent: '#f4a261',
        focus: '#60a5fa',
        error: '#f87171',
      },
      interactive: {
        hover: '#1e293b',
        active: '#334155',
        focus: '#60a5fa',
        disabled: '#475569',
        selected: '#f4a261',
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
      this.mediaQueries = {
        dark: {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        } as MediaQueryList,
        reducedMotion: {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        } as MediaQueryList,
        highContrast: {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        } as MediaQueryList,
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

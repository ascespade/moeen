'use client';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'sans' | 'serif' | 'mono';
  rtl: boolean;
}

export interface ThemeConfig extends ThemeSettings {}

export const defaultThemeConfig: ThemeConfig = {
  mode: 'system',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  borderRadius: 'md',
  fontFamily: 'sans',
  rtl: false
};

export class ThemeManager {
  private static readonly STORAGE_KEY = 'healthcare_theme_config';

  static loadTheme(): ThemeConfig {
    if (typeof window === 'undefined') {
      return defaultThemeConfig;
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultThemeConfig, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load theme config:', error);
    }

    return defaultThemeConfig;
  }

  static getSettings(): ThemeSettings {
    return this.loadTheme();
  }

  static saveTheme(config: ThemeConfig): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      this.applyTheme(config);
    } catch (error) {
      console.warn('Failed to save theme config:', error);
    }
  }

  static applyTheme(config: ThemeConfig): void {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', config.primaryColor);
    root.style.setProperty('--theme-secondary', config.secondaryColor);
    root.style.setProperty('--theme-accent', config.accentColor);
    root.style.setProperty('--theme-radius', this.getBorderRadiusValue(config.borderRadius));
    root.style.setProperty('--theme-font', this.getFontFamilyValue(config.fontFamily));

    // Apply dark/light mode
    if (config.mode === 'dark' || (config.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private static getBorderRadiusValue(radius: ThemeConfig['borderRadius']): string {
    const radiusMap = {
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    };
    return radiusMap[radius];
  }

  private static getFontFamilyValue(font: ThemeConfig['fontFamily']): string {
    const fontMap = {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace'
    };
    return fontMap[font];
  }

  static updateTheme(updates: Partial<ThemeConfig>): ThemeConfig {
    const current = this.loadTheme();
    const updated = { ...current, ...updates };
    this.saveTheme(updated);
    return updated;
  }

  static updateSettings(updates: Partial<ThemeSettings>): ThemeSettings {
    return this.updateTheme(updates);
  }

  static setMode(mode: ThemeMode): void {
    this.updateTheme({ mode });
  }

  static toggleRTL(): void {
    const current = this.loadTheme();
    this.updateTheme({ rtl: !current.rtl });
  }

  static reset(): ThemeSettings {
    this.saveTheme(defaultThemeConfig);
    return defaultThemeConfig;
  }

  static resetTheme(): ThemeConfig {
    this.saveTheme(defaultThemeConfig);
    return defaultThemeConfig;
  }

  static subscribe(callback: (settings: ThemeSettings) => void): () => void {
    // Simple implementation - in a real app you'd use a proper event system
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === this.STORAGE_KEY) {
        callback(this.getSettings());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    return () => {};
  }
}
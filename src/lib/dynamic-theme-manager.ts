'use client';

import { ThemeManager, ThemeConfig } from './theme-manager';

export interface DynamicThemeConfig extends ThemeConfig {
  autoSwitch: boolean;
  language: 'ar' | 'en';
  timeBasedThemes: {
    morning: ThemeConfig;
    afternoon: ThemeConfig;
    evening: ThemeConfig;
    night: ThemeConfig;
  };
  userPreferences: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

export const defaultDynamicThemeConfig: DynamicThemeConfig = {
  ...ThemeManager.loadTheme(),
  autoSwitch: false,
  language: 'ar',
  timeBasedThemes: {
    morning: {
      mode: 'light',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      borderRadius: 'md',
      fontFamily: 'sans',
      rtl: false
    },
    afternoon: {
      mode: 'light',
      primaryColor: '#059669',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      borderRadius: 'md',
      fontFamily: 'sans',
      rtl: false
    },
    evening: {
      mode: 'dark',
      primaryColor: '#8b5cf6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      borderRadius: 'md',
      fontFamily: 'sans',
      rtl: false
    },
    night: {
      mode: 'dark',
      primaryColor: '#1e40af',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      borderRadius: 'md',
      fontFamily: 'sans',
      rtl: false
    }
  },
  userPreferences: {
    reduceMotion: false,
    highContrast: false,
    fontSize: 'medium'
  }
};

export class DynamicThemeManager {
  private static readonly STORAGE_KEY = 'healthcare_dynamic_theme_config';
  private static intervalId: NodeJS.Timeout | null = null;

  static loadConfig(): DynamicThemeConfig {
    if (typeof window === 'undefined') {
      return defaultDynamicThemeConfig;
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultDynamicThemeConfig, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load dynamic theme config:', error);
    }

    return defaultDynamicThemeConfig;
  }

  static saveConfig(config: DynamicThemeConfig): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      this.applyConfig(config);
    } catch (error) {
      console.warn('Failed to save dynamic theme config:', error);
    }
  }

  static applyConfig(config: DynamicThemeConfig): void {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    
    // Apply user preferences
    if (config.userPreferences.reduceMotion) {
      root.style.setProperty('--motion-reduce', 'reduce');
    } else {
      root.style.removeProperty('--motion-reduce');
    }

    if (config.userPreferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    };
    root.style.setProperty('--font-size-base', fontSizeMap[config.userPreferences.fontSize]);

    // Apply current theme
    ThemeManager.applyTheme(config);

    // Start/stop auto-switching
    if (config.autoSwitch) {
      this.startAutoSwitch(config);
    } else {
      this.stopAutoSwitch();
    }
  }

  static startAutoSwitch(config: DynamicThemeConfig): void {
    this.stopAutoSwitch(); // Clear any existing interval

    this.intervalId = setInterval(() => {
      const currentTime = new Date().getHours();
      let timeTheme: ThemeConfig;

      if (currentTime >= 6 && currentTime < 12) {
        timeTheme = config.timeBasedThemes.morning;
      } else if (currentTime >= 12 && currentTime < 18) {
        timeTheme = config.timeBasedThemes.afternoon;
      } else if (currentTime >= 18 && currentTime < 22) {
        timeTheme = config.timeBasedThemes.evening;
      } else {
        timeTheme = config.timeBasedThemes.night;
      }

      // Merge with current config but use time-based theme
      const mergedTheme = { ...config, ...timeTheme };
      ThemeManager.applyTheme(mergedTheme);
    }, 60000); // Check every minute
  }

  static stopAutoSwitch(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static updateConfig(updates: Partial<DynamicThemeConfig>): DynamicThemeConfig {
    const current = this.loadConfig();
    const updated = { ...current, ...updates };
    this.saveConfig(updated);
    return updated;
  }

  static resetConfig(): DynamicThemeConfig {
    this.saveConfig(defaultDynamicThemeConfig);
    return defaultDynamicThemeConfig;
  }

  static getCurrentTimeTheme(config: DynamicThemeConfig): ThemeConfig {
    const currentTime = new Date().getHours();

    if (currentTime >= 6 && currentTime < 12) {
      return config.timeBasedThemes.morning;
    } else if (currentTime >= 12 && currentTime < 18) {
      return config.timeBasedThemes.afternoon;
    } else if (currentTime >= 18 && currentTime < 22) {
      return config.timeBasedThemes.evening;
    } else {
      return config.timeBasedThemes.night;
    }
  }
}
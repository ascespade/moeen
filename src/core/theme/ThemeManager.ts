/**
 * Theme Manager - مدير الثيمات المركزي
 * Professional centralized theme management system
 * نظام إدارة الثيمات المركزي الاحترافي
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  // Brand Colors - الألوان الأساسية
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  
  // Background Colors - ألوان الخلفية
  background: string;
  foreground: string;
  surface: string;
  panel: string;
  border: string;
  
  // Text Colors - ألوان النص
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Interactive States - حالات التفاعل
  hover: string;
  active: string;
  focus: string;
}

export interface DesignTokens {
  colors: {
    brand: ThemeConfig;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  zIndex: Record<string, number>;
}

class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeMode = 'system';
  private resolvedTheme: ResolvedTheme = 'light';
  private isInitialized = false;
  private listeners: Set<(theme: ResolvedTheme) => void> = new Set();
  
  // Design Tokens - رموز التصميم
  private readonly designTokens: DesignTokens = {
    colors: {
      brand: {
        primary: '#E46C0A',
        primaryHover: '#D45F08',
        secondary: '#6B4E16',
        accent: '#007bff',
        success: '#009688',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#ffffff',
        foreground: '#0f172a',
        surface: '#f9fafb',
        panel: '#ffffff',
        border: '#e5e7eb',
        textPrimary: '#0f172a',
        textSecondary: '#6b7280',
        textMuted: '#9ca3af',
        hover: '#f3f4f6',
        active: '#e5e7eb',
        focus: '#007bff',
      },
      semantic: {
        success: '#009688',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#007bff',
      },
      neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
    spacing: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },
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
  };

  private constructor() {
    this.initializeTheme();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private initializeTheme(): void {
    if (typeof window === 'undefined') return;
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }

    // Resolve initial theme
    this.resolvedTheme = this.resolveTheme();
    
    // Apply theme immediately to prevent flash
    this.applyTheme();
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
    
    this.isInitialized = true;
  }

  private resolveTheme(): ResolvedTheme {
    if (this.currentTheme === 'system') {
      return this.detectSystemTheme();
    }
    return this.currentTheme as ResolvedTheme;
  }

  private detectSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (this.currentTheme === 'system') {
        const newResolved = this.detectSystemTheme();
        if (newResolved !== this.resolvedTheme) {
          this.resolvedTheme = newResolved;
          this.applyTheme();
          this.notifyListeners();
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
  }

  private applyTheme(): void {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(this.resolvedTheme);
    
    // Set theme attribute
    root.setAttribute('data-theme', this.resolvedTheme);
    
    // Apply CSS variables
    const cssVariables = this.generateCSSVariables();
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  private generateCSSVariables(): Record<string, string> {
    const isDark = this.resolvedTheme === 'dark';
    const brand = this.designTokens.colors.brand;
    
    return {
      // Brand Colors - الألوان الأساسية
      '--brand-primary': brand.primary,
      '--brand-primary-hover': brand.primaryHover,
      '--brand-secondary': brand.secondary,
      '--brand-accent': brand.accent,
      '--brand-success': brand.success,
      '--brand-warning': brand.warning,
      '--brand-error': brand.error,
      
      // Background Colors - ألوان الخلفية
      '--background': isDark ? '#0f172a' : brand.background,
      '--foreground': isDark ? '#f8fafc' : brand.foreground,
      '--surface': isDark ? '#1e293b' : brand.surface,
      '--panel': isDark ? '#334155' : brand.panel,
      '--border': isDark ? '#475569' : brand.border,
      
      // Text Colors - ألوان النص
      '--text-primary': isDark ? '#f8fafc' : brand.textPrimary,
      '--text-secondary': isDark ? '#cbd5e1' : brand.textSecondary,
      '--text-muted': isDark ? '#94a3b8' : brand.textMuted,
      
      // Interactive States - حالات التفاعل
      '--hover': isDark ? '#334155' : brand.hover,
      '--active': isDark ? '#475569' : brand.active,
      '--focus': brand.focus,
      
      // Neutral Colors - الألوان المحايدة
      ...Object.entries(this.designTokens.colors.neutral).reduce((acc, [key, value]) => {
        acc[`--neutral-${key}`] = value;
        return acc;
      }, {} as Record<string, string>),
      
      // Spacing - المسافات
      ...Object.entries(this.designTokens.spacing).reduce((acc, [key, value]) => {
        acc[`--space-${key}`] = value;
        return acc;
      }, {} as Record<string, string>),
      
      // Border Radius - نصف قطر الحدود
      ...Object.entries(this.designTokens.borderRadius).reduce((acc, [key, value]) => {
        acc[`--radius-${key}`] = value;
        return acc;
      }, {} as Record<string, string>),
      
      // Shadows - الظلال
      ...Object.entries(this.designTokens.shadows).reduce((acc, [key, value]) => {
        acc[`--shadow-${key}`] = value;
        return acc;
      }, {} as Record<string, string>),
      
      // Z-Index - ترتيب الطبقات
      ...Object.entries(this.designTokens.zIndex).reduce((acc, [key, value]) => {
        acc[`--z-${key}`] = value.toString();
        return acc;
      }, {} as Record<string, string>),
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.resolvedTheme));
  }

  // Public API
  public getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  public getResolvedTheme(): ResolvedTheme {
    return this.resolvedTheme;
  }

  public setTheme(theme: ThemeMode): void {
    if (this.currentTheme === theme) return;
    
    this.currentTheme = theme;
    this.resolvedTheme = this.resolveTheme();
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    
    this.applyTheme();
    this.notifyListeners();
  }

  public toggleTheme(): void {
    if (this.currentTheme === 'light') {
      this.setTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  public subscribe(listener: (theme: ResolvedTheme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getDesignTokens(): DesignTokens {
    return this.designTokens;
  }

  public isDark(): boolean {
    return this.resolvedTheme === 'dark';
  }

  public isLight(): boolean {
    return this.resolvedTheme === 'light';
  }

  public isSystem(): boolean {
    return this.currentTheme === 'system';
  }

  public isInitialized(): boolean {
    return this.isInitialized;
  }
}

export default ThemeManager;

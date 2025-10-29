/**
 * Advanced Theme Management System - نظام إدارة الثيمات المتقدم Beschreibung
 * Real-time theme management with intelligent color adjustments
 */

export interface ThemeColorConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColors: string[];
  backgroundColor: string;
  textColor: string;
  contrastMinRatio: number;
  ensureVisibility: boolean;
  handleHiddenComponents: boolean;
  dynamicShadows: boolean;
  gradientSupport: boolean;
  avoidColors?: string[];
  description?: string;
}

export interface ThemeConfig {
  light: ThemeColorConfig;
  dark: ThemeColorConfig;
}

export interface ColorIntelligenceConfig {
  autoContrast: boolean;
  adaptiveAccent: boolean;
  dynamicReplacement: boolean;
  modernPalette: boolean;
  gradientOptimization: boolean;
  shadowOptimization: boolean;
  contextAware: boolean;
  realTimeUpdate: boolean;
  description?: string;
}

export interface ThemeRule {
  ruleType:
    | 'contrastCheck'
    | 'hiddenComponentFix'
    | 'avoidColors'
    | 'adaptiveAccent'
    | 'gradientAndShadowOptimization'
    | 'realTimeMonitoring'
    | 'contextAwareAdjustment'
    | 'report';
  action: 'autoAdjust' | 'forceAdjust' | 'replace' | 'dynamicApply' | 'monitorNewComponents' | 'generate';
  target: 'allComponents' | 'componentsWithLowVisibility' | 'accentColors' | 'projectComponents';
  threshold?: number;
  method?: string;
  colorsToAvoid?: string[];
  replacementStrategy?: string;
  description?: string;
}

export interface AdvancedThemeSettings {
  themeManagement: {
    mode: 'real-time';
    themes: {
      light: ThemeColorConfig;
      dark: ThemeColorConfig;
    };
    centralizedColorSystem: boolean;
    colorIntelligence: ColorIntelligenceConfig;
    rules: ThemeRule[];
  };
}

// Default theme settings based on your JSON
export const defaultThemeSettings: AdvancedThemeSettings = {
  themeManagement: {
    mode: 'real-time',
    themes: {
      light: {
        primaryColor: '#e46c0a', /* البرتقالي الأساسي - Primary Orange */
        secondaryColor: '#ffffff',
        accentColors: ['#ff9800', '#ffb400', '#ff6b6b'], /* ألوان ثانوية متناسقة مع البرتقالي */
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        contrastMinRatio: 4.5,
        ensureVisibility: true,
        handleHiddenComponents: true,
        dynamicShadows: true,
        gradientSupport: true,
        description: 'الوضع الفاتح يستخدم البرتقالي كاللون الأساسي مع ألوان ثانوية متناسقة.',
      },
      dark: {
        primaryColor: '#ff9800', /* برتقالي أفتح للوضع الداكن */
        secondaryColor: '#181818',
        accentColors: ['#ffb400', '#ff6b6b', '#ff8a65'], /* ألوان ثانوية متناسقة */
        backgroundColor: '#121212',
        textColor: '#e8eaed',
        contrastMinRatio: 4.5,
        ensureVisibility: true,
        handleHiddenComponents: true,
        avoidColors: ['#000080', '#00008b', '#222222'],
        dynamicShadows: true,
        gradientSupport: true,
        description: 'الوضع الداكن يستخدم البرتقالي كاللون الأساسي مع ألوان ثانوية متناسقة وعصرية.',
      },
    },
    centralizedColorSystem: true,
    colorIntelligence: {
      autoContrast: true,
      adaptiveAccent: true,
      dynamicReplacement: true,
      modernPalette: true,
      gradientOptimization: true,
      shadowOptimization: true,
      contextAware: true,
      realTimeUpdate: true,
      description:
        'النظام يتحقق من كل مكون جديد أو معدل، ويعدل الألوان والتباين تلقائيًا حسب الخلفية والوضع، ويضمن توافق مع أحدث صيحات التصميم العالمي.',
    },
    rules: [
      {
        ruleType: 'contrastCheck',
        action: 'autoAdjust',
        target: 'allComponents',
        threshold: 4.5,
        description: 'تأكد من وضوح كل المكونات بالنسبة للون الخلفية الحالي، طبق تلقائيًا معايير WCAG AA.',
      },
      {
        ruleType: 'hiddenComponentFix',
        action: 'forceAdjust',
        target: 'componentsWithLowVisibility',
        method: 'adjustColorOrOpacity',
        description: 'أي مكون شبه مخفي يتم تعديله ديناميكيًا من حيث اللون، الظل أو Opacity.',
      },
      {
        ruleType: 'avoidColors',
        action: 'replace',
        target: 'allComponents',
        colorsToAvoid: ['#000080', '#00008b', '#222222'],
        replacementStrategy: 'pickFromModernCentralPalette',
        description: 'استبدل أي لون غير مرغوب به بلون عصري ومتناسق من لوحة الألوان المركزية.',
      },
      {
        ruleType: 'adaptiveAccent',
        action: 'dynamicApply',
        target: 'accentColors',
        description:
          'تطبيق ألوان ثانوية ديناميكية لضمان التناسق مع الوضع الحالي والخلفية، وتجنب التضارب مع الألوان الأساسية.',
      },
      {
        ruleType: 'gradientAndShadowOptimization',
        action: 'dynamicApply',
        target: 'allComponents',
        description:
          'تحسين الظلال والتدرجات لكل المكونات تلقائيًا بما يتوافق مع أحدث صيحات التصميم، مع الحفاظ على الوضوح.',
      },
      {
        ruleType: 'realTimeMonitoring',
        action: 'monitorNewComponents',
        target: 'allComponents',
        description: 'مراقبة أي مكون جديد أو معدل فور إضافته، وضبط الألوان والتباين تلقائيًا لحظيًا.',
      },
      {
        ruleType: 'contextAwareAdjustment',
        action: 'dynamicApply',
        target: 'allComponents',
        description:
          'النظام يفهم السياق: نوع المكون، الخلفية، الوضع، ويعدل الألوان والتدرجات والظلال بشكل ذكي لضمان أفضل ظهور.',
      },
      {
        ruleType: 'report',
        action: 'generate',
        target: 'projectComponents',
        description: 'إصدار تقرير لحظي لكل تعديل، أي لون تم تغييره، أي مكون تم تحسينه، وأي مكون كان منخفض التباين.',
      },
    ],
  },
};

/**
 * Load theme settings from localStorage or return defaults
 */
export function loadThemeSettings(): AdvancedThemeSettings {
  if (typeof window === 'undefined') {
    return defaultThemeSettings;
  }

  try {
    const saved = localStorage.getItem('advanced_theme_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultThemeSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load theme settings:', error);
  }

  return defaultThemeSettings;
}

/**
 * Save theme settings to localStorage
 */
export function saveThemeSettings(settings: AdvancedThemeSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('advanced_theme_settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save theme settings:', error);
  }
}

/**
 * Get current theme colors based on mode
 */
export function getCurrentThemeColors(
  mode: 'light' | 'dark',
  settings: AdvancedThemeSettings = loadThemeSettings()
): ThemeColorConfig {
  return settings.themeManagement.themes[mode];
}


/**
 * Color Intelligence System - نظام الألوان الذكي
 * Automatic color contrast checking, adjustment, and optimization
 */

import type { AdvancedThemeSettings } from './theme-settings';
import { loadThemeSettings } from './theme-settings';

/**
 * Convert RGB to hex (helper function, defined first)
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

/**
 * Convert skewed color string (hex, rgb, rgba) to normalized hex
 */
function normalizeColor(color: string): string {
  if (!color || color === 'transparent') return '#000000';
  
  // Already hex format
  if (/^#([a-f\d]{6}|[a-f\d]{3})$/i.test(color)) {
    // Expand short hex (#fff -> #ffffff)
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return color;
  }

  // RGB/RGBA format: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return rgbToHex(r, g, b);
  }

  // Named colors - basic fallback
  const namedColors: Record<string, string> = {
    'white': '#ffffff',
    'black': '#000000',
    'red': '#ff0000',
    'green': '#008000',
    'blue': '#0000ff',
  };
  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()];
  }

  return '#000000'; // Fallback
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeColor(hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance (WCAG standard)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG standard)
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 1; // Default to worst contrast if colors are invalid
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1)
 */
export function meetsContrastStandard(
  foreground: string,
  background: string,
  minRatio: number = 4.5
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= minRatio;
}

/**
 * Adjust color to meet contrast requirements
 */
export function adjustColorForContrast(
  foreground: string,
  background: string,
  minRatio: number = 4.5,
  mode: 'light' | 'dark' = 'light'
): string {
  if (meetsContrastStandard(foreground, background, minRatio)) {
    return foreground;
  }

  const rgb = hexToRgb(foreground);
  if (!rgb) return foreground;

  // Adjust brightness based on mode
  const adjustment = mode === 'light' ? -20 : 20;
  const step = adjustment > 0 ? 10 : -10;
  let adjusted = { ...rgb };

  // Try adjusting until we meet contrast
  for (let i = 0; i < 20; i++) {
    adjusted.r = Math.max(0, Math.min(255, adjusted.r + step));
    adjusted.g = Math.max(0, Math.min(255, adjusted.g + step));
    adjusted.b = Math.max(0, Math.min(255, adjusted.b + step));

    const adjustedHex = rgbToHex(adjusted.r, adjusted.g, adjusted.b);
    if (meetsContrastStandard(adjustedHex, background, minRatio)) {
      return adjustedHex;
    }
  }

  // Fallback: use extreme contrast color
  return mode === 'light' ? '#000000' : '#ffffff';
}


/**
 * Check if color should be avoided (based on theme settings)
 */
export function shouldAvoidColor(
  color: string,
  avoidColors: string[] = []
): boolean {
  const normalized = color.toLowerCase().trim();
  return avoidColors.some((avoidColor) => avoidColor.toLowerCase() === normalized);
}

/**
 * Find replacement color from modern palette
 */
export function getReplacementColor(
  originalColor: string,
  mode: 'light' | 'dark',
  settings: AdvancedThemeSettings = loadThemeSettings()
): string {
  const themeColors = settings.themeManagement.themes[mode];
  const avoidColors = themeColors.avoidColors || [];

  // If color is not in avoid list, return as is
  if (!shouldAvoidColor(originalColor, avoidColors)) {
    return originalColor;
  }

  // Replace with appropriate color from modern palette
  if (mode === 'dark') {
    // Avoid dark navy/blues - use modern alternatives
    if (originalColor.toLowerCase() === '#000080' || originalColor.toLowerCase() === '#00008b') {
      return themeColors.primaryColor; // Use primary color instead
    }
    if (originalColor.toLowerCase() === '#222222') {
      return '#3a3a3a'; // Lighter gray
    }
  }

  return themeColors.primaryColor;
}

/**
 * Get adaptive accent color based on background
 */
export function getAdaptiveAccentColor(
  backgroundColor: string,
  mode: 'light' | 'dark',
  settings: AdvancedThemeSettings = loadThemeSettings()
): string {
  const themeColors = settings.themeManagement.themes[mode];
  const accentColors = themeColors.accentColors;

  // Find accent color with best contrast
  let bestAccent = accentColors[0];
  let bestRatio = 0;

  for (const accent of accentColors) {
    const ratio = getContrastRatio(accent, backgroundColor);
    if (ratio > bestRatio && ratio >= themeColors.contrastMinRatio) {
      bestRatio = ratio;
      bestAccent = accent;
    }
  }

  return bestAccent;
}

/**
 * Optimize shadow color based on theme mode
 */
export function getOptimizedShadow(mode: 'light' | 'dark', opacity: number = 0.1): string {
  if (mode === 'dark') {
    return `0 4px 6px -1px rgba(0, 0, 0, ${opacity * 3}), 0 2px 4px -2px rgba(0, 0, 0, ${opacity * 2})`;
  }
  return `0 4px 6px -1px rgba(0, 0, 0, ${opacity}), 0 2px 4px -2px rgba(0, 0, 0, ${opacity * 0.5})`;
}

/**
 * Optimize gradient based on theme and colors
 */
export function getOptimizedGradient(
  color1: string,
  color2: string,
  mode: 'light' | 'dark',
  angle: number = 135
): string {
  // Ensure both colors meet contrast if used as text
  const bgColor = mode === 'light' ? '#ffffff' : '#121212';
  const adjusted1 = adjustColorForContrast(color1, bgColor, 4.5, mode);
  const adjusted2 = adjustColorForContrast(color2, bgColor, 4.5, mode);

  return `linear-gradient(${angle}deg, ${adjusted1} 0%, ${adjusted2} 100%)`;
}

/**
 * Analyze component and return optimized styles
 */
export interface ComponentStyleAnalysis {
  color: string;
  backgroundColor: string;
  borderColor?: string;
  shadow?: string;
  gradient?: string;
  contrastRatio: number;
  meetsStandard: boolean;
  adjustments: string[];
}

export function analyzeComponentStyles(
  element: HTMLElement,
  mode: 'light' | 'dark',
  settings: AdvancedThemeSettings = loadThemeSettings()
): ComponentStyleAnalysis {
  const computedStyle = window.getComputedStyle(element);
  const rawColor = computedStyle.color;
  const rawBackgroundColor = computedStyle.backgroundColor || computedStyle.getPropertyValue('--background') || settings.themeManagement.themes[mode].backgroundColor;
  const rawBorderColor = computedStyle.borderColor;

  // Normalize colors to hex format (handle rgb/rgba/hex)
  const color = normalizeColor(rawColor);
  const backgroundColor = normalizeColor(rawBackgroundColor);
  const borderColor = rawBorderColor ? normalizeColor(rawBorderColor) : undefined;

  const adjustments: string[] = [];
  let adjustedColor = color;
  let adjustedBg = backgroundColor;

  // Check contrast
  const contrastRatio = getContrastRatio(color, backgroundColor);
  const meetsStandard = contrastRatio >= settings.themeManagement.themes[mode].contrastMinRatio;

  if (!meetsStandard && settings.themeManagement.colorIntelligence.autoContrast) {
    adjustedColor = adjustColorForContrast(color, backgroundColor, settings.themeManagement.themes[mode].contrastMinRatio, mode);
    if (adjustedColor !== color) {
      adjustments.push(`تم تعديل اللون من ${rawColor} إلى ${adjustedColor} لتحسين التباين`);
    }
  }

  // Check for avoided colors
  if (settings.themeManagement.colorIntelligence.dynamicReplacement) {
    const avoidColors = settings.themeManagement.themes[mode].avoidColors || [];
    if (shouldAvoidColor(adjustedColor, avoidColors)) {
      adjustedColor = getReplacementColor(adjustedColor, mode, settings);
      adjustments.push(`تم استبدال اللون ${rawColor} بلون حديث: ${adjustedColor}`);
    }
  }

  // Generate optimized shadow
  let shadow: string | undefined;
  if (settings.themeManagement.colorIntelligence.shadowOptimization && settings.themeManagement.themes[mode].dynamicShadows) {
    shadow = getOptimizedShadow(mode, 0.1);
  }

  // Generate optimized gradient if needed
  let gradient: string | undefined;
  if (settings.themeManagement.colorIntelligence.gradientOptimization && settings.themeManagement.themes[mode].gradientSupport) {
    const themeColors = settings.themeManagement.themes[mode];
    gradient = getOptimizedGradient(themeColors.primaryColor, themeColors.accentColors[0], mode);
  }

  return {
    color: adjustedColor,
    backgroundColor: adjustedBg,
    borderColor,
    shadow,
    gradient,
    contrastRatio,
    meetsStandard,
    adjustments,
  };
}


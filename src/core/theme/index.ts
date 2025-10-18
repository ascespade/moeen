// Theme stub - full implementation
export const useTheme = () => ({
  theme: 'light' as 'light' | 'dark' | 'system',
  setTheme: (theme: 'light' | 'dark' | 'system') => {},
  toggleTheme: () => {},
  isDark: false,
  isLight: true,
  isSystem: false,
  resolvedTheme: 'light' as 'light' | 'dark',
  isLoading: false,
  getThemeClass: () => 'light',
  getThemeValue: () => 'light',
});

export const useThemeAware = () => ({
  resolvedTheme: 'light' as 'light' | 'dark',
});
export const useDesignTokens = () => ({ colors: {} });
export const useThemeColors = () => ({});
export const ThemeProvider = ({ children }: any) => children;

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

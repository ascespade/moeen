// Theme stub - full implementation
export const useTheme = () => ({
  theme: 'light' as 'light' | 'dark' | 'system',
  setTheme: (theme: 'light' | 'dark' | 'system') => {},
  toggleTheme: () => {},
  isDark: false,
  isLight: true,
  isSystem: false,
  resolvedTheme: 'light' as 'light' | 'dark',
  isLoading: false
});

export const useThemeAware = useTheme;
export const useDesignTokens = () => ({});
export const useThemeColors = () => ({});
export const ThemeProvider = ({ children }: any) => children;

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

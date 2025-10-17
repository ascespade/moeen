// Theme stub - minimal implementation
export const useTheme = () => ({
  theme: 'light' as 'light' | 'dark' | 'system',
  setTheme: (theme: 'light' | 'dark' | 'system') => {},
  isDark: false,
  isLight: true,
  isSystem: false
});

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

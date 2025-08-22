// Unified theme system exports (primary)
export { ThemeProvider, useThemeContext, useTheme, type ThemeProviderProps } from './ThemeProvider';
export * from './types';
export * from './themes';
export * from './hooks';

// Legacy theme system exports for backward compatibility
export { ThemeProvider as LegacyThemeProvider, useTheme as useLegacyTheme } from './theme-provider';
export { ThemeSwitcher as LegacyThemeSwitcher } from './theme-switcher';
export * from './theme-validator';
export * from './theme-sync';

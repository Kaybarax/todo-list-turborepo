/**
 * Theme System
 * Central export for theme system components and utilities
 */

export { default as theme } from './themes';
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';
export type { Theme } from './types';
export { validateTheme } from './validation';

// Eva Design exports
export { EvaProvider } from './EvaProvider';
export { useEvaTheme } from './useEvaTheme';
export { lightTheme as evaLightTheme, darkTheme as evaDarkTheme } from './eva-theme';
export { customMapping } from './eva-mapping';
export type { ThemeMode as EvaThemeMode } from './useEvaTheme';

// Theme Configurations
export { lightTheme, darkTheme, themes, getTheme } from './themes';

// Theme Validation
export { validateColorTokens, getSafeTheme, ThemeValidationError } from './validation';

// Default export is light theme for backward compatibility
export { lightTheme as default } from './themes/light';

// Legacy exports for backward compatibility
export { lightColors as colors } from '../tokens/colors';
export { spacing } from '../tokens/spacing';
export { fontSizes } from '../tokens/typography';
export { fontWeights } from '../tokens/typography';
export { borders as borderRadius } from '../tokens/borders';
export { shadows } from '../tokens/shadows';

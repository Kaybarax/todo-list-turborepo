/**
 * Theme System
 * Central export for theme system components and utilities
 */

// Theme Provider and Hook
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';

// Theme Types
export type { Theme, ThemeName, ThemeContextValue } from './types';

// Theme Configurations
export { lightTheme, darkTheme, themes, getTheme } from './themes';

// Theme Validation
export { validateTheme, validateColorTokens, getSafeTheme, ThemeValidationError } from './validation';

// Default export is light theme for backward compatibility
export { lightTheme as default } from './themes/light';

// Legacy exports for backward compatibility
export { lightColors as colors } from '../tokens/colors';
export { spacing } from '../tokens/spacing';
export { fontSizes } from '../tokens/typography';
export { fontWeights } from '../tokens/typography';
export { borders as borderRadius } from '../tokens/borders';
export { shadows } from '../tokens/shadows';

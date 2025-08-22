/**
 * Design Tokens
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borders';
export * from './breakpoints';

export { default as colors, lightColors, darkColors } from './colors';
export { default as typography } from './typography';
export { default as spacing } from './spacing';
export { default as shadows } from './shadows';
export { default as borders } from './borders';
export { default as breakpoints } from './breakpoints';

// Combined design tokens interface
export interface DesignTokens {
  colors: typeof import('./colors').lightColors;
  typography: typeof import('./typography').typography;
  spacing: typeof import('./spacing').spacing;
  shadows: typeof import('./shadows').shadows;
  borders: typeof import('./borders').borders;
  breakpoints: typeof import('./breakpoints').breakpoints;
}

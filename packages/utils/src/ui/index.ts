/**
 * UI Utilities
 * Organized exports for all UI-related utilities
 */

// Web UI utilities
export * as web from './web';

// Mobile UI utilities
export * as mobile from './mobile';

// Direct exports for common web utilities (for backward compatibility)
export {
  // Accessibility
  ariaAttr,
  dataAttr,
  mergeRefs,
  isFocusable,

  // Class utilities
  cn,
  cv,
  cvm,

  // Responsive
  breakpoints,
  mqUp,
  mqDown,
  matches,
  isUp,
  isDown,

  // Tokens
  getToken,
  getTokenWithFallback,
  generateCSSCustomProperties,
  validateTokenStructure,
  mergeTokenThemes,
  TOKEN_CATEGORIES,
  COLOR_SHADES,
  SPACING_SCALE,
} from './web';

// Type exports
export type { BreakpointKey } from './web/responsive';

export type { BasicDesignTokens } from './web/tokens';

export type { VariantProps } from './web/cva';

/**
 * Design Tokens Hook for Mobile App
 * Provides easy access to design system tokens with fallbacks
 */

import { lightColors, spacing, typography, borders, shadows } from '@todo/ui-mobile/lib/tokens';

export const useDesignTokens = () => {
  return {
    // Colors
    colors: {
      background: lightColors.background,
      surface: lightColors.surface,
      primary: lightColors.primary[500],
      secondary: lightColors.secondary[500],
      success: lightColors.success[500],
      warning: lightColors.warning[500],
      error: lightColors.error[500],
      text: {
        primary: lightColors.text.primary,
        secondary: lightColors.text.secondary,
        disabled: lightColors.text.disabled,
        inverse: lightColors.text.inverse,
      },
      border: {
        default: lightColors.border.default,
        focus: lightColors.border.focus,
        error: lightColors.border.error,
      },
      neutral: lightColors.neutral,
    },

    // Spacing
    spacing: {
      xs: spacing.xs,
      sm: spacing.sm,
      md: spacing.md,
      lg: spacing.lg,
      xl: spacing.xl,
      xxl: spacing.xxl,
      xxxl: spacing.xxxl,
      xxxxl: spacing.xxxxl,
    },

    // Typography
    typography: {
      fontSize: typography.fontSizes,
      fontWeight: typography.fontWeights,
      lineHeight: typography.lineHeights,
      letterSpacing: typography.letterSpacing,
    },

    // Borders
    borders: {
      radius: borders.radius,
      width: borders.width,
    },

    // Shadows
    shadows: shadows,
  };
};

export default useDesignTokens;

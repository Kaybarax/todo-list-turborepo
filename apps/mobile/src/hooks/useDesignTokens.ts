/**
 * Design Tokens Hook for Mobile App
 * Provides easy access to design system tokens with theme support
 */

import { useTheme, lightTheme } from '@todo/ui-mobile';

export const useDesignTokens = () => {
  // Try to use theme context, fallback to light theme if not available
  let theme;
  try {
    const themeContext = useTheme();
    theme = themeContext?.theme || lightTheme;
  } catch {
    // Fallback if ThemeProvider is not available
    theme = lightTheme;
  }

  return {
    // Colors
    colors: {
      background: theme.colors.background,
      surface: theme.colors.surface,
      primary: theme.colors.primary[500],
      secondary: theme.colors.secondary[500],
      success: theme.colors.success[500],
      warning: theme.colors.warning[500],
      error: theme.colors.error[500],
      text: {
        primary: theme.colors.text.primary,
        secondary: theme.colors.text.secondary,
        disabled: theme.colors.text.disabled,
        inverse: theme.colors.text.inverse,
      },
      border: {
        default: theme.colors.border.default,
        focus: theme.colors.border.focus,
        error: theme.colors.border.error,
      },
      neutral: theme.colors.neutral,
    },

    // Spacing
    spacing: {
      xs: theme.spacing.xs,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
      xl: theme.spacing.xl,
      xxl: theme.spacing.xxl,
      xxxl: theme.spacing.xxxl,
      xxxxl: theme.spacing.xxxxl,
    },

    // Typography
    typography: {
      fontSize: theme.typography.fontSizes,
      fontWeight: theme.typography.fontWeights,
      lineHeight: theme.typography.lineHeights,
      letterSpacing: theme.typography.letterSpacing,
    },

    // Borders
    borders: {
      radius: theme.borders.radius,
      width: theme.borders.width,
    },

    // Shadows
    shadows: theme.shadows,
  };
};

export default useDesignTokens;

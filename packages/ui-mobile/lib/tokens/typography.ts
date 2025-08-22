/**
 * Typography Design Tokens
 * Standardized font families, sizes, weights, and line heights
 */

export interface TypographyTokens {
  fontFamilies: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    xxxxl: number;
  };
  fontWeights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
  textVariants: {
    h1: TypographyVariant;
    h2: TypographyVariant;
    h3: TypographyVariant;
    h4: TypographyVariant;
    body1: TypographyVariant;
    body2: TypographyVariant;
    caption: TypographyVariant;
    overline: TypographyVariant;
  };
}

export interface TypographyVariant {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}

// Font families
export const fontFamilies = {
  primary: 'System', // iOS: San Francisco, Android: Roboto
  secondary: 'System', // For display text
  monospace: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Font sizes (in pixels)
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  xxxxl: 36,
};

// Font weights
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Line heights (multipliers)
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

// Letter spacing (in pixels)
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
};

// Text variants with semantic naming
export const textVariants = {
  h1: {
    fontSize: fontSizes.xxxxl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
  },
  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
  },
  body1: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  body2: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  overline: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
};

export const typography: TypographyTokens = {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  textVariants,
};

export default typography;

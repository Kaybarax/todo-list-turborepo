/**
 * Style Dictionary Token Types
 * Generated type definitions for design tokens
 */

// Core token categories
export interface ColorTokens {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

export interface SpacingTokens {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
  '7': string;
  '8': string;
  '9': string;
  '10': string;
  '11': string;
  '12': string;
  '14': string;
  '16': string;
  '20': string;
  '24': string;
  '28': string;
  '32': string;
  '36': string;
  '40': string;
  '44': string;
  '48': string;
  '52': string;
  '56': string;
  '60': string;
  '64': string;
  '72': string;
  '80': string;
  '96': string;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
    '7xl': string;
    '8xl': string;
    '9xl': string;
  };
  fontWeight: {
    thin: string;
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}

export interface BorderTokens {
  radius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  width: {
    0: string;
    1: string;
    2: string;
    4: string;
    8: string;
  };
}

export interface ShadowTokens {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

// Semantic token types
export interface SemanticTokens {
  themes: {
    light: ThemeTokens;
    dark: ThemeTokens;
  };
  components: ComponentTokens;
}

export interface ThemeTokens {
  primary: string;
  'primary-focus': string;
  'primary-content': string;
  secondary: string;
  'secondary-focus': string;
  'secondary-content': string;
  accent: string;
  'accent-focus': string;
  'accent-content': string;
  neutral: string;
  'neutral-focus': string;
  'neutral-content': string;
  'base-100': string;
  'base-200': string;
  'base-300': string;
  'base-content': string;
  info: string;
  'info-content': string;
  success: string;
  'success-content': string;
  warning: string;
  'warning-content': string;
  error: string;
  'error-content': string;
}

export interface ComponentTokens {
  button: {
    padding: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
  };
  input: {
    padding: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    borderWidth: string;
  };
  card: {
    padding: string;
    borderRadius: string;
    shadow: string;
  };
  modal: {
    borderRadius: string;
    shadow: string;
    backdrop: string;
  };
  alert: {
    padding: string;
    borderRadius: string;
    fontSize: string;
  };
  badge: {
    padding: string;
    borderRadius: string;
    fontSize: string;
  };
  progress: {
    height: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: string;
  };
}

// Main token interface
export interface DesignTokens {
  color: ColorTokens;
  space: SpacingTokens;
  typography: TypographyTokens;
  border: BorderTokens;
  shadow: ShadowTokens;
  semantic: SemanticTokens;
}

// Token validation types
export type ColorTokenName = keyof ColorTokens;
export type ColorTokenShade = keyof ColorTokens[ColorTokenName];
export type SpacingTokenName = keyof SpacingTokens;
export type FontSizeName = keyof TypographyTokens['fontSize'];
export type FontWeightName = keyof TypographyTokens['fontWeight'];
export type BorderRadiusName = keyof BorderTokens['radius'];
export type ShadowName = keyof ShadowTokens;

// Utility types for token access
export type TokenPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${TokenPath<T[K]>}` : K) : never;
    }[keyof T]
  : never;

export type TokenValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? TokenValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Token validation utilities
export type ValidTokenPath = TokenPath<DesignTokens>;
export type GetTokenValue<P extends ValidTokenPath> = TokenValue<DesignTokens, P>;

// Export token access helper type
export interface TokenAccessor {
  <P extends ValidTokenPath>(path: P): GetTokenValue<P>;
}

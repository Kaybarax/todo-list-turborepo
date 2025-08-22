// Design token TypeScript interfaces

export interface ColorScale {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500: string; // Base color
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
}

export interface SemanticColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
}

export type SpacingScale = Record<string, string>;
export type BorderRadiusScale = Record<string, string>;
export type ShadowScale = Record<string, string>;
export type Breakpoints = Record<string, string>;
export type ZIndexScale = Record<string, number>;
export type TransitionTokens = Record<string, string>;

export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    semantic: SemanticColors;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;
    fontWeight?: Record<string, string | number>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
  };
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  breakpoints?: Breakpoints;
  zIndex?: ZIndexScale;
  transitions?: TransitionTokens;
}

/**
 * Theme Type Definitions
 */

import type { ColorTokens } from '../tokens/colors';
import type { TypographyTokens } from '../tokens/typography';
import type { SpacingTokens } from '../tokens/spacing';
import type { ShadowTokens } from '../tokens/shadows';
import type { BorderTokens } from '../tokens/borders';
import type { BreakpointTokens } from '../tokens/breakpoints';

export interface Theme {
  name: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  breakpoints: BreakpointTokens;
}

export type ThemeName = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

/**
 * Theme Provider Component (Legacy shim)
 *
 * This is now a thin proxy around EnhancedThemeProvider to ensure there's a
 * single source of truth for theming (including Eva Design). It keeps the
 * legacy API surface to avoid breaking changes.
 */

import React, { type ReactNode } from 'react';

import { EnhancedThemeProvider, EnhancedThemeContext } from './EnhancedThemeProvider';
import { type ThemeName } from './types';

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  followSystemTheme?: boolean;
}

// Backward-compatible alias so consumers importing ThemeContext keep working
export const ThemeContext = EnhancedThemeContext as any;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
  followSystemTheme = true,
}) => {
  return (
    <EnhancedThemeProvider
      initialTheme={initialTheme}
      initialEvaTheme={initialTheme}
      followSystemTheme={followSystemTheme}
      enableEvaDesign={true}
    >
      {children}
    </EnhancedThemeProvider>
  );
};

export default ThemeProvider;

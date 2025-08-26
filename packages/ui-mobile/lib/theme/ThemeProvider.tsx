/**
 * Theme Provider Component
 * Provides theme context and manages theme switching
 */

import React, { createContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

import { lightTheme, darkTheme } from './themes';
import { type Theme, type ThemeName, type ThemeContextValue } from './types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  followSystemTheme?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
  followSystemTheme = true,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  // Get current theme object
  const theme: Theme = themeName === 'dark' ? darkTheme : lightTheme;

  // Handle system theme changes
  useEffect(() => {
    if (!followSystemTheme) return;

    const handleSystemThemeChange = (preferences: { colorScheme: ColorSchemeName }) => {
      const systemTheme = preferences.colorScheme === 'dark' ? 'dark' : 'light';
      setThemeName(systemTheme);
    };

    // Set initial theme based on system
    const systemColorScheme = Appearance.getColorScheme();
    if (systemColorScheme) {
      setThemeName(systemColorScheme === 'dark' ? 'dark' : 'light');
    }

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(handleSystemThemeChange);

    return () => subscription?.remove();
  }, [followSystemTheme]);

  const setTheme = useCallback((newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName(current => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue: ThemeContextValue = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export { ThemeContext };
export default ThemeProvider;

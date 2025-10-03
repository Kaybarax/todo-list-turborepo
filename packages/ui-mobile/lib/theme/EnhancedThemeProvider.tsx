/**
 * Enhanced Theme Provider Component
 * Integrates existing theme system with Eva Design theming
 */

import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React, { createContext, useState, useCallback, type ReactNode, useEffect, useMemo } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

import { customMapping } from './eva-mapping';
import { lightTheme as evaLightTheme, darkTheme as evaDarkTheme } from './eva-theme';
import { lightTheme, darkTheme } from './themes';
import { type Theme, type ThemeName } from './types';
import { validateTheme, ThemeValidationError } from './validation';

export type EnhancedThemeMode = 'light' | 'dark';

export interface EnhancedThemeContextValue {
  // Legacy theme system
  theme: Theme;
  themeName: ThemeName;
  setTheme: (newThemeName: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;

  // Eva Design integration
  evaTheme: Record<string, any>;
  evaThemeMode: EnhancedThemeMode;
  setEvaTheme: (mode: EnhancedThemeMode) => void;
  toggleEvaTheme: () => void;
  updateCustomTheme: (customTheme: Record<string, any>) => void;

  // Theme validation and error handling
  isThemeValid: boolean;
  themeError: ThemeValidationError | null;
  validateCurrentTheme: () => boolean;
}

const ENHANCED_THEME_STORAGE_KEY = '@enhanced_theme_mode';
const LEGACY_THEME_STORAGE_KEY = 'theme-mode';

const EnhancedThemeContext = createContext<EnhancedThemeContextValue | undefined>(undefined);

export interface EnhancedThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  initialEvaTheme?: EnhancedThemeMode;
  followSystemTheme?: boolean;
  enableEvaDesign?: boolean;
  customTheme?: Record<string, any>;
  onThemeError?: (error: ThemeValidationError) => void;
}

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  initialTheme = 'light',
  initialEvaTheme = 'light',
  followSystemTheme = true,
  enableEvaDesign = true,
  customTheme = {},
  onThemeError,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const [evaThemeMode, setEvaThemeModeState] = useState<EnhancedThemeMode>(initialEvaTheme);
  const [customThemeState, setCustomThemeState] = useState<Record<string, any>>(customTheme);
  const [isThemeValid, setIsThemeValid] = useState(true);
  const [themeError, setThemeError] = useState<ThemeValidationError | null>(null);

  // Get current theme objects
  const theme: Theme = themeName === 'dark' ? darkTheme : lightTheme;
  const baseEvaTheme = evaThemeMode === 'dark' ? evaDarkTheme : evaLightTheme;
  const evaTheme = useMemo(() => ({ ...baseEvaTheme, ...customThemeState }), [baseEvaTheme, customThemeState]);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme =
          (await AsyncStorage.getItem(ENHANCED_THEME_STORAGE_KEY)) ??
          (await AsyncStorage.getItem(LEGACY_THEME_STORAGE_KEY));
        if (storedTheme) {
          try {
            // Try JSON first (new format)
            const parsedTheme = JSON.parse(storedTheme);
            if (parsedTheme.themeName) {
              setThemeName(parsedTheme.themeName);
            }
            if (parsedTheme.evaThemeMode) {
              setEvaThemeModeState(parsedTheme.evaThemeMode);
            }
            if (parsedTheme.customTheme) {
              setCustomThemeState(parsedTheme.customTheme);
            }
          } catch {
            // Fallback: legacy string value ('light' | 'dark')
            const legacyValue = storedTheme as ThemeName;
            setThemeName(legacyValue);
            setEvaThemeModeState(legacyValue);
          }
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      }
    };

    loadTheme();
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        const themeData = {
          themeName,
          evaThemeMode,
          customTheme: customThemeState,
        };
        await AsyncStorage.setItem(ENHANCED_THEME_STORAGE_KEY, JSON.stringify(themeData));
        // Also write legacy key for backward compatibility
        await AsyncStorage.setItem(LEGACY_THEME_STORAGE_KEY, themeName);
      } catch (error) {
        console.warn('Failed to save theme to storage:', error);
      }
    };

    saveTheme();
  }, [themeName, evaThemeMode, customThemeState]);

  // Handle system theme changes
  useEffect(() => {
    if (!followSystemTheme) return;

    const handleSystemThemeChange = (preferences: { colorScheme: ColorSchemeName }) => {
      const systemTheme = preferences.colorScheme === 'dark' ? 'dark' : 'light';
      setThemeName(systemTheme);
      setEvaThemeModeState(systemTheme);
    };

    // Set initial theme based on system
    const systemColorScheme = Appearance.getColorScheme();
    if (systemColorScheme) {
      const systemTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
      setThemeName(systemTheme);
      setEvaThemeModeState(systemTheme);
    }

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(handleSystemThemeChange);

    return () => subscription?.remove();
  }, [followSystemTheme]);

  // Theme validation
  const validateCurrentTheme = useCallback((): boolean => {
    try {
      validateTheme(theme);
      setIsThemeValid(true);
      setThemeError(null);
      return true;
    } catch (error) {
      const themeError =
        error instanceof ThemeValidationError ? error : new ThemeValidationError('Unknown theme validation error');
      setIsThemeValid(false);
      setThemeError(themeError);
      onThemeError?.(themeError);
      return false;
    }
  }, [theme, onThemeError]);

  // Validate theme when it changes
  useEffect(() => {
    validateCurrentTheme();
  }, [validateCurrentTheme]);

  // Theme management functions
  const setTheme = useCallback((newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName(current => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const setEvaTheme = useCallback((mode: EnhancedThemeMode) => {
    setEvaThemeModeState(mode);
  }, []);

  const toggleEvaTheme = useCallback(() => {
    setEvaThemeModeState(current => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const updateCustomTheme = useCallback((newCustomTheme: Record<string, any>) => {
    setCustomThemeState(newCustomTheme);
  }, []);

  const contextValue: EnhancedThemeContextValue = {
    // Legacy theme system
    theme,
    themeName,
    setTheme,
    toggleTheme,
    isDark: themeName === 'dark',

    // Eva Design integration
    evaTheme,
    evaThemeMode,
    setEvaTheme,
    toggleEvaTheme,
    updateCustomTheme,

    // Theme validation and error handling
    isThemeValid,
    themeError,
    validateCurrentTheme,
  };

  const content = <EnhancedThemeContext.Provider value={contextValue}>{children}</EnhancedThemeContext.Provider>;

  // Wrap with Eva Design ApplicationProvider if enabled
  if (enableEvaDesign) {
    const baseEvaTheme = evaThemeMode === 'dark' ? eva.dark : eva.light;
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...baseEvaTheme, ...evaTheme }} customMapping={customMapping}>
          {content}
        </ApplicationProvider>
      </>
    );
  }

  return content;
};

export { EnhancedThemeContext };
export default EnhancedThemeProvider;

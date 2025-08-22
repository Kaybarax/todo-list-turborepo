/**
 * Eva Design Theme Hook
 * Provides theme switching and persistence utilities
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './eva-theme';

export type ThemeMode = 'light' | 'dark';

interface UseEvaThemeReturn {
  theme: Record<string, any>;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  updateTheme: (customTheme: Record<string, any>) => void;
}

const THEME_STORAGE_KEY = '@eva_theme_mode';

export const useEvaTheme = (initialTheme: ThemeMode = 'light'): UseEvaThemeReturn => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  const [customTheme, setCustomTheme] = useState<Record<string, any>>({});

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setThemeMode(storedTheme as ThemeMode);
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
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
      } catch (error) {
        console.warn('Failed to save theme to storage:', error);
      }
    };

    saveTheme();
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const updateTheme = useCallback((newCustomTheme: Record<string, any>) => {
    setCustomTheme(newCustomTheme);
  }, []);

  const baseTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  const theme = { ...baseTheme, ...customTheme };

  return {
    theme,
    themeMode,
    toggleTheme,
    setTheme,
    updateTheme,
  };
};

export default useEvaTheme;

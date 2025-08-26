/**
 * useTheme Hook
 * Custom hook for accessing theme values and theme switching functionality
 */

import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';
import { type ThemeContextValue } from './types';

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;

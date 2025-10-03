/**
 * Theme Hook (Legacy)
 * Provides access to the current theme context
 *
 * @deprecated Use useEnhancedTheme instead for full Eva Design integration
 * @see useEnhancedTheme for the recommended approach
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

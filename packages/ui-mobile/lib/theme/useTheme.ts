/**
 * Theme Hook (Legacy)
 * Provides access to the current theme context
 *
 * @deprecated Use useEnhancedTheme instead for full Eva Design integration
 * @see useEnhancedTheme for the recommended approach
 */

import { useContext } from 'react';

import { EnhancedThemeContext } from './EnhancedThemeProvider';
import { type EnhancedThemeContextValue } from './EnhancedThemeProvider';

export const useTheme = (): EnhancedThemeContextValue => {
  const context = useContext(EnhancedThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;

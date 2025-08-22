/**
 * Enhanced Theme Hook
 * Provides access to both legacy and Eva Design theme systems
 */

import { useContext } from 'react';
import { EnhancedThemeContext, EnhancedThemeContextValue } from './EnhancedThemeProvider';

export const useEnhancedTheme = (): EnhancedThemeContextValue => {
  const context = useContext(EnhancedThemeContext);

  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }

  return context;
};

export default useEnhancedTheme;

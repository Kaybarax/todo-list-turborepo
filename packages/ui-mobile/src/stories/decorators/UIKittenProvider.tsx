import { type Decorator } from '@storybook/react';
import React from 'react';
import { EnhancedThemeProvider } from '../../../lib';

/**
 * Storybook decorator supplying the full EnhancedThemeProvider (includes Eva ApplicationProvider).
 * This replaces the earlier shim which caused missing style context errors ("appearances" undefined).
 */
export const withUIKitten: Decorator = Story => (
  <EnhancedThemeProvider followSystemTheme={false} enableEvaDesign>
    <Story />
  </EnhancedThemeProvider>
);

export default withUIKitten;

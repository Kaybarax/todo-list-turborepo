import * as eva from '@eva-design/eva';
import { type Decorator } from '@storybook/react';
import { ApplicationProvider } from '@ui-kitten/components';
import React from 'react';

// Best-effort dynamic import of EnhancedThemeProvider; non-fatal if missing.
let EnhancedThemeProvider: React.ComponentType<any> | null = null;
try {
  EnhancedThemeProvider = require('../../lib/theme').EnhancedThemeProvider;
} catch {
  EnhancedThemeProvider = null;
}

/**
 * Global Storybook decorator for providing UI Kitten + (optional) enhanced theme context.
 * Keeps individual story files free from repetitive provider boilerplate.
 */
export const withUIKitten: Decorator = Story => {
  const story = <Story />;
  const themed = EnhancedThemeProvider ? (
    <EnhancedThemeProvider followSystemTheme={false}>{story}</EnhancedThemeProvider>
  ) : (
    story
  );
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      {themed}
    </ApplicationProvider>
  );
};

export default withUIKitten;

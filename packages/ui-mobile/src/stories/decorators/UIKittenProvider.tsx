import * as eva from '@eva-design/eva';
import { type Decorator } from '@storybook/react';
// Some bundlers / ESM interop for @ui-kitten/components do not expose named exports consistently.
// Import the module namespace and access ApplicationProvider off it for resilience.
// Using a local shim to avoid CJS/ESM interop crash ("exports is not defined") from @ui-kitten/components under Vite.
import * as UIKitten from '../shims/ui-kitten';
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
  const Provider = (UIKitten as any).ApplicationProvider ?? (UIKitten as any).default?.ApplicationProvider;
  if (!Provider) {
    // Fallback: render story with a warning banner if provider missing
    return (
      <div style={{ border: '2px solid #f39c12', padding: 12 }}>
        <strong>UI Kitten provider unavailable:</strong> Unable to locate ApplicationProvider export. Rendering story
        without theme context.
        <div style={{ marginTop: 12 }}>{themed}</div>
      </div>
    );
  }
  return (
    <Provider {...eva} theme={eva.light}>
      {themed}
    </Provider>
  );
};

export default withUIKitten;

// Unified React Native shim for Storybook (web) environment.
// Re-exports react-native-web while supplying missing native-only symbols expected by some libraries.
import * as RNWeb from 'react-native-web';

export * from 'react-native-web';

// TurboModuleRegistry stub (some RN libs attempt to access this during initialization)
export const TurboModuleRegistry = {
  get(_: string) {
    return undefined;
  },
  getEnforcing(name: string) {
    throw new Error(`TurboModule '${name}' not available in web Storybook shim.`);
  },
};

// Provide default export for any code doing default import (rare but safer)
export default {
  ...RNWeb,
  TurboModuleRegistry,
};

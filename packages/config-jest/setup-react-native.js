// Setup for React Native Jest tests
// This file handles Jest 30 compatibility issues with React Native

// Set up global mocks for React Native
global.__DEV__ = true;
global.__TEST__ = true;

// Mock React Native modules that might cause issues
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Use React Native's real Platform; we provide PlatformConstants via TurboModule mock below

// Mock problematic React Native polyfills
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  setGlobalHandler: () => {},
  getGlobalHandler: () => null,
}));

// Run React Native's official Jest setup after stubbing the error-guard polyfill
try {
  // This sets up NativeModules, UIManager, mocks for core components, etc.
  // We stubbed '@react-native/js-polyfills/error-guard' above to avoid ESM issues.
  require('react-native/jest/setup');
} catch {
  // noop if not available
}

// Fix for jest-expo setup issues with React Native 0.76+
global.ErrorUtils = global.ErrorUtils || {
  setGlobalHandler: () => {},
  getGlobalHandler: () => null,
};

// Ensure Platform module yields stable values

// Provide a default BatchedBridge config to silence invariants
global.__fbBatchedBridgeConfig = global.__fbBatchedBridgeConfig || {
  remoteModuleConfig: [],
  localModulesConfig: {},
};

// Mock TurboModuleRegistry accessors
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const deviceConstants = {
    // Minimal Dimensions shape used by RN during initialization
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 2 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
    },
  };
  const platformConstantsIOS = {
    isTesting: true,
    reactNativeVersion: { major: 0, minor: 81, patch: 4, prerelease: null },
    forceTouchAvailable: false,
    osVersion: '17.0',
    systemName: 'iOS',
    interfaceIdiom: 'phone',
    isMacCatalyst: false,
  };

  const makeModule = name => {
    if (name === 'NativeDeviceInfo' || name === 'DeviceInfo') {
      return { getConstants: () => deviceConstants };
    }
    if (name === 'PlatformConstants') {
      return { getConstants: () => platformConstantsIOS };
    }
    return { getConstants: () => ({}) };
  };

  return {
    getEnforcing: name => makeModule(name),
    get: name => makeModule(name),
  };
});

// Setup for React Native Jest tests
// This file handles Jest 30 compatibility issues with React Native

// Set up global mocks for React Native
global.__DEV__ = true;
global.__TEST__ = true;

// Mock React Native modules that might cause issues
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock problematic React Native polyfills
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  setGlobalHandler: () => {},
  getGlobalHandler: () => null,
}));

// Mock React Native setup file that imports the problematic polyfill
jest.mock('react-native/jest/setup', () => {});

// Fix for jest-expo setup issues with React Native 0.76+
global.ErrorUtils = global.ErrorUtils || {
  setGlobalHandler: () => {},
  getGlobalHandler: () => null,
};
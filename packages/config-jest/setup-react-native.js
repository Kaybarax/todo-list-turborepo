// Setup for React Native Jest tests
// This file handles Jest 30 compatibility issues with React Native

// Mock React Native polyfills that contain Flow syntax
jest.mock('@react-native/js-polyfills/error-guard', () => ({}));

// Set up global mocks for React Native
global.__DEV__ = true;
global.__TEST__ = true;

// Mock React Native modules that might cause issues
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
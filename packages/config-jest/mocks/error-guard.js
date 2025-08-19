// Mock for @react-native/js-polyfills/error-guard
// This file contains Flow syntax that Jest can't parse

const mockErrorGuard = {
  setGlobalHandler: () => {},
  getGlobalHandler: () => null,
};

module.exports = mockErrorGuard;

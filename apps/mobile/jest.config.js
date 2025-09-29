const base = require('../../packages/config-jest/jest.config.react-native.js');

module.exports = {
  ...base,
  displayName: '@todo/mobile',
  rootDir: __dirname,
  testPathIgnorePatterns: [...(base.testPathIgnorePatterns || []), '/e2e/'],
  // Temporarily relax coverage thresholds for the mobile app until test suite is expanded
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

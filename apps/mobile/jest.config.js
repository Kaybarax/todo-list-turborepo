const baseConfig = require('@todo/config-jest/jest.config.react-native.js');

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [
    '<rootDir>/../../packages/config-jest/setup-tests-react-native.js',
  ],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};
const baseConfig = require('@todo/config-jest/jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'Services',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/utils/(.*)$': '<rootDir>/../../packages/utils/src/$1',
    '^@todo/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};

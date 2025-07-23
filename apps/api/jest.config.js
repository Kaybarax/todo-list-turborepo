const baseConfig = require('@todo/config-jest/jest.config.nestjs.js');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};
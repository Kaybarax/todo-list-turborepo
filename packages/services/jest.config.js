const baseConfig = require('@todo/config-jest/jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'Services',
  testEnvironment: 'node',
};
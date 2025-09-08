// Jest configuration for the ingestion service leveraging shared monorepo base
const base = require('../../packages/config-jest/jest.config.node');

const { globalSetup, globalTeardown, ...rest } = base;

module.exports = {
  ...rest,
  rootDir: __dirname,
  displayName: 'ingestion',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // Temporary relaxed coverage thresholds until full test suite stabilises
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // Ingestion service currently has no DB setup scripts; can add later if needed
};

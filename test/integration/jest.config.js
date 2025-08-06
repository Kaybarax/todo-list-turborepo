const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.json');

module.exports = {
  displayName: 'Integration Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/test/integration/**/*.test.ts',
    '<rootDir>/test/integration/**/*.spec.ts',
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/test/integration/setup.ts',
  ],
  
  // Module name mapping for TypeScript paths
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/',
    }),
    '^@todo/(.*)$': '<rootDir>/packages/$1/src',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        ...compilerOptions,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'packages/services/src/blockchain/**/*.ts',
    'apps/web/src/services/**/*.ts',
    'apps/mobile/src/services/**/*.ts',
    '!**/*.d.ts',
    '!**/*.test.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
  ],
  
  coverageDirectory: '<rootDir>/test/integration/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test timeout for blockchain operations
  testTimeout: 30000,
  
  // Global setup and teardown
  globalSetup: '<rootDir>/test/integration/global-setup.ts',
  globalTeardown: '<rootDir>/test/integration/global-teardown.ts',
  
  // Verbose output for debugging
  verbose: true,
  
  // Fail fast on first test failure
  bail: false,
  
  // Maximum number of concurrent test suites
  maxConcurrency: 3,
  
  // Environment variables
  setupFiles: ['<rootDir>/test/integration/env-setup.ts'],
  
  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Test result processor
  testResultsProcessor: '<rootDir>/test/integration/results-processor.js',
};
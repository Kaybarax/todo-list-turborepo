module.exports = {
  ...require('@todo/config-jest/jest.config.node'),
  displayName: '@todo/utils',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
  ],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.[jt]s', '<rootDir>/src/**/?(*.)+(spec|test).[jt]s'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

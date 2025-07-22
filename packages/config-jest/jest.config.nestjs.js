const baseConfig = require('./jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'NestJS',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.[jt]s',
    '**/?(*.)+(spec|test).[jt]s'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/app.module.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/(.*)$': '<rootDir>/../../packages/$1/src'
  },
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json'
      }
    ]
  },
  testTimeout: 30000,
  maxWorkers: 1, // For database tests
  forceExit: true,
  detectOpenHandles: true
};
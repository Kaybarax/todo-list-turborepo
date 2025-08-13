// Test coverage configuration for comprehensive testing
export const coverageConfig = {
  // Coverage thresholds for CI/CD pipeline
  thresholds: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Per-file thresholds
    './lib/components/Button/Button.tsx': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './lib/components/Card/Card.tsx': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './lib/components/Input/Input.tsx': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './lib/components/Badge/Badge.tsx': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './lib/utils/index.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // Files to include in coverage
  include: ['lib/**/*.{ts,tsx}'],

  // Files to exclude from coverage
  exclude: [
    'lib/**/*.test.{ts,tsx}',
    'lib/**/*.stories.{ts,tsx}',
    'lib/test/**/*',
    '__tests__/**/*',
    'showcase/**/*',
    'dist/**/*',
    'node_modules/**/*',
  ],

  // Coverage reporters
  reporters: ['text', 'text-summary', 'html', 'json', 'lcov'],

  // Coverage output directory
  reportsDirectory: './coverage',

  // Fail build if coverage is below thresholds
  skipFull: false,

  // Additional configuration for CI/CD
  ci: {
    // Fail CI if any file is below individual threshold
    perFile: true,
    // Generate coverage badges
    badges: true,
    // Upload to coverage services
    upload: true,
  },
};

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/test/setup.ts', './src/test/eva-setup.ts'],
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    '!lib/**/*.stories.{js,jsx,ts,tsx}',
    '!lib/**/*.test.{js,jsx,ts,tsx}',
    '!src/test/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1',
    '^react-native-vector-icons/(.*)$': '<rootDir>/__tests__/__mocks__/react-native-vector-icons.js',
    '^@ui-kitten/eva-icons$': '<rootDir>/__tests__/__mocks__/@ui-kitten/eva-icons.js',
    '^@ui-kitten/components$': '<rootDir>/__tests__/__mocks__/@ui-kitten/components.js',
    '^@eva-design/eva$': '<rootDir>/__tests__/__mocks__/@eva-design/eva.js',
    '../../theme/useEnhancedTheme$': '<rootDir>/__tests__/__mocks__/useEnhancedTheme.js',
    '^react-native$': 'react-native-web',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          types: ['jest', 'node'],
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@ui-kitten|@eva-design|react-native-svg|react-native-gesture-handler|react-native-web|react-native-reanimated|react-native-screens|react-native-safe-area-context|@expo|expo)/)',
  ],
  testEnvironmentOptions: {
    customExportConditions: ['react-native'],
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
};

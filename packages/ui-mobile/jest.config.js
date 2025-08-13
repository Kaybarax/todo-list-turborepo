module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}', '**/lib/**/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    '!lib/**/*.stories.{js,jsx,ts,tsx}',
    '!lib/**/*.test.{js,jsx,ts,tsx}',
    '!lib/test/**/*',
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
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@ui-kitten|@eva-design|react-native-svg|react-native-gesture-handler|react-native-web)/)',
  ],
};

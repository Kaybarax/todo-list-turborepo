module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/lib/**/*.test.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    '!lib/**/*.stories.{js,jsx,ts,tsx}',
    '!lib/**/*.test.{js,jsx,ts,tsx}',
    '!lib/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/lib/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@ui-kitten|@eva-design|react-native-svg)/)'
  ]
};
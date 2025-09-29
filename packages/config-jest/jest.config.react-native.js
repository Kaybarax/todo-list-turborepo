const baseConfig = require('./jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'React Native',
  testEnvironment: 'node',
  // Override base preset (ts-jest) which conflicts with React Native/Expo tests
  preset: undefined,
  resolver: require.resolve('react-native/jest/resolver'),
  setupFiles: ['<rootDir>/../../packages/config-jest/setup-react-native.js'],
  setupFilesAfterEnv: ['<rootDir>/../../packages/config-jest/setup-tests-react-native.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/mocks/**',
    '!app.config.js',
    '!babel.config.js',
    '!metro.config.js',
  ],
  moduleFileExtensions: [
    'ios.ts',
    'ios.tsx',
    'native.ts',
    'native.tsx',
    'ios.js',
    'native.js',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  haste: {
    defaultPlatform: 'ios',
    platforms: ['ios', 'native'],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/([^/]+)/?(.*)$': '<rootDir>/../../packages/$1/src/$2',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '@react-native/js-polyfills/error-guard': '<rootDir>/../../packages/config-jest/mocks/error-guard.js',
    'react-native-svg': '<rootDir>/../../packages/config-jest/mocks/react-native-svg.js',
  },
  // Let babel-jest pick up each app's local Babel config (e.g., babel-preset-expo)
  // to avoid depending on metro-react-native-babel-preset in tests.
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:\.pnpm/(?:.*?)/)?(react-native|react-native-web|(jest-)?react-native|@react-native(?:-community)?|@expo(?:nent)?|expo|@unimodules|unimodules|sentry-expo|native-base|react-clone-referenced-element|@react-navigation|react-native-vector-icons|@testing-library))/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],
};

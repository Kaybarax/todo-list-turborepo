const baseConfig = require('./jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'React Native',
  preset: 'react-native',
  testEnvironment: 'node',
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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@todo/(.*)$': '<rootDir>/../../packages/$1/src',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '@react-native/js-polyfills/error-guard': '<rootDir>/../../packages/config-jest/mocks/error-guard.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['module:metro-react-native-babel-preset'],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@expo(nent)?|@unimodules|unimodules|sentry-expo|native-base|react-clone-referenced-element|@react-navigation|react-native-vector-icons|@testing-library)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],
};

import { jest } from '@jest/globals';

// Mock Eva Design themes
jest.mock('@eva-design/eva', () => ({
  light: {
    'color-primary-default': '#3366FF',
    'color-success-default': '#00E096',
    'color-danger-default': '#FF3D71',
    'background-basic-color-1': '#FFFFFF',
    'text-basic-color': '#222B45',
    'spacing-medium': 16,
    'border-radius-medium': 8,
  },
  dark: {
    'color-primary-default': '#3366FF',
    'color-success-default': '#00E096',
    'color-danger-default': '#FF3D71',
    'background-basic-color-1': '#1A2138',
    'text-basic-color': '#FFFFFF',
    'spacing-medium': 16,
    'border-radius-medium': 8,
  },
}));

// Mock AsyncStorage for theme persistence tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// (Removed mock of ../../lib/theme/useEnhancedTheme to allow real hook logic in tests that import it)

// Global test utilities
(globalThis as any).renderWithEvaTheme = (component: React.ReactElement) => {
  const { render } = require('@testing-library/react-native');
  const React = require('react');
  const { EvaProvider } = require('../../lib/theme');

  return render(React.createElement(EvaProvider, {}, component));
};

// Export TestWrapper for use in tests
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const React = require('react');
  const { EvaProvider } = require('../../lib/theme');
  return React.createElement(EvaProvider, {}, children);
};

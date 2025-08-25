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

// Mock enhanced theme hook
jest.mock('../../lib/theme/useEnhancedTheme', () => ({
  useEnhancedTheme: () => ({
    theme: {
      'color-primary-default': '#3366FF',
      'background-basic-color-1': '#FFFFFF',
      'text-basic-color': '#222B45',
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      colors: {
        primary: '#3366FF',
        text: {
          primary: '#222B45',
          secondary: '#8F9BB3',
          disabled: '#C5CEE0',
          inverse: '#FFFFFF',
        },
        success: '#00E096',
        danger: '#FF3D71',
        warning: '#FFAA00',
        info: '#0095FF',
        border: {
          default: '#E4E9F2',
        },
      },
      borders: {
        width: {
          thin: 1,
          medium: 2,
          thick: 3,
        },
      },
      typography: {
        fontWeights: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
      },
    },
    evaTheme: {
      'color-primary-default': '#3366FF',
      'background-basic-color-1': '#FFFFFF',
      'text-basic-color': '#222B45',
      'spacing-medium': 16,
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

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

import 'react-native';
import { jest } from '@jest/globals';

// Mock Eva Design components for testing
jest.mock('@ui-kitten/components', () => ({
  ApplicationProvider: ({ children }: { children: React.ReactNode }) => children,
  Button: 'Button',
  Input: 'Input',
  Text: 'Text',
  Card: 'Card',
  Avatar: 'Avatar',
  CheckBox: 'CheckBox',
  Toggle: 'Toggle',
  Select: 'Select',
  Modal: 'Modal',
  Layout: 'Layout',
  Icon: 'Icon',
  useTheme: () => ({
    'color-primary-default': '#3366FF',
    'color-success-default': '#00E096',
    'color-danger-default': '#FF3D71',
    'background-basic-color-1': '#FFFFFF',
    'text-basic-color': '#222B45',
    'spacing-medium': 16,
    'border-radius-medium': 8,
  }),
}));

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
jest.mock('../lib/theme/useEnhancedTheme', () => ({
  useEnhancedTheme: () => ({
    theme: {
      'color-primary-default': '#3366FF',
      'background-basic-color-1': '#FFFFFF',
      'text-basic-color': '#222B45',
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
global.renderWithEvaTheme = (component: React.ReactElement) => {
  const { render } = require('@testing-library/react-native');
  const React = require('react');
  const { EvaProvider } = require('../lib/theme');

  return render(React.createElement(EvaProvider, {}, component));
};

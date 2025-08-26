import * as eva from '@eva-design/eva';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import React from 'react';

import { EvaProvider } from '../../../lib/theme';

// Custom render function with Eva Design providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApplicationProvider {...eva.light} theme={eva.light}>
      <EvaProvider>{children}</EvaProvider>
    </ApplicationProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Custom render with dark theme
const AllTheProvidersDark = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApplicationProvider {...eva.dark} theme={eva.dark}>
      <EvaProvider>{children}</EvaProvider>
    </ApplicationProvider>
  );
};

const customRenderDark = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProvidersDark, ...options });

// Theme test utilities
export const createMockTheme = (overrides = {}) => ({
  'color-primary-default': '#3366FF',
  'color-success-default': '#00E096',
  'color-danger-default': '#FF3D71',
  'background-basic-color-1': '#FFFFFF',
  'text-basic-color': '#222B45',
  'spacing-tiny': 4,
  'spacing-small': 8,
  'spacing-medium': 16,
  'spacing-large': 24,
  'border-radius-small': 4,
  'border-radius-medium': 8,
  'border-radius-large': 12,
  ...overrides,
});

// Accessibility test helpers
export const testAccessibility = async (component: React.ReactElement) => {
  const { getByRole, getByLabelText, getByA11yLabel } = customRender(component);

  return {
    getByRole,
    getByLabelText,
    getByA11yLabel,
  };
};

// Theme switching test helper
export const testThemeSwitch = (component: React.ReactElement) => {
  const lightRender = customRender(component);
  const darkRender = customRenderDark(component);

  return {
    light: lightRender,
    dark: darkRender,
  };
};

// Performance test helper
export const measureRenderTime = (component: React.ReactElement) => {
  const start = performance.now();
  const result = customRender(component);
  const end = performance.now();

  return {
    renderTime: end - start,
    ...result,
  };
};

// Re-export everything
export * from '@testing-library/react-native';

// Export custom renders as the default
export { customRender as render, customRenderDark as renderDark };

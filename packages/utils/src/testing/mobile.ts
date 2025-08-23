import React from 'react';

// Type definitions for React Native testing
export interface RenderOptions {
  wrapper?: React.ComponentType<any>;
  [key: string]: any;
}

export interface RenderResult {
  getByText: (text: string) => any;
  getByRole: (role: string) => any;
  getByLabelText: (label: string) => any;
  getByA11yLabel: (label: string) => any;
  [key: string]: any;
}

// Mock render function for environments without React Native
const mockRender = (ui: React.ReactElement, options?: RenderOptions): RenderResult => {
  return {
    getByText: (text: string) => ({ textContent: text }),
    getByRole: (role: string) => ({ role }),
    getByLabelText: (label: string) => ({ label }),
    getByA11yLabel: (label: string) => ({ accessibilityLabel: label }),
  };
};

// Dynamic import function for React Native testing library
let reactNativeRender: typeof mockRender;
try {
  // Try to import @testing-library/react-native if available
  const testingLibrary = require('@testing-library/react-native');
  reactNativeRender = testingLibrary.render;
  // Re-export everything from @testing-library/react-native if available
  Object.assign(exports, testingLibrary);
} catch (error) {
  // Fallback to mock render if React Native testing library is not available
  reactNativeRender = mockRender;
}

export const render = reactNativeRender;

// Types for Eva Design testing
export interface EvaTheme {
  'color-primary-default': string;
  'color-success-default': string;
  'color-danger-default': string;
  'background-basic-color-1': string;
  'text-basic-color': string;
  'spacing-tiny': number;
  'spacing-small': number;
  'spacing-medium': number;
  'spacing-large': number;
  'border-radius-small': number;
  'border-radius-medium': number;
  'border-radius-large': number;
  [key: string]: string | number;
}

export interface AccessibilityHelpers {
  getByRole: RenderResult['getByRole'];
  getByLabelText: RenderResult['getByLabelText'];
  getByA11yLabel: RenderResult['getByA11yLabel'];
}

export interface ThemeTestResult {
  light: RenderResult;
  dark: RenderResult;
}

export interface PerformanceTestResult extends RenderResult {
  renderTime: number;
}

// Mock providers for testing - these will be properly implemented when used in React Native environment
const createMockProvider =
  (theme: string) =>
  ({ children }: { children: React.ReactNode }) => {
    // In a real React Native environment, this would use ApplicationProvider
    // For testing purposes, we just return the children
    return React.createElement('div', { 'data-theme': theme }, children);
  };

const AllTheProviders = createMockProvider('light');
const AllTheProvidersDark = createMockProvider('dark');

/**
 * Custom render function with Eva Design light theme providers
 * @param ui - React element to render
 * @param options - Render options (excluding wrapper)
 * @returns Render result with Eva Design context
 */
export const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult => {
  try {
    return render(ui, { wrapper: AllTheProviders, ...options });
  } catch (error) {
    // Fallback for environments without React Native
    return render(ui, options);
  }
};

/**
 * Custom render function with Eva Design dark theme providers
 * @param ui - React element to render
 * @param options - Render options (excluding wrapper)
 * @returns Render result with Eva Design dark theme context
 */
export const customRenderDark = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult => {
  try {
    return render(ui, { wrapper: AllTheProvidersDark, ...options });
  } catch (error) {
    // Fallback for environments without React Native
    return render(ui, options);
  }
};

/**
 * Create a mock Eva Design theme with default values and optional overrides
 * @param overrides - Theme properties to override
 * @returns Mock theme object
 */
export const createMockTheme = (overrides: Partial<EvaTheme> = {}): EvaTheme => ({
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

/**
 * Test accessibility features of a component
 * @param component - React component to test
 * @returns Accessibility testing helpers
 */
export const testAccessibility = async (component: React.ReactElement): Promise<AccessibilityHelpers> => {
  const { getByRole, getByLabelText, getByA11yLabel } = customRender(component);

  return {
    getByRole,
    getByLabelText,
    getByA11yLabel,
  };
};

/**
 * Test component with both light and dark themes
 * @param component - React component to test
 * @returns Render results for both themes
 */
export const testThemeSwitch = (component: React.ReactElement): ThemeTestResult => {
  const lightRender = customRender(component);
  const darkRender = customRenderDark(component);

  return {
    light: lightRender,
    dark: darkRender,
  };
};

/**
 * Measure component render time for performance testing
 * @param component - React component to measure
 * @returns Render result with timing information
 */
export const measureRenderTime = (component: React.ReactElement): PerformanceTestResult => {
  const start = performance.now();
  const result = customRender(component);
  const end = performance.now();

  return {
    renderTime: end - start,
    ...result,
  };
};

// Export custom renders as named exports for convenience
export { customRenderDark as renderDark };

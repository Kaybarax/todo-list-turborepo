import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../../../lib/theme';

// Unified render helper for most component tests.
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export const renderWithProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react-native';
export default renderWithProvider;

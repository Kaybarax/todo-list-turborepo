/**
 * Eva Design Application Provider
 * Wraps the app with Eva Design theming system
 *
 * @deprecated Consider using EnhancedThemeProvider for integrated theme management
 * @see EnhancedThemeProvider combines Eva Design with legacy theme tokens
 *
 * Note: This provider is still useful for simple Eva-only setups
 */

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';

import { customMapping } from './eva-mapping';
import { lightTheme, darkTheme } from './eva-theme';

export interface EvaProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  customTheme?: Record<string, unknown>;
  /**
   * When true, apply the library's customMapping to ApplicationProvider.
   * Defaults to false to avoid unexpected mapping shape conflicts.
   */
  useCustomMapping?: boolean;
}

export const EvaProvider: React.FC<EvaProviderProps> = ({
  children,
  theme = 'light',
  customTheme,
  useCustomMapping = false,
}) => {
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;
  const finalTheme = customTheme ? { ...selectedTheme, ...customTheme } : selectedTheme;
  const baseEvaTheme = theme === 'dark' ? eva.dark : eva.light;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...baseEvaTheme, ...finalTheme }}
        {...(useCustomMapping ? { customMapping } : {})}
      >
        {children}
      </ApplicationProvider>
    </>
  );
};

export default EvaProvider;

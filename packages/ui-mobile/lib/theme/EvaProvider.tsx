/**
 * Eva Design Application Provider
 * Wraps the app with Eva Design theming system
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
  customTheme?: Record<string, any>;
}

export const EvaProvider: React.FC<EvaProviderProps> = ({ children, theme = 'light', customTheme }) => {
  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;
  const finalTheme = customTheme ? { ...selectedTheme, ...customTheme } : selectedTheme;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...finalTheme }} customMapping={customMapping}>
        {children}
      </ApplicationProvider>
    </>
  );
};

export default EvaProvider;

/**
 * Theme Configurations Export
 */

export { lightTheme } from './light';
export { darkTheme } from './dark';

import { lightTheme } from './light';
import { darkTheme } from './dark';
import type { Theme, ThemeName } from '../types';

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || lightTheme;
};

export default themes;

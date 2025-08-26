/**
 * Theme Configurations Export
 */

export { lightTheme } from './light';
export { darkTheme } from './dark';

import { darkTheme } from './dark';
import { lightTheme } from './light';
import { type Theme, type ThemeName } from '../types';

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || lightTheme;
};

export default themes;

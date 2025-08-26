/**
 * Dark Theme Configuration
 */

import { borders } from '../../tokens/borders';
import { breakpoints } from '../../tokens/breakpoints';
import { darkColors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { type Theme } from '../types';

export const darkTheme: Theme = {
  name: 'dark',
  colors: darkColors,
  typography,
  spacing,
  shadows,
  borders,
  breakpoints,
};

export default darkTheme;

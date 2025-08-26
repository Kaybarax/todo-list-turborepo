/**
 * Light Theme Configuration
 */

import { borders } from '../../tokens/borders';
import { breakpoints } from '../../tokens/breakpoints';
import { lightColors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { type Theme } from '../types';

export const lightTheme: Theme = {
  name: 'light',
  colors: lightColors,
  typography,
  spacing,
  shadows,
  borders,
  breakpoints,
};

export default lightTheme;

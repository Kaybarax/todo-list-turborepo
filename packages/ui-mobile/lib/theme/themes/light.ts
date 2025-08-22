/**
 * Light Theme Configuration
 */

import { lightColors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { borders } from '../../tokens/borders';
import { breakpoints } from '../../tokens/breakpoints';
import type { Theme } from '../types';

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

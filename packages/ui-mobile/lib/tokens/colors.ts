/**
 * Color Design Tokens
 * Comprehensive color system with semantic naming and color scales
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorTokens {
  // Semantic colors
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;

  // Neutral colors
  neutral: ColorScale;

  // Surface colors
  background: string;
  surface: string;
  overlay: string;

  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };

  // Border colors
  border: {
    default: string;
    focus: string;
    error: string;
  };
}

// Primary color scale (Blue)
export const primary: ColorScale = {
  50: '#EBF8FF',
  100: '#BEE3F8',
  200: '#90CDF4',
  300: '#63B3ED',
  400: '#4299E1',
  500: '#3182CE', // Base
  600: '#2B77CB',
  700: '#2C5282',
  800: '#2A4365',
  900: '#1A365D',
};

// Secondary color scale (Purple)
export const secondary: ColorScale = {
  50: '#FAF5FF',
  100: '#E9D8FD',
  200: '#D6BCFA',
  300: '#B794F6',
  400: '#9F7AEA',
  500: '#805AD5', // Base
  600: '#6B46C1',
  700: '#553C9A',
  800: '#44337A',
  900: '#322659',
};

// Success color scale (Green)
export const success: ColorScale = {
  50: '#F0FFF4',
  100: '#C6F6D5',
  200: '#9AE6B4',
  300: '#68D391',
  400: '#48BB78',
  500: '#38A169', // Base
  600: '#2F855A',
  700: '#276749',
  800: '#22543D',
  900: '#1C4532',
};

// Warning color scale (Orange)
export const warning: ColorScale = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B', // Base
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
};

// Error color scale (Red)
export const error: ColorScale = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444', // Base
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
};

// Neutral color scale (Gray)
export const neutral: ColorScale = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280', // Base
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

// Light theme colors
export const lightColors: ColorTokens = {
  primary,
  secondary,
  success,
  warning,
  error,
  neutral,

  // Surface colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text colors
  text: {
    primary: neutral[900],
    secondary: neutral[700],
    disabled: neutral[500],
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    default: neutral[200],
    focus: primary[500],
    error: error[500],
  },
};

// Dark theme colors
export const darkColors: ColorTokens = {
  primary,
  secondary,
  success,
  warning,
  error,
  neutral,

  // Surface colors
  background: '#000000',
  surface: neutral[900],
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: neutral[400],
    disabled: neutral[500],
    inverse: neutral[900],
  },

  // Border colors
  border: {
    default: neutral[700],
    focus: primary[400],
    error: error[400],
  },
};

export default lightColors;

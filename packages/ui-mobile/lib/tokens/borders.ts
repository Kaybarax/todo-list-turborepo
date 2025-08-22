/**
 * Border Design Tokens
 * Standardized border radius and border width values
 */

export interface BorderTokens {
  radius: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
  };
  width: {
    none: number;
    thin: number;
    medium: number;
    thick: number;
  };
}

export const borders: BorderTokens = {
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
  },
};

export default borders;

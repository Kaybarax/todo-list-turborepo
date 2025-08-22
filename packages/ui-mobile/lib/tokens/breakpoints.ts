/**
 * Breakpoint Design Tokens
 * Responsive breakpoint definitions for different screen sizes
 */

export interface BreakpointTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const breakpoints: BreakpointTokens = {
  xs: 320, // Small phones
  sm: 375, // Medium phones
  md: 414, // Large phones
  lg: 768, // Tablets
  xl: 1024, // Large tablets/small desktops
};

// Utility functions for responsive design
export const isSmallScreen = (width: number): boolean => width < breakpoints.sm;
export const isMediumScreen = (width: number): boolean => width >= breakpoints.sm && width < breakpoints.md;
export const isLargeScreen = (width: number): boolean => width >= breakpoints.md && width < breakpoints.lg;
export const isTablet = (width: number): boolean => width >= breakpoints.lg;

export default breakpoints;

/**
 * Responsive Utilities
 * Helper functions for different screen sizes, breakpoints, and platform-specific behavior
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

export interface BreakpointTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ScreenInfo {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
  isLandscape: boolean;
  isTablet: boolean;
  isPhone: boolean;
  breakpoint: keyof BreakpointTokens;
}

// Default breakpoints (in dp/pt)
export const defaultBreakpoints: BreakpointTokens = {
  xs: 0, // Extra small devices
  sm: 576, // Small devices
  md: 768, // Medium devices (tablets)
  lg: 992, // Large devices
  xl: 1200, // Extra large devices
};

/**
 * Get current screen dimensions and info
 */
export const getScreenInfo = (breakpoints: BreakpointTokens = defaultBreakpoints): ScreenInfo => {
  const { width, height } = Dimensions.get('window');
  const scale = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();
  const isLandscape = width > height;

  // Determine if device is tablet based on screen size
  const minDimension = Math.min(width, height);
  const isTablet = minDimension >= breakpoints.md;
  const isPhone = !isTablet;

  // Determine current breakpoint
  let breakpoint: keyof BreakpointTokens = 'xs';
  if (width >= breakpoints.xl) breakpoint = 'xl';
  else if (width >= breakpoints.lg) breakpoint = 'lg';
  else if (width >= breakpoints.md) breakpoint = 'md';
  else if (width >= breakpoints.sm) breakpoint = 'sm';

  return {
    width,
    height,
    scale,
    fontScale,
    isLandscape,
    isTablet,
    isPhone,
    breakpoint,
  };
};

/**
 * Check if current screen matches breakpoint
 */
export const matchesBreakpoint = (
  targetBreakpoint: keyof BreakpointTokens,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): boolean => {
  const { width } = Dimensions.get('window');
  return width >= breakpoints[targetBreakpoint];
};

/**
 * Get responsive value based on current breakpoint
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof BreakpointTokens, T>>,
  fallback: T,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): T => {
  const { breakpoint } = getScreenInfo(breakpoints);

  // Check from current breakpoint down to find a value
  const orderedBreakpoints: (keyof BreakpointTokens)[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(breakpoint);

  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return fallback;
};

/**
 * Scale value based on screen density
 */
export const scaleByDensity = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size);
};

/**
 * Scale font size based on accessibility font scale
 */
export const scaleFontSize = (size: number, maxScale: number = 1.3): number => {
  const fontScale = PixelRatio.getFontScale();
  const clampedScale = Math.min(fontScale, maxScale);
  return Math.round(size * clampedScale);
};

/**
 * Get platform-specific value
 */
export const getPlatformValue = <T>(values: { ios?: T; android?: T; web?: T; default: T }): T => {
  if (Platform.OS === 'ios' && values.ios !== undefined) {
    return values.ios;
  }
  if (Platform.OS === 'android' && values.android !== undefined) {
    return values.android;
  }
  if (Platform.OS === 'web' && values.web !== undefined) {
    return values.web;
  }
  return values.default;
};

/**
 * Check if device is in landscape orientation
 */
export const isLandscape = (): boolean => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

/**
 * Check if device is a tablet
 */
export const isTablet = (breakpoints: BreakpointTokens = defaultBreakpoints): boolean => {
  const { width, height } = Dimensions.get('window');
  const minDimension = Math.min(width, height);
  return minDimension >= breakpoints.md;
};

/**
 * Get safe margins for different screen sizes
 */
export const getSafeMargins = (breakpoints: BreakpointTokens = defaultBreakpoints) => {
  const screenInfo = getScreenInfo(breakpoints);

  return getResponsiveValue(
    {
      xs: { horizontal: 16, vertical: 8 },
      sm: { horizontal: 20, vertical: 12 },
      md: { horizontal: 24, vertical: 16 },
      lg: { horizontal: 32, vertical: 20 },
      xl: { horizontal: 40, vertical: 24 },
    },
    { horizontal: 16, vertical: 8 },
    breakpoints,
  );
};

/**
 * Get responsive grid columns
 */
export const getGridColumns = (breakpoints: BreakpointTokens = defaultBreakpoints): number => {
  return getResponsiveValue(
    {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    1,
    breakpoints,
  );
};

/**
 * Create responsive style object
 */
export const createResponsiveStyle = <T>(
  styles: Partial<Record<keyof BreakpointTokens, T>>,
  fallback: T,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): T => {
  return getResponsiveValue(styles, fallback, breakpoints);
};

/**
 * Clamp value between min and max based on screen size
 */
export const clampByScreenSize = (
  value: number,
  minValue: number,
  maxValue: number,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): number => {
  const { breakpoint } = getScreenInfo(breakpoints);

  // Scale the clamping based on breakpoint
  const scaleFactors: Record<keyof BreakpointTokens, number> = {
    xs: 0.8,
    sm: 0.9,
    md: 1.0,
    lg: 1.1,
    xl: 1.2,
  };

  const scaleFactor = scaleFactors[breakpoint];
  const scaledValue = value * scaleFactor;

  return Math.max(minValue, Math.min(maxValue, scaledValue));
};

/**
 * Get responsive padding/margin values
 */
export const getResponsiveSpacing = (
  baseSpacing: number,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): number => {
  return getResponsiveValue(
    {
      xs: baseSpacing * 0.75,
      sm: baseSpacing * 0.875,
      md: baseSpacing,
      lg: baseSpacing * 1.125,
      xl: baseSpacing * 1.25,
    },
    baseSpacing,
    breakpoints,
  );
};

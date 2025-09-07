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
  let current: keyof BreakpointTokens = 'xs';
  if (width >= breakpoints.xl) current = 'xl';
  else if (width >= breakpoints.lg) current = 'lg';
  else if (width >= breakpoints.md) current = 'md';
  else if (width >= breakpoints.sm) current = 'sm';
  return current === targetBreakpoint;
};

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(values: T): T;
export function getResponsiveValue<T>(
  values: Partial<Record<keyof BreakpointTokens, T>>,
  fallback?: T,
  breakpoints?: BreakpointTokens,
): T;
export function getResponsiveValue<T>(
  values: T | Partial<Record<keyof BreakpointTokens, T>>,
  fallback?: T,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): T {
  // If a single value is provided, return it directly
  if (typeof values !== 'object' || values === null) {
    return values as T;
  }

  const { breakpoint } = getScreenInfo(breakpoints);
  const orderedBreakpoints: (keyof BreakpointTokens)[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(breakpoint);
  const map = values as Partial<Record<keyof BreakpointTokens, T>>;

  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (map[bp] !== undefined) {
      return map[bp]!;
    }
  }

  // If no value found, try any provided fallback or the smallest defined
  if (fallback !== undefined) return fallback;
  for (let i = orderedBreakpoints.length - 1; i >= 0; i--) {
    const bp = orderedBreakpoints[i];
    if (map[bp] !== undefined) return map[bp]!;
  }
  throw new Error('No responsive value provided');
}

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
export function getPlatformValue<T>(values: T): T;
export function getPlatformValue<T>(values: { ios?: T; android?: T; web?: T; default?: T }): T;
export function getPlatformValue<T>(values: T | { ios?: T; android?: T; web?: T; default?: T }): T {
  if (typeof values !== 'object' || values === null || Array.isArray(values)) {
    return values as T;
  }
  const map = values as { ios?: T; android?: T; web?: T; default?: T };
  if (Platform.OS === 'ios' && map.ios !== undefined) return map.ios;
  if (Platform.OS === 'android' && map.android !== undefined) return map.android;
  if (Platform.OS === 'web' && map.web !== undefined) return map.web;
  if (map.default !== undefined) return map.default;
  // Fallback to first defined value
  return (map.ios ?? map.android ?? map.web) as T;
}

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
export function getGridColumns(columns?: Partial<Record<keyof BreakpointTokens, number>>): number;
export function getGridColumns(
  columnsOrBreakpoints: Partial<Record<keyof BreakpointTokens, number>> | BreakpointTokens = {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  breakpoints: BreakpointTokens = defaultBreakpoints,
): number {
  const defaultColumns = { xs: 2, sm: 2, md: 3, lg: 4, xl: 5 } as const;
  const columns = (
    'xs' in columnsOrBreakpoints && typeof (columnsOrBreakpoints as any).xs === 'number'
      ? (columnsOrBreakpoints as Partial<Record<keyof BreakpointTokens, number>>)
      : defaultColumns
  ) as Partial<Record<keyof BreakpointTokens, number>>;
  return getResponsiveValue(columns as any, 1, breakpoints);
}

/**
 * Create responsive style object
 */
export function createResponsiveStyle(
  baseStyle: Record<string, any>,
  responsiveProps: Partial<Record<string, Partial<Record<keyof BreakpointTokens, any>>>>,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): any {
  const result: any = { ...baseStyle };
  for (const key in responsiveProps) {
    const map = (responsiveProps as any)[key]!;
    result[key] = getResponsiveValue(map as any, (baseStyle as any)[key], breakpoints);
  }
  return result;
}

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
export function getResponsiveSpacing(size: keyof BreakpointTokens): number;
export function getResponsiveSpacing(baseSpacing: number): number;
export function getResponsiveSpacing(
  sizeOrBase: keyof BreakpointTokens | number,
  breakpoints: BreakpointTokens = defaultBreakpoints,
): number {
  if (typeof sizeOrBase === 'number') {
    const baseSpacing = sizeOrBase;
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
  }
  const preset: Record<keyof BreakpointTokens, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };
  return preset[sizeOrBase];
}

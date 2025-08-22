/**
 * useResponsive Hook
 * Custom hook for responsive design and screen size handling
 */

import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  BreakpointTokens,
  ScreenInfo,
  getScreenInfo,
  getResponsiveValue,
  matchesBreakpoint,
  defaultBreakpoints,
} from '../utils/responsive';

export interface UseResponsiveOptions {
  breakpoints?: BreakpointTokens;
}

export interface UseResponsiveReturn {
  screenInfo: ScreenInfo;
  breakpoint: keyof BreakpointTokens;
  isPhone: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
  getResponsiveValue: <T>(values: Partial<Record<keyof BreakpointTokens, T>>, fallback: T) => T;
  matchesBreakpoint: (targetBreakpoint: keyof BreakpointTokens) => boolean;
}

/**
 * Custom hook for responsive design
 */
export const useResponsive = (options: UseResponsiveOptions = {}): UseResponsiveReturn => {
  const breakpoints = options.breakpoints || defaultBreakpoints;
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => getScreenInfo(breakpoints));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setScreenInfo(getScreenInfo(breakpoints));
    });

    return () => subscription?.remove();
  }, [breakpoints]);

  const getResponsiveValueWrapper = <T>(values: Partial<Record<keyof BreakpointTokens, T>>, fallback: T): T => {
    return getResponsiveValue(values, fallback, breakpoints);
  };

  const matchesBreakpointWrapper = (targetBreakpoint: keyof BreakpointTokens): boolean => {
    return matchesBreakpoint(targetBreakpoint, breakpoints);
  };

  return {
    screenInfo,
    breakpoint: screenInfo.breakpoint,
    isPhone: screenInfo.isPhone,
    isTablet: screenInfo.isTablet,
    isLandscape: screenInfo.isLandscape,
    width: screenInfo.width,
    height: screenInfo.height,
    getResponsiveValue: getResponsiveValueWrapper,
    matchesBreakpoint: matchesBreakpointWrapper,
  };
};

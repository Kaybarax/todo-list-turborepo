/**
 * usePlatform Hook
 * Custom hook for platform-specific behavior and utilities
 */

import { useEffect, useState } from 'react';
import { Platform, type PlatformOSType } from 'react-native';

import { getPlatformValue } from '../utils/responsive';

export interface UsePlatformOptions {
  // Optional configuration for platform detection
}

export interface UsePlatformReturn {
  OS: PlatformOSType;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  Version: string | number;
  isPad: boolean;
  isTV: boolean;
  isTesting: boolean;
  getPlatformValue: <T>(values: { ios?: T; android?: T; web?: T; default: T }) => T;
  select: <T>(specifics: { ios?: T; android?: T; web?: T; default?: T }) => T | undefined;
}

/**
 * Custom hook for platform-specific behavior
 */
export const usePlatform = (options: UsePlatformOptions = {}): UsePlatformReturn => {
  const [platformInfo, setPlatformInfo] = useState(() => ({
    OS: Platform.OS,
    Version: Platform.Version,
    isPad: (Platform as any).isPad || false,
    isTV: (Platform as any).isTV || false,
    isTesting: (Platform as any).isTesting || false,
  }));

  useEffect(() => {
    // Platform info is generally static, but we keep this structure
    // in case we need to handle dynamic platform changes in the future
    setPlatformInfo({
      OS: Platform.OS,
      Version: Platform.Version,
      isPad: (Platform as any).isPad || false,
      isTV: (Platform as any).isTV || false,
      isTesting: (Platform as any).isTesting || false,
    });
  }, []);

  const isIOS = platformInfo.OS === 'ios';
  const isAndroid = platformInfo.OS === 'android';
  const isWeb = platformInfo.OS === 'web';

  const getPlatformValueWrapper = <T>(values: { ios?: T; android?: T; web?: T; default: T }): T => {
    return getPlatformValue(values);
  };

  const select = <T>(specifics: { ios?: T; android?: T; web?: T; default?: T }): T | undefined => {
    return Platform.select(specifics);
  };

  return {
    OS: platformInfo.OS,
    isIOS,
    isAndroid,
    isWeb,
    Version: platformInfo.Version,
    isPad: platformInfo.isPad,
    isTV: platformInfo.isTV,
    isTesting: platformInfo.isTesting,
    getPlatformValue: getPlatformValueWrapper,
    select,
  };
};

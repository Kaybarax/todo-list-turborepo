/**
 * useAccessibility Hook
 * Custom hook for accessibility features and screen reader support
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { type AccessibilityProps, createAccessibilityProps } from '../utils/accessibility';

export interface UseAccessibilityOptions {
  label: string;
  hint?: string;
  role?: AccessibilityProps['accessibilityRole'];
  state?: Parameters<typeof createAccessibilityProps>[0]['state'];
  value?: Parameters<typeof createAccessibilityProps>[0]['value'];
}

export interface UseAccessibilityReturn {
  accessibilityProps: AccessibilityProps;
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  announceForAccessibility: (message: string) => void;
  // Backward-compatible API expected by tests
  getAccessibilityProps: (args: {
    label: string;
    hint?: string;
    role?: AccessibilityProps['accessibilityRole'];
    state?: AccessibilityProps['accessibilityState'];
    value?: AccessibilityProps['accessibilityValue'];
  }) => AccessibilityProps;
  announce: (message: string) => void;
  setFocus: () => void;
}

/**
 * Custom hook for accessibility features
 */
export const useAccessibility = (options?: UseAccessibilityOptions): UseAccessibilityReturn => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    // Check initial screen reader state
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);

    // Check initial reduce motion state
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotionEnabled);

    // Listen for screen reader changes
    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled,
    );

    // Listen for reduce motion changes
    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled,
    );

    return () => {
      screenReaderSubscription?.remove();
      reduceMotionSubscription?.remove();
    };
  }, []);

  const baseOptions = options ?? { label: '' };
  const accessibilityProps = createAccessibilityProps({
    label: baseOptions.label,
    hint: baseOptions.hint,
    role: baseOptions.role,
    state: baseOptions.state,
    value: baseOptions.value,
  });

  const announceForAccessibility = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  const getAccessibilityProps: UseAccessibilityReturn['getAccessibilityProps'] = args => {
    return createAccessibilityProps(args as any);
  };

  const announce: UseAccessibilityReturn['announce'] = message => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  const setFocus = () => {
    // This would typically be used with a ref to the component
    // AccessibilityInfo.setAccessibilityFocus requires a reactTag parameter
    // This is a placeholder - in real usage, you'd pass the component's reactTag
  };

  return {
    accessibilityProps,
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    announceForAccessibility,
    getAccessibilityProps,
    announce,
    setFocus,
  };
};

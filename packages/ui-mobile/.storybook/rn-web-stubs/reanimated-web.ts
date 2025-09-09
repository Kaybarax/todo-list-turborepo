// ESM stub for react-native-reanimated in Storybook (web)
// Provides minimal surface required by components (Animated.View, hooks & helpers)
import React from 'react';
import { View } from 'react-native';

export const useSharedValue = <T>(value: T) => ({ value });
export const withTiming = <T>(toValue: T) => toValue;
export const withSpring = <T>(toValue: T) => toValue;
export const runOnJS = (fn: any) => fn;
export const useAnimatedStyle = (factory: any) => factory();
// export const createAnimatedComponent = (Component: any) => Component;

// Basic Animated namespace mimic
const createAnimatedComponentInternal = (Component: any) => Component;

const Animated: any = {
  View: (props: any) => React.createElement(View as any, props, props?.children),
  createAnimatedComponent: createAnimatedComponentInternal,
};

// Also export named helper mirroring real library
export const createAnimatedComponent = createAnimatedComponentInternal;

export default Animated;

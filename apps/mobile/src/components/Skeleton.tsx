import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useDesignTokens } from '../hooks/useDesignTokens';

type Props = {
  width?: number | `${number}%` | 'auto';
  height?: number;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

// Lightweight pulsing skeleton that works on RN and RN Web without extra deps
export const Skeleton: React.FC<Props> = ({ width = '100%', height = 12, style, borderRadius = 6 }) => {
  const tokens = useDesignTokens();
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: tokens.colors.neutral[200],
          opacity,
        },
        style,
      ]}
    />
  );
};

export default Skeleton;

import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type SnackbarProps = {
  visible: boolean;
  message: string;
  variant?: 'success' | 'error' | 'info';
  onHide?: () => void;
  durationMs?: number;
};

export const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  variant = 'info',
  onHide,
  durationMs = 2200,
}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => onHide?.());
      }, durationMs);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, opacity, onHide, durationMs]);

  if (!visible) return null;

  const bg = variant === 'success' ? '#10b981' : variant === 'error' ? '#ef4444' : '#374151';
  const icon = variant === 'success' ? '✓' : variant === 'error' ? '⚠' : 'ℹ';

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.snack, { backgroundColor: bg }]}>
        <Text style={styles.icon}>{icon} </Text>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 1000,
  },
  snack: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { color: 'white', marginRight: 6 },
  text: { color: 'white' },
});

export default Snackbar;

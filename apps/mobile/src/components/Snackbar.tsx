import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type SnackbarProps = {
  visible: boolean;
  message: string;
  variant?: 'success' | 'error' | 'info';
  onHide?: () => void;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

export const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  variant = 'info',
  onHide,
  durationMs = 2200,
  actionLabel,
  onAction,
}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      // If an action is present, give the user longer to respond
      const timeout = actionLabel ? Math.max(durationMs, 4000) : durationMs;
      timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => onHide?.());
      }, timeout);
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
        {actionLabel && onAction ? (
          <Text
            style={styles.action}
            onPress={() => {
              try {
                onAction();
              } finally {
                onHide?.();
              }
            }}
          >
            {actionLabel}
          </Text>
        ) : null}
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
    gap: 8,
  },
  icon: { color: 'white', marginRight: 6 },
  text: { color: 'white' },
  action: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 12,
    textDecorationLine: 'underline',
  },
});

export default Snackbar;

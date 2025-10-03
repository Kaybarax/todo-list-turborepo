import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, useEnhancedTheme } from '@todo/ui-mobile';

export function GlobalThemeFAB() {
  const { themeName, toggleTheme } = useEnhancedTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        right: 16,
        top: insets.top + 16,
        zIndex: 1,
      }}
    >
      <TouchableOpacity
        style={[
          styles.themeToggle,
          {
            backgroundColor: themeName === 'light' ? '#2D3748' : '#EDF2F7',
            borderColor: themeName === 'light' ? '#2D3748' : '#4299E1',
          },
        ]}
        onPress={toggleTheme}
        accessibilityLabel="Toggle color theme"
      >
        <Icon
          name={themeName === 'light' ? 'sun-outline' : 'moon-outline'}
          size="md"
          color={themeName === 'light' ? '#FFFFFF' : '#4299E1'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

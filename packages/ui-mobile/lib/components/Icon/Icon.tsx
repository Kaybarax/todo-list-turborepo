/**
 * Icon Component
 * Icon component with consistent sizing and theming
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  size?: IconSize;
  color?: string;
  children: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({ size = 'md', color, children, testID, accessibilityLabel, style }) => {
  const { theme } = useTheme();

  // Get icon size in pixels
  const getIconSize = () => {
    const sizeMap = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    };
    return sizeMap[size];
  };

  // Get icon color
  const getIconColor = () => {
    return color || theme.colors.text.primary;
  };

  const iconSize = getIconSize();
  const iconColor = getIconColor();

  const containerStyles = [
    styles.container,
    {
      width: iconSize,
      height: iconSize,
    },
    style,
  ];

  return (
    <View style={containerStyles} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            width: iconSize,
            height: iconSize,
            color: iconColor,
          } as any)
        : children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Icon.displayName = 'Icon';

export default Icon;

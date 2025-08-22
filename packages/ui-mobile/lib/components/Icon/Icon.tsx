/**
 * Icon Component
 * Enhanced icon component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { Icon as UIKittenIcon, IconProps as UIKittenIconProps } from '@ui-kitten/components';
import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name?: string;
  size?: IconSize;
  color?: string;
  children?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  children,
  testID,
  accessibilityLabel,
  style,
}) => {
  const { theme, evaTheme } = useEnhancedTheme();

  // Get icon size in pixels for Eva Design
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

  // Get icon color from Eva theme or fallback to legacy theme
  const getIconColor = () => {
    if (color) return color;
    return evaTheme['text-basic-color'] || theme.colors.text.primary;
  };

  const iconSize = getIconSize();
  const iconColor = getIconColor();

  const customStyles = [
    {
      width: iconSize,
      height: iconSize,
      tintColor: iconColor,
    },
    style,
  ];

  // If name is provided, use UI Kitten Icon with Eva Design icon pack
  if (name) {
    return <UIKittenIcon name={name} style={customStyles} fill={iconColor} />;
  }

  // Fallback to children for custom icons
  if (children) {
    return React.isValidElement(children)
      ? React.cloneElement(children, {
          width: iconSize,
          height: iconSize,
          color: iconColor,
          style: customStyles,
        } as any)
      : children;
  }

  return null;
};

Icon.displayName = 'Icon';

export default Icon;

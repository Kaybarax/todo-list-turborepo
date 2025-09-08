/**
 * Icon Component
 * Enhanced icon component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Icon as UIKittenIcon, type IconProps as KittenIconProps } from '@ui-kitten/components';
import React, { useMemo } from 'react';
import { type ViewStyle } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps extends Omit<KittenIconProps, 'name'> {
  name?: string; // optional to keep parity
  size?: IconSize;
  color?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const IconBase: React.FC<IconProps> = ({ name, size = 'md', color, children, style, ...rest }) => {
  const { theme, evaTheme } = useEnhancedTheme();

  const iconSize = useMemo(() => SIZE_MAP[size] || SIZE_MAP.md, [size]);
  const iconColor = useMemo(
    () => color || evaTheme['text-basic-color'] || theme.colors.text.primary,
    [color, evaTheme, theme.colors.text.primary],
  );

  const customStyles = useMemo(
    () => [
      {
        width: iconSize,
        height: iconSize,
        tintColor: iconColor,
      },
      style,
    ],
    [iconSize, iconColor, style],
  );

  if (name) {
    return <UIKittenIcon name={name} style={customStyles} fill={iconColor} {...rest} />;
  }

  if (children) {
    return React.isValidElement(children)
      ? React.cloneElement(children, {
          width: iconSize,
          height: iconSize,
          color: iconColor,
          style: customStyles,
          ...rest,
        } as any)
      : children;
  }

  return null;
};

export const Icon = React.memo(IconBase);

Icon.displayName = 'Icon';

export default Icon;

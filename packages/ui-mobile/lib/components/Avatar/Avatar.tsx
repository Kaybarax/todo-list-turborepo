import { Avatar as KittenAvatar, type AvatarProps as KittenAvatarProps, Text } from '@ui-kitten/components';
import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type ImageSourcePropType,
} from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';
export type AvatarShape = 'round' | 'rounded' | 'square';

export interface AvatarProps extends Omit<KittenAvatarProps, 'size' | 'source'> {
  source?: ImageSourcePropType;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'medium',
  shape = 'round',
  backgroundColor,
  textColor,
  containerStyle,
  textStyle,
  style,
  ...props
}) => {
  const { evaTheme } = useEnhancedTheme();
  const kittenSize: KittenAvatarProps['size'] = useMemo(() => {
    switch (size) {
      case 'tiny':
      case 'small':
      case 'medium':
      case 'large':
      case 'giant':
        return size as KittenAvatarProps['size'];
      default:
        return 'medium';
    }
  }, [size]);

  const kittenShape: KittenAvatarProps['shape'] = useMemo(() => {
    switch (shape) {
      case 'rounded':
      case 'square':
      case 'round':
        return shape as KittenAvatarProps['shape'];
      default:
        return 'round';
    }
  }, [shape]);

  const textCategory = useMemo(() => {
    switch (size) {
      case 'tiny':
        return 'c2';
      case 'small':
        return 'c1';
      case 'large':
        return 'h6';
      case 'giant':
        return 'h5';
      case 'medium':
      default:
        return 'p2';
    }
  }, [size]);

  const customStyles = useMemo<ViewStyle>(() => {
    return {
      backgroundColor: backgroundColor || evaTheme['color-primary-default'] || '#3366FF',
    };
  }, [backgroundColor, evaTheme]);

  const computedTextColor = textColor ?? evaTheme['text-control-color'] ?? '#FFFFFF';

  const accessibilityLabel = useMemo(() => {
    if (initials && !source) return `Avatar ${initials}`;
    if (source) return 'User avatar image';
    return 'Avatar';
  }, [initials, source]);

  // Render initials fallback
  const renderInitials = () => {
    if (!initials || source) return null;
    return (
      <Text category={textCategory} style={[styles.initialsText, { color: computedTextColor }, textStyle] as any}>
        {initials}
      </Text>
    );
  };

  // Combine styles
  const avatarStyles = useMemo(
    () => ({
      ...customStyles,
      ...(style as any),
    }),
    [customStyles, style],
  );

  // If we have initials but no source, render custom avatar
  if (initials && !source) {
    return (
      <View
        style={[styles.customAvatar, styles[`${size}Avatar`], styles[`${shape}Shape`], customStyles, style] as any}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        {...(props as any)}
      >
        {renderInitials()}
      </View>
    );
  }

  // Use UI Kitten Avatar for images or default avatar
  return (
    <View style={containerStyle} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <KittenAvatar size={kittenSize} shape={kittenShape} source={source} style={avatarStyles} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  customAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Size styles
  tinyAvatar: {
    height: 24,
    width: 24,
  },
  smallAvatar: {
    height: 32,
    width: 32,
  },
  mediumAvatar: {
    height: 40,
    width: 40,
  },
  largeAvatar: {
    height: 56,
    width: 56,
  },
  giantAvatar: {
    height: 72,
    width: 72,
  },

  // Shape styles
  roundShape: {
    borderRadius: 1000, // Very large number for perfect circle
  },
  roundedShape: {
    borderRadius: 8,
  },
  squareShape: {
    borderRadius: 0,
  },
});

AvatarComponent.displayName = 'Avatar';

export const Avatar = React.memo(AvatarComponent);
export default Avatar;

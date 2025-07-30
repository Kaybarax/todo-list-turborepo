import React from 'react';
import { Avatar as KittenAvatar, AvatarProps as KittenAvatarProps, Text } from '@ui-kitten/components';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  StyleProp,
  ImageSourcePropType 
} from 'react-native';

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

const Avatar: React.FC<AvatarProps> = ({
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
  // Map our sizes to UI Kitten sizes
  const getKittenSize = (): KittenAvatarProps['size'] => {
    switch (size) {
      case 'tiny':
        return 'tiny';
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'giant':
        return 'giant';
      case 'medium':
      default:
        return 'medium';
    }
  };

  // Map our shapes to UI Kitten shapes
  const getKittenShape = (): KittenAvatarProps['shape'] => {
    switch (shape) {
      case 'rounded':
        return 'rounded';
      case 'square':
        return 'square';
      case 'round':
      default:
        return 'round';
    }
  };

  // Get text category based on size
  const getTextCategory = () => {
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
  };

  // Get custom styles for background and text color
  const getCustomStyles = () => {
    const customStyles: ViewStyle = {};
    if (backgroundColor) {
      customStyles.backgroundColor = backgroundColor;
    }
    return customStyles;
  };

  // Render initials fallback
  const renderInitials = () => {
    if (!initials || source) return null;
    
    return (
      <Text
        category={getTextCategory()}
        style={[
          styles.initialsText,
          { color: textColor || '#FFFFFF' },
          textStyle,
        ]}
      >
        {initials}
      </Text>
    );
  };

  // Combine styles
  const avatarStyles = {
    ...getCustomStyles(),
    ...(style as any),
  };

  // If we have initials but no source, render custom avatar
  if (initials && !source) {
    return (
      <View
        style={[
          styles.customAvatar,
          styles[`${size}Avatar`],
          styles[`${shape}Shape`],
          getCustomStyles(),
          containerStyle,
        ]}
        {...props}
      >
        {renderInitials()}
      </View>
    );
  }

  // Use UI Kitten Avatar for images or default avatar
  return (
    <View style={containerStyle}>
      <KittenAvatar
        size={getKittenSize()}
        shape={getKittenShape()}
        source={source}
        style={avatarStyles}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  customAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3366FF', // UI Kitten primary color
  },
  initialsText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Size styles
  tinyAvatar: {
    width: 24,
    height: 24,
  },
  smallAvatar: {
    width: 32,
    height: 32,
  },
  mediumAvatar: {
    width: 40,
    height: 40,
  },
  largeAvatar: {
    width: 56,
    height: 56,
  },
  giantAvatar: {
    width: 72,
    height: 72,
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

Avatar.displayName = 'Avatar';

export { Avatar };
export default Avatar;
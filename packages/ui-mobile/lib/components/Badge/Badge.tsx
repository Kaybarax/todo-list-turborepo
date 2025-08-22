import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';
import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'medium', style, textStyle, testID }) => {
  const { theme, evaTheme } = useEnhancedTheme();

  // Get badge background color based on variant using Eva Design tokens
  const getBadgeBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return evaTheme['color-primary-default'] || '#3366FF';
      case 'secondary':
        return evaTheme['text-hint-color'] || '#8F9BB3';
      case 'success':
        return evaTheme['color-success-default'] || '#00E096';
      case 'warning':
        return evaTheme['color-warning-default'] || '#FFAA00';
      case 'danger':
        return evaTheme['color-danger-default'] || '#FF3D71';
      case 'default':
      default:
        return evaTheme['background-basic-color-2'] || '#F7F9FC';
    }
  };

  // Get text color based on variant using Eva Design tokens
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'warning':
      case 'danger':
        return evaTheme['text-control-color'] || '#FFFFFF';
      case 'default':
      default:
        return evaTheme['text-hint-color'] || '#8F9BB3';
    }
  };

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'large':
        return styles.largeBadge;
      case 'medium':
      default:
        return styles.mediumBadge;
    }
  };

  // Get text category based on size
  const getTextCategory = () => {
    switch (size) {
      case 'small':
        return 'c2';
      case 'large':
        return 'p2';
      case 'medium':
      default:
        return 'c1';
    }
  };

  // Combine badge styles with dynamic background color
  const badgeStyles = [styles.badge, getSizeStyle(), { backgroundColor: getBadgeBackgroundColor() }, style];

  // Combine text styles
  const combinedTextStyle = [styles.text, { color: getTextColor() }, textStyle];

  return (
    <View style={badgeStyles} testID={testID}>
      <Text category={getTextCategory()} style={combinedTextStyle as any} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Size styles
  smallBadge: {
    minHeight: 16,
    paddingVertical: 2,
  },
  mediumBadge: {
    minHeight: 20,
    paddingVertical: 4,
  },
  largeBadge: {
    minHeight: 24,
    paddingVertical: 6,
  },
});

Badge.displayName = 'Badge';

export { Badge };
export default Badge;

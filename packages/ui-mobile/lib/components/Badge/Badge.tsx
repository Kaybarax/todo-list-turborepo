import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';

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
  // Note: UI Kitten doesn't have a Badge component, so we implement our own styling

  // Get badge background color based on variant
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBadge;
      case 'secondary':
        return styles.secondaryBadge;
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'danger':
        return styles.dangerBadge;
      case 'default':
      default:
        return styles.defaultBadge;
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'warning':
      case 'danger':
        return '#FFFFFF';
      case 'default':
      default:
        return '#8F9BB3'; // UI Kitten hint color
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

  // Combine badge styles
  const badgeStyles = [styles.badge, getBadgeStyle(), getSizeStyle(), style];

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

  // Variant styles - using UI Kitten color palette
  defaultBadge: {
    backgroundColor: '#F7F9FC', // UI Kitten background-basic-color-2
  },
  primaryBadge: {
    backgroundColor: '#3366FF', // UI Kitten color-primary-500
  },
  secondaryBadge: {
    backgroundColor: '#8F9BB3', // UI Kitten text-hint-color
  },
  successBadge: {
    backgroundColor: '#00E096', // UI Kitten color-success-500
  },
  warningBadge: {
    backgroundColor: '#FFAA00', // UI Kitten color-warning-500
  },
  dangerBadge: {
    backgroundColor: '#FF3D71', // UI Kitten color-danger-500
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../theme';

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

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
  testID,
}) => {
  return (
    <View
      style={[
        styles.badge,
        styles[`${variant}Badge`],
        styles[`${size}Badge`],
        style,
      ]}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: theme.fontWeights.medium as '500',
  },
  // Variant styles
  defaultBadge: {
    backgroundColor: theme.colors.light,
  },
  defaultText: {
    color: theme.colors.medium,
  },
  primaryBadge: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryBadge: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  successBadge: {
    backgroundColor: theme.colors.success,
  },
  successText: {
    color: theme.colors.white,
  },
  warningBadge: {
    backgroundColor: theme.colors.warning,
  },
  warningText: {
    color: theme.colors.white,
  },
  dangerBadge: {
    backgroundColor: theme.colors.danger,
  },
  dangerText: {
    color: theme.colors.white,
  },
  // Size styles
  smallBadge: {
    paddingVertical: theme.spacing.xs / 2,
  },
  smallText: {
    fontSize: theme.fontSizes.xs,
  },
  mediumBadge: {
    paddingVertical: theme.spacing.xs,
  },
  mediumText: {
    fontSize: theme.fontSizes.sm,
  },
  largeBadge: {
    paddingVertical: theme.spacing.sm,
  },
  largeText: {
    fontSize: theme.fontSizes.md,
  },
});

export default Badge;
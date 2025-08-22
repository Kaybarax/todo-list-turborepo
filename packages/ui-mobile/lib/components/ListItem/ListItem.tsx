/**
 * ListItem Component
 * Flexible list item component with leading/trailing elements
 */

import React, { ReactNode } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export type ListItemSize = 'sm' | 'md' | 'lg';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  size?: ListItemSize;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  size = 'md',
  leading,
  trailing,
  onPress,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}) => {
  const { theme } = useTheme();

  // Get size-based styles
  const getSizeStyles = () => {
    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 40,
      },
      md: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 56,
      },
      lg: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 72,
      },
    };

    return sizeStyles[size];
  };

  // Get text variants based on size
  const getTextVariants = () => {
    const variants = {
      sm: {
        title: 'body2' as const,
        subtitle: 'caption' as const,
        description: 'caption' as const,
      },
      md: {
        title: 'body1' as const,
        subtitle: 'body2' as const,
        description: 'caption' as const,
      },
      lg: {
        title: 'body1' as const,
        subtitle: 'body1' as const,
        description: 'body2' as const,
      },
    };

    return variants[size];
  };

  const sizeStyles = getSizeStyles();
  const textVariants = getTextVariants();

  const containerStyles = [
    styles.container,
    sizeStyles,
    {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: theme.borders.width.thin,
      borderBottomColor: theme.colors.border.default,
    },
    disabled && { opacity: 0.5 },
    style,
  ];

  const content = (
    <>
      {leading && <View style={styles.leading}>{leading}</View>}

      <View style={styles.content}>
        <Text variant={textVariants.title} color="primary" weight="medium" numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text variant={textVariants.subtitle} color="secondary" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}

        {description && (
          <Text variant={textVariants.description} color="secondary" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyles}
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyles} testID={testID} accessibilityLabel={accessibilityLabel}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leading: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  trailing: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
  description: {
    marginTop: 4,
  },
});

ListItem.displayName = 'ListItem';

export default ListItem;

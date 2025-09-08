/**
 * ListItem Component
 * Enhanced list item component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React, { type ReactNode } from 'react';
import { View, type ViewStyle, TouchableOpacity, StyleSheet, type StyleProp } from 'react-native';
import type { ListItemProps as UIKittenListItemProps } from '@ui-kitten/components';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { Text } from '../Text/Text';

export type ListItemSize = 'sm' | 'md' | 'lg';

// LIT-2: Extend UI Kitten props; omit styling & accessory fields we manage
export interface ListItemProps extends Omit<UIKittenListItemProps, 'children' | 'style'> {
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
  style?: StyleProp<ViewStyle>;
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
  const { theme, evaTheme } = useEnhancedTheme();

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

  const textVariants = getTextVariants();

  // Get Eva Design colors with fallbacks
  const getTextColor = (type: 'primary' | 'secondary') => {
    if (type === 'primary') return evaTheme['text-basic-color'] || theme.colors.text.primary;
    return evaTheme['text-hint-color'] || theme.colors.text.secondary;
  };

  // Custom styles for size-based styling
  const baseSpacingH = theme.spacing[size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'];
  const baseSpacingV = theme.spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'];

  const containerStyles: StyleProp<ViewStyle>[] = [
    styles.row,
    {
      minHeight: size === 'sm' ? 40 : size === 'lg' ? 72 : 56,
      paddingHorizontal: baseSpacingH,
      paddingVertical: baseSpacingV,
      backgroundColor: evaTheme['background-basic-color-1'] || theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
    },
    disabled ? styles.disabled : undefined,
    style,
  ];

  const content = (
    <>
      {leading && <View style={styles.leading}>{leading}</View>}

      <View style={styles.textColumn}>
        <Text variant={textVariants.title} color={getTextColor('primary')} weight="medium" numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text
            variant={textVariants.subtitle}
            color={getTextColor('secondary')}
            numberOfLines={1}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}

        {description && (
          <Text
            variant={textVariants.description}
            color={getTextColor('secondary')}
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </Text>
        )}
      </View>

      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  // LIT-3: Accessibility fallback label logic
  const finalA11yLabel = accessibilityLabel || title || subtitle || description || 'list item';

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyles as any}
        onPress={onPress}
        testID={testID}
        accessibilityLabel={finalA11yLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  // Non-pressable uses role=listitem for semantic grouping inside potential lists
  return (
    <View
      style={containerStyles as any}
      testID={testID}
      accessibilityLabel={finalA11yLabel}
      accessibilityState={disabled ? { disabled: true } : undefined}
      // Defensive: ignore any accidental onPress injection when disabled
      onStartShouldSetResponder={() => false}
    >
      {content}
    </View>
  );
};

ListItem.displayName = 'ListItem';

export default ListItem;

// Static styles (spacing & layout) extracted for reuse / perf
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  leading: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
  description: {
    marginTop: 4,
  },
});

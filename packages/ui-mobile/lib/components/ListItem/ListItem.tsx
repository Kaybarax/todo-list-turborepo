/**
 * ListItem Component
 * Enhanced list item component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React, { ReactNode } from 'react';
import { ListItem as UIKittenListItem } from '@ui-kitten/components';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
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
  const { theme, evaTheme } = useEnhancedTheme();

  // Map our sizes to UI Kitten sizes
  const getUIKittenSize = (): string => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      default:
        return 'medium';
    }
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

  const textVariants = getTextVariants();

  // Get Eva Design colors with fallbacks
  const getTextColor = (type: 'primary' | 'secondary') => {
    if (type === 'primary') return evaTheme['text-basic-color'] || theme.colors.text.primary;
    return evaTheme['text-hint-color'] || theme.colors.text.secondary;
  };

  // Custom styles for size-based styling
  const containerStyles = [
    {
      minHeight: size === 'sm' ? 40 : size === 'lg' ? 72 : 56,
      paddingHorizontal: theme.spacing[size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'],
      paddingVertical: theme.spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'],
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: evaTheme['background-basic-color-1'] || theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
    },
    disabled && { opacity: 0.5 },
    style,
  ];

  const content = (
    <>
      {leading && <View style={{ marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>{leading}</View>}

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant={textVariants.title} color={getTextColor('primary')} weight="medium" numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text
            variant={textVariants.subtitle}
            color={getTextColor('secondary')}
            numberOfLines={1}
            style={{ marginTop: 2 }}
          >
            {subtitle}
          </Text>
        )}

        {description && (
          <Text
            variant={textVariants.description}
            color={getTextColor('secondary')}
            numberOfLines={2}
            style={{ marginTop: 4 }}
          >
            {description}
          </Text>
        )}
      </View>

      {trailing && <View style={{ marginLeft: 12, alignItems: 'center', justifyContent: 'center' }}>{trailing}</View>}
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

ListItem.displayName = 'ListItem';

export default ListItem;

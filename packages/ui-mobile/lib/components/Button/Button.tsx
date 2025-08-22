/**
 * Button Component
 * Enhanced button component with design tokens and theme integration
 */

import React, { ReactNode } from 'react';
import { TouchableOpacity, View, ActivityIndicator, StyleSheet, ViewStyle, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onPress: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onPress,
  children,
  testID,
  accessibilityLabel,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Get button styles based on variant and theme
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: theme.borders.radius.md,
      borderWidth: theme.borders.width.thin,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 32,
      },
      md: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
      },
      secondary: {
        backgroundColor: theme.colors.secondary[500],
        borderColor: theme.colors.secondary[500],
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        minHeight: undefined,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' as const }),
      ...(disabled && { opacity: 0.5 }),
    };
  };

  // Get text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text.inverse;
      case 'outline':
        return theme.colors.primary[500];
      case 'ghost':
      case 'link':
        return theme.colors.primary[500];
      default:
        return theme.colors.text.primary;
    }
  };

  // Get text variant based on size
  const getTextVariant = () => {
    switch (size) {
      case 'sm':
        return 'body2' as const;
      case 'lg':
        return 'body1' as const;
      case 'md':
      default:
        return 'body1' as const;
    }
  };

  // Render button content
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={getTextColor()} testID={`${testID}-loading`} />;
    }

    const iconElement = icon && (
      <View style={[styles.iconContainer, iconPosition === 'right' && styles.iconRight]}>{icon}</View>
    );

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && iconElement}
        <Text variant={getTextVariant()} color={getTextColor()} weight="medium" style={styles.text}>
          {children}
        </Text>
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

  const buttonStyles = [getButtonStyles(), style];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
  },
});

Button.displayName = 'Button';

export default Button;

/**
 * Input Component
 * Enhanced input component with design tokens and theme integration
 */

import React, { ReactNode, useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export type InputVariant = 'outline' | 'filled' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  multiline?: boolean;
  secureTextEntry?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  variant = 'outline',
  size = 'md',
  status = 'default',
  disabled = false,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  secureTextEntry = false,
  testID,
  accessibilityLabel,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Get input container styles based on variant, size, and status
  const getContainerStyles = () => {
    const baseStyles = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderRadius: theme.borders.radius.md,
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

    const getBorderColor = () => {
      if (status === 'error') return theme.colors.error[500];
      if (status === 'success') return theme.colors.success[500];
      if (isFocused) return theme.colors.border.focus;
      return theme.colors.border.default;
    };

    const getBackgroundColor = () => {
      if (variant === 'filled') return theme.colors.surface;
      return 'transparent';
    };

    const variantStyles = {
      outline: {
        borderWidth: theme.borders.width.thin,
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      },
      filled: {
        borderWidth: 0,
        backgroundColor: theme.colors.surface,
      },
      underline: {
        borderWidth: 0,
        borderBottomWidth: theme.borders.width.thin,
        borderBottomColor: getBorderColor(),
        borderRadius: 0,
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.5 }),
    };
  };

  // Get text input styles
  const getTextInputStyles = () => {
    const textVariant = size === 'sm' ? 'body2' : 'body1';
    const variantStyles = theme.typography.textVariants[textVariant];

    return {
      flex: 1,
      fontSize: variantStyles.fontSize,
      fontWeight: variantStyles.fontWeight as any,
      lineHeight: variantStyles.fontSize * variantStyles.lineHeight,
      color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
      fontFamily: theme.typography.fontFamilies.primary,
    };
  };

  // Get placeholder text color
  const getPlaceholderColor = () => {
    return disabled ? theme.colors.text.disabled : theme.colors.text.secondary;
  };

  const containerStyles = [getContainerStyles(), style];
  const textInputStyles = getTextInputStyles();

  return (
    <View style={containerStyles}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <TextInput
        style={textInputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={getPlaceholderColor()}
        editable={!disabled}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
        {...props}
      />

      {rightIcon && (
        <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress} disabled={!onRightIconPress}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

Input.displayName = 'Input';

export default Input;

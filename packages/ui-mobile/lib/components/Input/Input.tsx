/**
 * Input Component
 * Enhanced input component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Input as UIKittenInput, InputProps as UIKittenInputProps } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { type ViewStyle, StyleSheet } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type InputVariant = 'outline' | 'filled' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

export interface InputProps {
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

  // Map our status to UI Kitten status
  const getUIKittenStatus = (): string | undefined => {
    switch (status) {
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'basic';
    }
  };

  // Render left icon accessory
  const renderLeftIcon = (props: any) => leftIcon;

  // Render right icon accessory
  const renderRightIcon = (props: any) => rightIcon;

  // Custom styles for variant handling
  const customStyles = [
    variant === 'filled' && styles.filledVariant,
    variant === 'underline' && styles.underlineVariant,
    style,
  ] as any;

  return (
    <UIKittenInput
      size={getUIKittenSize()}
      status={getUIKittenStatus()}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      secureTextEntry={secureTextEntry}
      style={customStyles}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  filledVariant: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  underlineVariant: {
    borderRadius: 0,
    borderBottomWidth: 1,
  },
});

Input.displayName = 'Input';

export default Input;

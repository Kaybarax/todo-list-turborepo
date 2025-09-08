/**
 * Input Component
 * Enhanced input component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Input as UIKittenInput } from '@ui-kitten/components';
import type { InputProps as UIKittenInputProps } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { type ViewStyle, StyleSheet } from 'react-native';
import {
  mapInputSize,
  mapInputStatus,
  type InputSize as MappingInputSize,
  type InputStatus as MappingInputStatus,
  type InputVariant as MappingInputVariant,
} from '../../utils/componentMappings';

// No theme usage here

export type InputVariant = MappingInputVariant;
export type InputSize = MappingInputSize;
export type InputStatus = MappingInputStatus;

export interface InputProps {
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
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
  onSubmitEditing,
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
  // Shared mapping
  const normalizedSize = mapInputSize(size);
  const normalizedStatus = mapInputStatus(status);

  // Render left/right icon accessories
  const renderLeftIcon = leftIcon ? () => leftIcon as any : undefined;
  const renderRightIcon = rightIcon ? () => rightIcon as any : undefined;

  // Custom styles for variant handling
  const customStyles = [
    variant === 'filled' && styles.filledVariant,
    variant === 'underline' && styles.underlineVariant,
    style,
  ] as any;

  return (
    <UIKittenInput
      size={normalizedSize}
      status={normalizedStatus}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      multiline={multiline}
      secureTextEntry={secureTextEntry}
      accessoryLeft={renderLeftIcon}
      accessoryRight={renderRightIcon}
      style={customStyles}
      testID={testID}
      {...(props as unknown as Partial<UIKittenInputProps>)}
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

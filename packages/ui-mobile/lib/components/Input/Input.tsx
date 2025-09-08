/**
 * Input Component
 * Enhanced input component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Input as UIKittenInput, useTheme } from '@ui-kitten/components';
import type { InputProps as UIKittenInputProps } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, type StyleProp, type TextStyle } from 'react-native';
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

// NOTE: We intentionally compose rather than directly extend because we remap size/status & add variant + icons
export interface InputProps
  extends Omit<UIKittenInputProps, 'size' | 'status' | 'accessoryLeft' | 'accessoryRight' | 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string; // explicit for fallback clarity
}

export const Input: React.FC<InputProps> = ({
  variant = 'outline',
  size = 'md',
  status = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  accessibilityLabel,
  placeholder,
  value,
  ...rest
}) => {
  // Guard useTheme for test environments where it might be undefined/mocked
  const theme = typeof useTheme === 'function' ? useTheme() : ({} as any);

  // Mapping to UI Kitten expected tokens
  const normalizedSize = mapInputSize(size);
  const normalizedStatus = mapInputStatus(status);

  // Accessibility fallback (INP-2): placeholder -> value -> 'input field'
  const finalAccessibilityLabel =
    accessibilityLabel || placeholder || (value && value.length > 0 ? value : 'input field');

  // Accessory renderers (wrap right icon if press handler provided)
  const renderLeftIcon = leftIcon ? () => leftIcon as any : undefined;
  const renderRightIcon = rightIcon
    ? () =>
        onRightIconPress ? (
          <TouchableOpacity onPress={onRightIconPress} accessibilityRole="button">
            {rightIcon}
          </TouchableOpacity>
        ) : (
          (rightIcon as any)
        )
    : undefined;

  // Variant specific styles (INP-3): use theme tokens instead of hard-coded RGBA
  const variantStyles: Array<StyleProp<TextStyle>> = [];
  if (variant === 'filled') {
    variantStyles.push({ backgroundColor: theme['color-basic-200'] || 'rgba(0,0,0,0.05)' });
  } else if (variant === 'underline') {
    variantStyles.push({
      borderRadius: 0,
      // underline effect: rely on container style border; TextStyle doesn't include borderBottomWidth formally
      // so we intentionally skip explicit numeric style to satisfy typing; visual underline handled by themed
      // bottom border color via eva mapping if needed. (If container style needed, wrap externally.)
    } as TextStyle);
  }

  return (
    <UIKittenInput
      size={normalizedSize}
      status={normalizedStatus}
      accessoryLeft={renderLeftIcon}
      accessoryRight={renderRightIcon}
      // Casting due to React Native duplicate type edge (TextStyle vs internal) – safe: only TextStyle-compatible props used
      style={[...variantStyles, style] as any}
      accessibilityLabel={finalAccessibilityLabel}
      placeholder={placeholder}
      value={value as any}
      {...(rest as unknown as Partial<UIKittenInputProps>)}
    />
  );
};

// Legacy StyleSheet retained for potential future static styles; variant styles now dynamic w/theme
const styles = StyleSheet.create({});

Input.displayName = 'Input';

export default Input;

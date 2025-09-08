/**
 * Button Component
 * Enhanced button component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Button as UIKittenButton, Spinner } from '@ui-kitten/components';
import type { ButtonProps as UIKittenButtonProps } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { type ViewStyle, View, StyleSheet } from 'react-native';
import {
  mapButtonAppearance,
  mapButtonSize,
  mapButtonStatus,
  type ButtonVariant as MappingButtonVariant,
  type ButtonSize as MappingButtonSize,
} from '../../utils/componentMappings';

// No theme usage required here

export type ButtonVariant = MappingButtonVariant;
export type ButtonSize = MappingButtonSize;

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
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
  onLongPress,
  onFocus,
  onBlur,
  children,
  testID,
  accessibilityLabel,
  accessibilityHint,
  style,
  ...props
}) => {
  // no-op

  // Mapping via shared util
  const appearance = mapButtonAppearance(variant);
  const normalizedSize = mapButtonSize(size);
  const status = mapButtonStatus(variant);

  // Render loading indicator
  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.loadingContainer]} testID="button-loading-indicator">
      <Spinner size="small" />
    </View>
  );

  // Render icon accessory
  const renderIcon = (props: any) => <View style={[props.style, styles.iconContainer]}>{icon}</View>;

  // Custom styles for fullWidth and link variant
  const customStyles = [fullWidth && styles.fullWidth, variant === 'link' && styles.linkButton, style] as any;

  const accessibilityState = { disabled: disabled || loading, busy: !!loading } as const;

  return (
    <UIKittenButton
      appearance={appearance}
      size={normalizedSize}
      status={status}
      disabled={disabled || loading}
      onPress={onPress}
      onLongPress={onLongPress}
      onFocus={onFocus}
      onBlur={onBlur}
      accessoryLeft={loading ? LoadingIndicator : iconPosition === 'left' && icon ? renderIcon : undefined}
      accessoryRight={iconPosition === 'right' && icon && !loading ? renderIcon : undefined}
      style={customStyles}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessible
      accessibilityState={accessibilityState}
      {...(props as Partial<UIKittenButtonProps>)}
    >
      {loading && !icon && (
        <View style={styles.loadingContainer} testID="button-loading-indicator">
          <Spinner size="small" />
        </View>
      )}
      {children}
    </UIKittenButton>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  linkButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

Button.displayName = 'Button';

export default Button;

/**
 * Button Component
 * Enhanced button component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Button as UIKittenButton, Spinner, useTheme } from '@ui-kitten/components';
import type { ButtonProps as UIKittenButtonProps } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { type ViewStyle, type StyleProp, View, StyleSheet } from 'react-native';
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

// BTN-1: Compose props from UI Kitten without direct inheritance to avoid RN duplicate type resolution issues
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  // Selected passthrough interaction props
  onPress?: UIKittenButtonProps['onPress'];
  onLongPress?: UIKittenButtonProps['onLongPress'];
  onFocus?: UIKittenButtonProps['onFocus'];
  onBlur?: UIKittenButtonProps['onBlur'];
  disabled?: UIKittenButtonProps['disabled'];
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

  // BTN-4: Theme aware styling (especially for link variant)
  const theme = useTheme?.();
  // Derive text / background intent for link variant using theme tokens where available
  const linkVariantStyle: ViewStyle | undefined =
    variant === 'link'
      ? {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
          // Use primary color for potential child text if consumer does not override
          // (UI Kitten will handle text color based on status/appearance, but we provide a fallback)
          ...(theme
            ? {
                // No direct token for transparent text; rely on primary color for emphasis
                // Consumers can override via text elements inside the button
              }
            : {}),
        }
      : undefined;

  // BTN-2: Consolidate loading indicator (single accessory path) & icon logic
  const renderIcon = (iconProps: any) => <View style={[iconProps.style, styles.iconContainer]}>{icon}</View>;

  const accessoryLeft = !loading && iconPosition === 'left' && icon ? renderIcon : undefined;
  const accessoryRight = !loading && iconPosition === 'right' && icon ? renderIcon : undefined;

  // Custom styles for fullWidth and link variant
  const customStyles = [fullWidth && styles.fullWidth, linkVariantStyle, style] as any;

  const accessibilityState = { disabled: disabled || loading, busy: !!loading } as const;

  // BTN-3: Fallback accessibility label (children text or variant)
  const computedA11yLabel =
    accessibilityLabel ?? (typeof children === 'string' ? (children as string) : `${variant} button`);

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
      accessoryLeft={accessoryLeft}
      accessoryRight={accessoryRight}
      style={customStyles}
      testID={testID}
      accessibilityLabel={computedA11yLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessible
      accessibilityState={accessibilityState}
      {...(props as Partial<UIKittenButtonProps>)}
    >
      {loading ? (
        <View style={styles.contentRow}>
          {children}
          <View style={styles.loadingOverlay} testID="button-loading-indicator" accessibilityRole="progressbar">
            <Spinner size="small" />
          </View>
        </View>
      ) : (
        children
      )}
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
  loadingOverlay: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Button.displayName = 'Button';

export default Button;

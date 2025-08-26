/**
 * Button Component
 * Enhanced button component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Button as UIKittenButton, ButtonProps as UIKittenButtonProps, Spinner } from '@ui-kitten/components';
import React, { type ReactNode } from 'react';
import { type ViewStyle, ActivityIndicator, View, StyleSheet } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
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
  const { theme, evaTheme } = useEnhancedTheme();

  // Map our variants to UI Kitten appearances
  const getUIKittenAppearance = (): string => {
    switch (variant) {
      case 'primary':
        return 'filled';
      case 'secondary':
        return 'filled';
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      case 'link':
        return 'ghost';
      default:
        return 'filled';
    }
  };

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

  // Get status for secondary variant
  const getUIKittenStatus = (): string | undefined => {
    switch (variant) {
      case 'secondary':
        return 'basic';
      default:
        return undefined;
    }
  };

  // Render loading indicator
  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.loadingContainer]}>
      <Spinner size="small" />
    </View>
  );

  // Render icon accessory
  const renderIcon = (props: any) => <View style={[props.style, styles.iconContainer]}>{icon}</View>;

  // Custom styles for fullWidth and link variant
  const customStyles = [fullWidth && styles.fullWidth, variant === 'link' && styles.linkButton, style] as any;

  return (
    <UIKittenButton
      appearance={getUIKittenAppearance()}
      size={getUIKittenSize()}
      status={getUIKittenStatus()}
      disabled={disabled || loading}
      onPress={onPress}
      accessoryLeft={loading ? LoadingIndicator : iconPosition === 'left' && icon ? renderIcon : undefined}
      accessoryRight={iconPosition === 'right' && icon && !loading ? renderIcon : undefined}
      style={customStyles}
      testID={testID}
    >
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

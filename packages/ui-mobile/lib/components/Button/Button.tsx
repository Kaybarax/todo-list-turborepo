import React from 'react';
import { Button as KittenButton, ButtonProps as KittenButtonProps } from '@ui-kitten/components';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<KittenButtonProps, 'status' | 'size' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  fullWidth?: boolean;
  rounded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  iconColor,
  fullWidth = false,
  rounded = false,
  disabled,
  style,
  ...props
}) => {
  // Map our variants to UI Kitten status
  const getKittenStatus = (): KittenButtonProps['status'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'basic';
      case 'outline':
        return 'primary';
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      case 'ghost':
        return 'basic';
      default:
        return 'primary';
    }
  };

  // Map our variants to UI Kitten appearance
  const getKittenAppearance = (): KittenButtonProps['appearance'] => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      default:
        return 'filled';
    }
  };

  // Map our sizes to UI Kitten sizes
  const getKittenSize = (): KittenButtonProps['size'] => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'medium';
    }
  };

  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  // Get icon color based on variant and UI Kitten theme
  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    // UI Kitten will handle the color based on status and appearance
    // We'll use a default that works with most themes
    switch (variant) {
      case 'outline':
      case 'ghost':
        return '#3366FF'; // UI Kitten primary color
      default:
        return '#FFFFFF';
    }
  };

  // Render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    
    return (
      <MaterialIcons 
        name={leftIcon} 
        size={getIconSize()} 
        color={getIconColor()} 
        style={styles.leftIcon} 
      />
    );
  };

  // Render right icon
  const renderRightIcon = () => {
    if (!rightIcon) return null;
    
    return (
      <MaterialIcons 
        name={rightIcon} 
        size={getIconSize()} 
        color={getIconColor()} 
        style={styles.rightIcon} 
      />
    );
  };

  // Render button content
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#3366FF' : '#FFFFFF'}
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {renderLeftIcon()}
        {title}
        {renderRightIcon()}
      </View>
    );
  };

  // Combine styles
  const buttonStyles = [
    fullWidth && styles.fullWidth,
    rounded && styles.rounded,
    style,
  ];

  return (
    <KittenButton
      status={getKittenStatus()}
      appearance={getKittenAppearance()}
      size={getKittenSize()}
      disabled={disabled || loading}
      style={buttonStyles}
      {...props}
    >
      {renderContent()}
    </KittenButton>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: 25,
  },
});

Button.displayName = 'Button';

export { Button };
export default Button;
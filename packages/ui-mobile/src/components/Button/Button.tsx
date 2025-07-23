import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  rounded?: boolean;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  iconColor,
  style,
  textStyle,
  fullWidth = false,
  rounded = false,
  accessibilityLabel,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    rounded && styles.roundedButton,
    fullWidth && styles.fullWidthButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    switch (variant) {
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.white;
    }
  };

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <MaterialIcons 
              name={leftIcon} 
              size={iconSize} 
              color={getIconColor()} 
              style={styles.leftIcon} 
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && (
            <MaterialIcons 
              name={rightIcon} 
              size={iconSize} 
              color={getIconColor()} 
              style={styles.rightIcon} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  dangerButton: {
    backgroundColor: theme.colors.danger,
  },
  dangerText: {
    color: theme.colors.white,
  },
  successButton: {
    backgroundColor: theme.colors.success,
  },
  successText: {
    color: theme.colors.white,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: theme.colors.primary,
  },
  // Size styles
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minWidth: 80,
  },
  smallText: {
    fontSize: theme.fontSizes.sm,
  },
  mediumButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minWidth: 120,
  },
  mediumText: {
    fontSize: theme.fontSizes.md,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minWidth: 160,
  },
  largeText: {
    fontSize: theme.fontSizes.lg,
  },
  // State styles
  disabledButton: {
    backgroundColor: theme.colors.medium,
    opacity: 0.5,
    borderWidth: 0,
  },
  disabledText: {
    color: theme.colors.light,
  },
  // Additional styles
  roundedButton: {
    borderRadius: theme.borderRadius.round,
  },
  fullWidthButton: {
    width: '100%',
  },
});

export default Button;

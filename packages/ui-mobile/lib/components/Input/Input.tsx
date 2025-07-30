import React from 'react';
import { 
  Input as KittenInput, 
  InputProps as KittenInputProps,
  Text
} from '@ui-kitten/components';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  StyleProp 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type InputVariant = 'default' | 'outline' | 'filled';
export type InputSize = 'small' | 'medium' | 'large';
export type InputStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface InputProps extends Omit<KittenInputProps, 'status' | 'size' | 'accessoryLeft' | 'accessoryRight'> {
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'medium',
  status = 'basic',
  label,
  error = false,
  errorMessage,
  helperText,
  leftIcon,
  rightIcon,
  iconColor,
  containerStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  fullWidth = false,
  required = false,
  disabled,
  style,
  ...props
}) => {
  // Map our variants to UI Kitten appearance
  const getKittenAppearance = (): KittenInputProps['appearance'] => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'filled':
        return 'filled';
      case 'default':
      default:
        return 'outline'; // UI Kitten default
    }
  };

  // Map our sizes to UI Kitten sizes
  const getKittenSize = (): KittenInputProps['size'] => {
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

  // Determine the status (error takes precedence)
  const getKittenStatus = (): KittenInputProps['status'] => {
    if (error) return 'danger';
    return status;
  };

  // Get icon size based on input size
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

  // Get icon color
  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (error) return '#FF3D71'; // UI Kitten danger color
    if (disabled) return '#8F9BB3'; // UI Kitten disabled color
    return '#8F9BB3'; // UI Kitten hint color
  };

  // Render left accessory (icon)
  const renderLeftAccessory = () => {
    if (!leftIcon) return undefined;
    
    return (
      <MaterialIcons 
        name={leftIcon} 
        size={getIconSize()} 
        color={getIconColor()} 
      />
    );
  };

  // Render right accessory (icon)
  const renderRightAccessory = () => {
    if (!rightIcon) return undefined;
    
    return (
      <MaterialIcons 
        name={rightIcon} 
        size={getIconSize()} 
        color={getIconColor()} 
      />
    );
  };

  // Render label with required indicator
  const renderLabel = () => {
    if (!label) return null;
    
    const labelText = required ? `${label} *` : label;
    
    return (
      <Text 
        category="label" 
        style={[styles.label, labelStyle]}
      >
        {labelText}
      </Text>
    );
  };

  // Render error message
  const renderError = () => {
    if (!error || !errorMessage) return null;
    
    return (
      <Text 
        category="c2" 
        status="danger"
        style={[styles.errorText, errorStyle]}
      >
        {errorMessage}
      </Text>
    );
  };

  // Render helper text
  const renderHelper = () => {
    if (!helperText || error) return null;
    
    return (
      <Text 
        category="c2" 
        appearance="hint"
        style={[styles.helperText, helperStyle]}
      >
        {helperText}
      </Text>
    );
  };

  // Combine input styles
  const inputStyles = [
    fullWidth && styles.fullWidth,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      <KittenInput
        appearance={getKittenAppearance()}
        size={getKittenSize()}
        status={getKittenStatus()}
        disabled={disabled}
        accessoryLeft={renderLeftAccessory()}
        accessoryRight={renderRightAccessory()}
        style={inputStyles}
        {...props}
      />
      {renderError()}
      {renderHelper()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  required: {
    color: '#FF3D71', // UI Kitten danger color
  },
  errorText: {
    marginTop: 4,
  },
  helperText: {
    marginTop: 4,
  },
  fullWidth: {
    width: '100%',
  },
});

Input.displayName = 'Input';

export { Input };
export default Input;
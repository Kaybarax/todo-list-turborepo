import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      errorMessage,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      leftIcon,
      rightIcon,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        )}
        <View style={styles.inputContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : null,
              rightIcon ? styles.inputWithRightIcon : null,
              error ? styles.inputError : null,
              inputStyle,
              style,
            ]}
            placeholderTextColor={theme.colors.medium}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
        {error && errorMessage && (
          <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium as '500',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.xs,
    marginTop: theme.spacing.xs,
  },
  leftIcon: {
    position: 'absolute',
    left: theme.spacing.sm,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: theme.spacing.sm,
    zIndex: 1,
  },
});

export default Input;
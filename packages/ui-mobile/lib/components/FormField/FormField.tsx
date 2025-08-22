/**
 * FormField Component
 * Wrapper component with label, error, and hint support
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  testID?: string;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required = false,
  children,
  testID,
  style,
}) => {
  const { theme } = useTheme();

  // Render label with required indicator
  const renderLabel = () => {
    if (!label) return null;

    const labelText = required ? `${label} *` : label;

    return (
      <View style={styles.labelContainer}>
        <Text variant="body2" color="primary" weight="medium" style={styles.label}>
          {labelText}
        </Text>
        {required && (
          <Text variant="body2" color={theme.colors.error[500]} style={styles.required}>
            *
          </Text>
        )}
      </View>
    );
  };

  // Render error message
  const renderError = () => {
    if (!error) return null;

    return (
      <Text
        variant="caption"
        color={theme.colors.error[500]}
        style={[styles.message, styles.errorMessage]}
        testID={`${testID}-error`}
      >
        {error}
      </Text>
    );
  };

  // Render hint text
  const renderHint = () => {
    if (!hint || error) return null; // Don't show hint when there's an error

    return (
      <Text variant="caption" color="secondary" style={[styles.message, styles.hintMessage]} testID={`${testID}-hint`}>
        {hint}
      </Text>
    );
  };

  const containerStyles = [styles.container, { marginBottom: theme.spacing.lg }, style];

  return (
    <View style={containerStyles} testID={testID}>
      {renderLabel()}
      <View style={styles.fieldContainer}>{children}</View>
      {renderError()}
      {renderHint()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    flex: 1,
  },
  required: {
    marginLeft: 2,
  },
  fieldContainer: {
    width: '100%',
  },
  message: {
    marginTop: 4,
  },
  errorMessage: {
    // Additional error-specific styles can go here
  },
  hintMessage: {
    // Additional hint-specific styles can go here
  },
});

FormField.displayName = 'FormField';

export default FormField;

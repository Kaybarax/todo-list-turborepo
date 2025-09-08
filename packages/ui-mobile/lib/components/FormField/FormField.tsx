/**
 * FormField Component
 * Enhanced form field wrapper with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { Text } from '../Text/Text';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  testID?: string;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required = false,
  children,
  testID,
  style,
  accessibilityHint,
}) => {
  const { theme, evaTheme } = useEnhancedTheme();

  // Get Eva Design colors with fallbacks
  const getErrorColor = () => evaTheme['color-danger-default'] || theme.colors.error[500];
  const getHintColor = () => evaTheme['text-hint-color'] || theme.colors.text.secondary;
  const getLabelColor = () => evaTheme['text-basic-color'] || theme.colors.text.primary;

  // Render label with required indicator
  const labelId = testID ? `${testID}-label` : undefined;
  const errorId = error && testID ? `${testID}-error` : undefined;
  const hintId = hint && !error && testID ? `${testID}-hint` : undefined;

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={styles.labelContainer}>
        <Text
          variant="body2"
          color={getLabelColor()}
          weight="medium"
          style={styles.label}
          nativeID={labelId}
          accessibilityLabel={label}
        >
          {label}
          {required && (
            <Text variant="body2" color={getErrorColor()} style={styles.required}>
              {' *'}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  // Render error message
  const renderError = () => {
    if (!error) return null;

    return (
      <Text
        variant="caption"
        color={getErrorColor()}
        style={[styles.message, styles.errorMessage]}
        testID={`${testID}-error`}
        nativeID={errorId}
        accessibilityLabel={error}
      >
        {error}
      </Text>
    );
  };

  // Render hint text
  const renderHint = () => {
    if (!hint || error) return null; // Don't show hint when there's an error

    return (
      <Text
        variant="caption"
        color={getHintColor()}
        style={[styles.message, styles.hintMessage]}
        testID={`${testID}-hint`}
        nativeID={hintId}
        accessibilityLabel={hint}
      >
        {hint}
      </Text>
    );
  };

  const containerStyles = [styles.container, { marginBottom: theme.spacing.lg }, style];

  const accessibilityProps: any = {};
  if (labelId) accessibilityProps.accessibilityLabel = label;
  if (errorId || hintId) accessibilityProps.accessibilityDescribedBy = [errorId, hintId].filter(Boolean).join(' ');
  if (accessibilityHint) accessibilityProps.accessibilityHint = accessibilityHint;

  return (
    <View style={containerStyles} testID={testID} {...accessibilityProps}>
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

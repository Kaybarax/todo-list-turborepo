import { CheckBox, type CheckBoxProps as KittenCheckBoxProps, Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type CheckboxStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface CheckboxProps extends Omit<KittenCheckBoxProps, 'checked' | 'onChange' | 'status'> {
  checked: boolean;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (arg: boolean) => void;
  label?: string;
  status?: CheckboxStatus;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onValueChange,
  label,
  status = 'primary',
  containerStyle,
  labelStyle,
  disabled,
  indeterminate = false,
  style,
  ...props
}) => {
  const { theme, evaTheme } = useEnhancedTheme();
  // Map our status to UI Kitten status
  const getKittenStatus = (): KittenCheckBoxProps['status'] => {
    return status;
  };

  // Handle value change
  const handleChange = (isChecked: boolean) => {
    if (!disabled) {
      onValueChange(isChecked);
    }
  };

  // Get Eva Design colors
  const getDisabledOpacity = () => parseFloat(evaTheme['opacity-disabled'] || '0.6');
  const getHintColor = () => evaTheme['text-hint-color'] || theme.colors.text.secondary;

  // Render label text
  const renderLabel = () => {
    if (!label) return undefined;

    return (
      <Text
        category="p1"
        style={
          [
            styles.label,
            {
              marginLeft: theme.spacing.sm, // Use theme spacing
            },
            disabled && { color: getHintColor() },
            labelStyle,
          ] as any
        }
      >
        {label}
      </Text>
    );
  };

  // Combine checkbox styles
  const checkboxStyles = [styles.checkbox, style];

  // Dynamic container styles with Eva Design tokens
  const containerStyles = [styles.container, disabled && { opacity: getDisabledOpacity() }, containerStyle];

  return (
    <View style={containerStyles}>
      <CheckBox
        checked={checked}
        onChange={handleChange}
        status={getKittenStatus()}
        disabled={disabled}
        indeterminate={indeterminate}
        style={checkboxStyles}
        {...props}
      >
        {renderLabel()}
      </CheckBox>
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    // UI Kitten CheckBox handles its own styling
  },
  container: {
    // Container styles handled by UI Kitten CheckBox
  },
  label: {
    // Label styles handled dynamically with Eva Design tokens
  },
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;

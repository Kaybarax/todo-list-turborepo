import { CheckBox, CheckBoxProps as KittenCheckBoxProps, Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

export type CheckboxStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface CheckboxProps extends Omit<KittenCheckBoxProps, 'checked' | 'onChange' | 'status'> {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
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

  // Render label text
  const renderLabel = () => {
    if (!label) return undefined;

    return (
      <Text category="p1" style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
        {label}
      </Text>
    );
  };

  // Combine checkbox styles
  const checkboxStyles = [styles.checkbox, style];

  return (
    <View style={[styles.container, disabled && styles.containerDisabled, containerStyle]}>
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
  containerDisabled: {
    opacity: 0.6,
  },
  label: {
    marginLeft: 8,
  },
  labelDisabled: {
    color: '#8F9BB3', // UI Kitten text-hint-color
  },
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;

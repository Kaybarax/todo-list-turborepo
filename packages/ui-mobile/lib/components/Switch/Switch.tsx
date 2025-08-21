import { Toggle, type ToggleProps as KittenToggleProps, Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';

export type SwitchStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface SwitchProps extends Omit<KittenToggleProps, 'checked' | 'onChange' | 'status'> {
  value: boolean;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (arg: boolean) => void;
  label?: string;
  status?: SwitchStatus;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  status = 'primary',
  containerStyle,
  labelStyle,
  disabled,
  style,
  ...props
}) => {
  // Map our status to UI Kitten status
  const getKittenStatus = (): KittenToggleProps['status'] => {
    return status;
  };

  // Handle value change
  const handleChange = (checked: boolean) => {
    if (!disabled) {
      onValueChange(checked);
    }
  };

  // Combine switch styles
  const switchStyles = [styles.switch, style];

  return (
    <View style={[styles.container, disabled && styles.containerDisabled, containerStyle]}>
      {label && (
        <Text category="p1" style={[styles.label, disabled && styles.labelDisabled, labelStyle] as any}>
          {label}
        </Text>
      )}
      <Toggle
        checked={value}
        onChange={handleChange}
        status={getKittenStatus()}
        disabled={disabled}
        style={switchStyles}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  label: {
    flex: 1,
    marginRight: 16,
  },
  labelDisabled: {
    color: '#8F9BB3', // UI Kitten text-hint-color
  },
  switch: {
    // UI Kitten Toggle handles its own styling
  },
});

Switch.displayName = 'Switch';

export { Switch };
export default Switch;

import { Toggle, type ToggleProps as KittenToggleProps, Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

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
  const { theme, evaTheme } = useEnhancedTheme();
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

  // Get Eva Design colors
  const getDisabledOpacity = () => parseFloat(evaTheme['opacity-disabled'] || '0.6');
  const getHintColor = () => evaTheme['text-hint-color'] || theme.colors.text.secondary;

  // Combine switch styles
  const switchStyles = [styles.switch, style];

  // Dynamic container styles with Eva Design tokens
  const containerStyles = [
    styles.container,
    {
      minHeight: theme.spacing.xl * 1.25, // Use theme spacing
    },
    disabled && { opacity: getDisabledOpacity() },
    containerStyle,
  ];

  // Dynamic label styles with Eva Design tokens
  const labelStyles = [
    styles.label,
    {
      marginRight: theme.spacing.md, // Use theme spacing
    },
    disabled && { color: getHintColor() },
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text category="p1" style={labelStyles as any}>
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
  },
  label: {
    flex: 1,
  },
  switch: {
    // UI Kitten Toggle handles its own styling
  },
});

Switch.displayName = 'Switch';

export { Switch };
export default Switch;

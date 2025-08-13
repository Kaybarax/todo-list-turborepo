import React from 'react';
import { View, Switch as RNSwitch, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import theme from '../../theme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: {
    false: string;
    true: string;
  };
  testID?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  containerStyle,
  labelStyle,
  trackColor = {
    false: theme.colors.light,
    true: theme.colors.primary,
  },
  thumbColor = {
    false: theme.colors.white,
    true: theme.colors.white,
  },
  testID,
}) => {
  return (
    <View style={[styles.container, disabled && styles.containerDisabled, containerStyle]} testID={testID}>
      {label && <Text style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>{label}</Text>}
      <RNSwitch
        value={value}
        onValueChange={disabled ? undefined : onValueChange}
        trackColor={trackColor}
        thumbColor={value ? thumbColor.true : thumbColor.false}
        ios_backgroundColor={trackColor.false}
        disabled={disabled}
        testID={`${testID}-switch`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
    flex: 1,
  },
  labelDisabled: {
    color: theme.colors.medium,
  },
});

export default Switch;

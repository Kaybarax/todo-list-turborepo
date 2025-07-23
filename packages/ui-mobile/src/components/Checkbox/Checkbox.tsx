import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';

export interface CheckboxProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeColor?: string;
  inactiveColor?: string;
  checkColor?: string;
  testID?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onValueChange,
  label,
  disabled = false,
  containerStyle,
  checkboxStyle,
  labelStyle,
  activeColor = theme.colors.primary,
  inactiveColor = theme.colors.border,
  checkColor = theme.colors.white,
  testID,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        containerStyle,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? activeColor : theme.colors.white,
            borderColor: checked ? activeColor : inactiveColor,
          },
          disabled && styles.checkboxDisabled,
          checkboxStyle,
        ]}
        testID={`${testID}-box`}
      >
        {checked && (
          <MaterialIcons
            name="check"
            size={16}
            color={checkColor}
            testID={`${testID}-check`}
          />
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerDisabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.xs,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDisabled: {
    borderColor: theme.colors.medium,
    backgroundColor: theme.colors.light,
  },
  label: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  labelDisabled: {
    color: theme.colors.medium,
  },
});

export default Checkbox;
import { Toggle, Text } from '@ui-kitten/components';
import React from 'react';
import {
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  Switch as RNSwitch,
  Platform,
} from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';

export type SwitchStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface SwitchProps {
  value: boolean;
  onValueChange: (arg: boolean) => void;
  label?: string;
  status?: SwitchStatus;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
  /** Additional props forwarded to platform/native switch (web/native). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
  const isWeb = Platform.OS === 'web';

  // Eva token lookup helper
  const getStatusColor = (tone: 100 | 200 | 300 | 400 | 500 | 600 | 700 = 500) => {
    const token = `color-${status}-${tone}` as const;
    return evaTheme[token] || evaTheme['color-primary-500'] || '#3366FF';
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

  // Combine & flatten switch styles to avoid passing raw array to DOM via UI Kitten/React DOM
  // (react-native-web normally handles arrays on primitive components, but third-party components
  // may forward style directly; flatten prevents numeric index keys being iterated as CSS props)
  const switchStyles = React.useMemo(() => StyleSheet.flatten([styles.switch, style]) as ViewStyle, [style]);

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

  const accessibilityLabel = label || 'switch';

  return (
    <View style={containerStyles}>
      {label && (
        <Text category="p1" style={labelStyles as any} accessibilityRole="text">
          {label}
        </Text>
      )}
      {isWeb ? (
        <RNSwitch
          value={value}
          onValueChange={handleChange}
          disabled={disabled}
          // Track colors reflect status
          trackColor={{
            false: evaTheme['color-basic-600'] || '#C5CEE0',
            true: getStatusColor(500),
          }}
          thumbColor={disabled ? evaTheme['color-basic-400'] || '#E4E9F2' : evaTheme['color-basic-100'] || '#FFFFFF'}
          ios_backgroundColor={evaTheme['color-basic-600'] || '#C5CEE0'}
          style={switchStyles}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="switch"
          accessibilityState={{ checked: value, disabled: !!disabled }}
          {...props}
        />
      ) : (
        <Toggle
          checked={value}
          onChange={handleChange}
          status={status}
          disabled={disabled}
          style={switchStyles}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="switch"
          accessibilityState={{ checked: value, disabled: !!disabled }}
          {...props}
        />
      )}
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

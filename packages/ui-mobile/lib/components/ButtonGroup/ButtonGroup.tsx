import { Children, cloneElement, isValidElement } from 'react';
import { View } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { ButtonGroupProps } from './types';

export const ButtonGroup = ({
  children,
  value,
  onValueChange,
  type = 'single',
  attached = false,
}: ButtonGroupProps) => {
  // Use theme if available, fallback to default border color
  let theme;
  try {
    theme = useTheme();
  } catch {
    theme = null;
  }

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      // For single selection, toggle the selection: if already selected, unselect it
      const newValue = value === itemValue ? '' : itemValue;
      onValueChange(newValue);
    } else {
      const newValue = Array.isArray(value)
        ? value.includes(itemValue)
          ? value.filter(v => v !== itemValue)
          : [...value, itemValue]
        : [itemValue];
      onValueChange(newValue);
    }
  };

  const isSelected = (itemValue: string) => {
    return Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: attached ? 0 : 8,
        width: '100%',
        alignSelf: 'stretch',
      }}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child) || !('value' in child.props)) {
          return null;
        }

        const selected = isSelected(child.props.value as string);

        const isFirst = index === 0;
        const isLast = index === Children.count(children) - 1;

        const attachedStyle = attached
          ? {
              borderRadius: 0,
              borderWidth: 1,
              borderLeftWidth: isFirst ? 1 : 0,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: theme?.['border-basic-color-3'] || theme?.['color-basic-600'] || '#E4E9F2',
              ...(isFirst && { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }),
              ...(isLast && { borderTopRightRadius: 5, borderBottomRightRadius: 5 }),
            }
          : {};

        const responsiveStyle = {
          flex: 1,
          paddingHorizontal: 8,
          minWidth: 0,
          height: 40, // Add explicit height constraint
        };

        return cloneElement(child, {
          style: [child.props.style, attachedStyle, responsiveStyle],
          selected: selected,
          onPress: () => handleValueChange(child.props.value as string),
        });
      })}
    </View>
  );
};

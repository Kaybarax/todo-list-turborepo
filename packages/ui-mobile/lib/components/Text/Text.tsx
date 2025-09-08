/**
 * Text Component
 * Enhanced text component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Text as UIKittenText } from '@ui-kitten/components';
import type { TextProps as UIKittenTextProps } from '@ui-kitten/components';
import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { mapTextCategory, type TextVariant as MappingTextVariant } from '../../utils/componentMappings';

export type TextVariant = MappingTextVariant;
export type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | string;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends Omit<UIKittenTextProps, 'category' | 'style'> {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: FontWeight;
  style?: StyleProp<TextStyle>;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight,
  numberOfLines,
  children,
  testID,
  style,
  ...props
}) => {
  const { theme, evaTheme } = useEnhancedTheme();

  const category = mapTextCategory(variant);

  // Get text color from Eva theme or fallback to legacy theme
  const getTextColor = (colorName: TextColor): string => {
    if (colorName === 'primary') return evaTheme['text-basic-color'] ?? theme.colors.text.primary;
    if (colorName === 'secondary') return evaTheme['text-hint-color'] ?? theme.colors.text.secondary;
    if (colorName === 'disabled') return evaTheme['text-disabled-color'] ?? theme.colors.text.disabled;
    if (colorName === 'inverse') return evaTheme['text-control-color'] ?? theme.colors.text.inverse;
    return colorName; // Custom color string
  };

  // Create custom styles combining Eva Design tokens with legacy theme fallbacks
  const baseStyle = {
    color: getTextColor(color),
    textAlign: align,
    ...(weight && { fontWeight: theme.typography.fontWeights[weight] }),
  };

  return (
    <UIKittenText
      category={category}
      style={[baseStyle, style] as any}
      numberOfLines={numberOfLines}
      testID={testID}
      {...(props as Partial<UIKittenTextProps>)}
    >
      {children}
    </UIKittenText>
  );
};

Text.displayName = 'Text';

export default Text;

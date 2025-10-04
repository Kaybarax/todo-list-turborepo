/**
 * Text Component
 * Enhanced text component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Text as UIKittenText, useTheme } from '@ui-kitten/components';
import type { TextProps as UIKittenTextProps } from '@ui-kitten/components';
import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';

import { mapTextCategory, type TextVariant as MappingTextVariant } from '@todo/utils/ui/mobile';

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

const fontWeightMap = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

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
  // Use UI Kitten's theme directly which is already set by EvaProvider
  const evaTheme = useTheme();

  const category = mapTextCategory(variant);

  // Get text color from Eva theme
  const getTextColor = (colorName: TextColor): string => {
    if (colorName === 'primary') return evaTheme['text-basic-color'];
    if (colorName === 'secondary') return evaTheme['text-hint-color'];
    if (colorName === 'disabled') return evaTheme['text-disabled-color'];
    if (colorName === 'inverse') return evaTheme['text-control-color'];
    return colorName; // Custom color string
  };

  // Create custom styles combining Eva Design tokens
  const baseStyle: TextStyle = {
    color: getTextColor(color),
    textAlign: align,
    ...(weight && { fontWeight: fontWeightMap[weight] as any }),
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

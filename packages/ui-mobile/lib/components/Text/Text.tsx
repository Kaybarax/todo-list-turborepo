/**
 * Text Component
 * Enhanced text component with typography variants and theme integration
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import type { TypographyVariant } from '../../tokens/typography';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
export type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | string;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: FontWeight;
  numberOfLines?: number;
  children: React.ReactNode;
  testID?: string;
  style?: RNTextProps['style'];
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
  const { theme } = useTheme();

  // Get typography variant styles
  const getVariantStyles = (variantName: TextVariant): TypographyVariant => {
    return theme.typography.textVariants[variantName];
  };

  // Get text color
  const getTextColor = (colorName: TextColor): string => {
    if (colorName === 'primary') return theme.colors.text.primary;
    if (colorName === 'secondary') return theme.colors.text.secondary;
    if (colorName === 'disabled') return theme.colors.text.disabled;
    if (colorName === 'inverse') return theme.colors.text.inverse;
    return colorName; // Custom color string
  };

  // Get font weight
  const getFontWeight = (weightName?: FontWeight): string => {
    if (!weightName) return getVariantStyles(variant).fontWeight;
    return theme.typography.fontWeights[weightName];
  };

  const variantStyles = getVariantStyles(variant);
  const textColor = getTextColor(color);
  const fontWeight = getFontWeight(weight);

  const textStyles = [
    styles.base,
    {
      fontSize: variantStyles.fontSize,
      fontWeight: fontWeight as any,
      lineHeight: variantStyles.fontSize * variantStyles.lineHeight,
      letterSpacing: variantStyles.letterSpacing || 0,
      color: textColor,
      textAlign: align,
      fontFamily: theme.typography.fontFamilies.primary,
    },
    style,
  ];

  return (
    <RNText style={textStyles} numberOfLines={numberOfLines} testID={testID} accessibilityRole="text" {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

Text.displayName = 'Text';

export default Text;

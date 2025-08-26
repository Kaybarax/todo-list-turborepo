/**
 * Text Component
 * Enhanced text component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Text as UIKittenText, TextProps as UIKittenTextProps } from '@ui-kitten/components';
import React from 'react';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { type TypographyVariant } from '../../tokens/typography';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
export type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | string;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: FontWeight;
  numberOfLines?: number;
  children: React.ReactNode;
  testID?: string;
  style?: any;
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

  // Map our variants to UI Kitten categories
  const getUIKittenCategory = (): string => {
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'body1':
        return 'p1';
      case 'body2':
        return 'p2';
      case 'caption':
        return 'c1';
      case 'overline':
        return 'c2';
      default:
        return 'p1';
    }
  };

  // Get text color from Eva theme or fallback to legacy theme
  const getTextColor = (colorName: TextColor): string => {
    if (colorName === 'primary') return evaTheme['text-basic-color'] || theme.colors.text.primary;
    if (colorName === 'secondary') return evaTheme['text-hint-color'] || theme.colors.text.secondary;
    if (colorName === 'disabled') return evaTheme['text-disabled-color'] || theme.colors.text.disabled;
    if (colorName === 'inverse') return evaTheme['text-control-color'] || theme.colors.text.inverse;
    return colorName; // Custom color string
  };

  // Create custom styles combining Eva Design tokens with legacy theme fallbacks
  const customStyles = [
    {
      color: getTextColor(color),
      textAlign: align,
      ...(weight && { fontWeight: theme.typography.fontWeights[weight] }),
    },
    style,
  ];

  return (
    <UIKittenText category={getUIKittenCategory()} style={customStyles} numberOfLines={numberOfLines} testID={testID}>
      {children}
    </UIKittenText>
  );
};

Text.displayName = 'Text';

export default Text;

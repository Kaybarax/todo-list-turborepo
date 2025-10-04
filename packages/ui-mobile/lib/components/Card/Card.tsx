/**
 * Card Component
 * Enhanced card component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Card as UIKittenCard } from '@ui-kitten/components';
import type { CardProps as UIKittenCardProps } from '@ui-kitten/components';
import React from 'react';
import { type ViewStyle, type TextStyle, View, StyleSheet, type StyleProp } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { mapCardAppearance, type CardVariant as MappingCardVariant } from '@todo/utils/ui/mobile';
import { getShadow } from '../../utils/shadows';
import { Text } from '../Text/Text';

export type CardVariant = MappingCardVariant;

// CRD-1: Extend underlying UI Kitten Card props (omit appearance & style to control locally)
export interface CardProps extends Omit<UIKittenCardProps, 'appearance' | 'style' | 'children'> {
  variant?: CardVariant;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string; // explicit for clarity
}

export interface CardHeaderProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardTitleProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  numberOfLines?: number;
  testID?: string;
}

export interface CardDescriptionProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  numberOfLines?: number;
  testID?: string;
}

export interface CardContentProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardFooterProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  testID?: string;
}

// Define compound component type
interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Title: React.FC<CardTitleProps>;
  Description: React.FC<CardDescriptionProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
}

const CardBase: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'lg',
  children,
  onPress,
  testID,
  style,
  ...props
}) => {
  const { theme, evaTheme, themeName } = useEnhancedTheme();

  const appearance = mapCardAppearance(variant);

  // Use a surface-like background so cards are slightly contrasted against the screen background
  // Eva mapping: background-basic-color-2 provides the appropriate surface shade in both modes
  const backgroundColor =
    variant === 'outlined'
      ? 'transparent'
      : themeName === 'dark'
        ? evaTheme['background-basic-color-2'] // Use a more neutral dark surface
        : theme.colors.surface;

  // Debug logging
  if (__DEV__ && testID === 'feature-card-prioritization') {
    console.log('Card Debug:', { themeName, backgroundColor, evaThemeBgColor: evaTheme['background-basic-color-1'] });
  }

  // Custom styles for padding and variant-specific styling
  // CRD-2 / CRD-3: dynamic padding + shared shadow util (already in place) + consumer style
  const customStyles: StyleProp<ViewStyle>[] = [
    {
      padding: theme.spacing[padding],
      backgroundColor,
    },
    variant === 'elevated' ? getShadow('md') : undefined,
    style,
  ];

  return (
    <UIKittenCard
      appearance={appearance}
      onPress={onPress}
      // Casting due to React Native duplicate style type variance across versions (safe: only ViewStyle-compatible props)
      style={customStyles as any}
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      {...(props as Partial<UIKittenCardProps>)}
    >
      {children}
    </UIKittenCard>
  );
};

const wrapIfString = (children: React.ReactNode) => {
  if (typeof children === 'string' || typeof children === 'number') {
    return <Text variant="body2">{children}</Text>;
  }
  return children;
};

const CardHeader: React.FC<CardHeaderProps> = ({ style, children, testID }) => {
  const { theme, evaTheme } = useEnhancedTheme();

  const headerStyles = [
    {
      paddingBottom: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: theme.borders.width.thin,
      borderBottomColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
    },
    style,
  ];

  return (
    <View style={headerStyles} testID={testID}>
      {wrapIfString(children)}
    </View>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ style, children, variant = 'h4', numberOfLines, testID }) => {
  return (
    <Text
      variant={variant}
      color="primary"
      weight="semibold"
      style={[cardStaticStyles.title, style]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </Text>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ style, children, numberOfLines, testID }) => {
  return (
    <Text
      variant="body2"
      color="secondary"
      style={[cardStaticStyles.description, style]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({ style, children, testID }) => {
  return (
    <View style={style} testID={testID}>
      {wrapIfString(children)}
    </View>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ style, children, alignment = 'right', testID }) => {
  const { theme, evaTheme } = useEnhancedTheme();

  const getJustifyContent = () => {
    switch (alignment) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'space-between':
        return 'space-between';
      case 'right':
      default:
        return 'flex-end';
    }
  };

  const footerStyles: StyleProp<ViewStyle>[] = [
    cardStaticStyles.footerBase,
    {
      justifyContent: getJustifyContent() as any,
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTopWidth: theme.borders.width.thin,
      borderTopColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
    },
    style,
  ];

  return (
    <View style={footerStyles} testID={testID}>
      {wrapIfString(children)}
    </View>
  );
};

// Create the compound component
const Card = CardBase as CardComponent;

// Attach subcomponents to Card for compound component pattern
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Set display names for debugging
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;

// CRD-2: Static style extraction
const cardStaticStyles = StyleSheet.create({
  title: {
    marginBottom: 2,
  },
  description: {
    marginBottom: 0,
  },
  footerBase: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

/**
 * Card Component
 * Enhanced card component with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import { Card as UIKittenCard } from '@ui-kitten/components';
import React from 'react';
import { type ViewStyle, type TextStyle, View } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { mapCardAppearance, type CardVariant as MappingCardVariant } from '../../utils/componentMappings';
import { Text } from '../Text/Text';

export type CardVariant = MappingCardVariant;

export interface CardProps {
  variant?: CardVariant;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onPress?: () => void;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export interface CardHeaderProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardTitleProps {
  style?: TextStyle;
  children?: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  testID?: string;
}

export interface CardDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardContentProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardFooterProps {
  style?: ViewStyle;
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
  const { theme } = useEnhancedTheme();

  const appearance = mapCardAppearance(variant);

  // Custom styles for padding and variant-specific styling
  const customStyles = [
    {
      padding: theme.spacing[padding],
    },
    variant === 'elevated' && {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    style,
  ] as any;

  return (
    <UIKittenCard
      appearance={appearance}
      onPress={onPress}
      style={customStyles}
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      {...props}
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

const CardTitle: React.FC<CardTitleProps> = ({ style, children, variant = 'h4', testID }) => {
  const titleStyles = [
    {
      marginBottom: 4,
    },
    style,
  ];

  return (
    <Text variant={variant} color="primary" weight="semibold" style={titleStyles} testID={testID}>
      {children}
    </Text>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ style, children, testID }) => {
  const descriptionStyles = [
    {
      marginBottom: 8,
    },
    style,
  ];

  return (
    <Text variant="body2" color="secondary" style={descriptionStyles} testID={testID}>
      {children}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({ style, children, testID }) => {
  const { theme } = useEnhancedTheme();

  const contentStyles = [
    {
      paddingVertical: theme.spacing.xs,
    },
    style,
  ];

  return (
    <View style={contentStyles} testID={testID}>
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

  const footerStyles = [
    {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
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

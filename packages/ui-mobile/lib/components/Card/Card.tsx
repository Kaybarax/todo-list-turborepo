/**
 * Card Component
 * Enhanced card component with design tokens and theme integration
 */

import React from 'react';
import { View, ViewStyle, TouchableOpacity, TouchableOpacityProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: CardVariant;
  padding?: keyof ReturnType<typeof useTheme>['theme']['spacing'];
  children: React.ReactNode;
  onPress?: () => void;
  testID?: string;
  style?: ViewStyle;
}

export interface CardHeaderProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export interface CardTitleProps {
  style?: TextStyle;
  children?: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
}

export interface CardDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

export interface CardContentProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export interface CardFooterProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
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
  const { theme } = useTheme();

  // Get card styles based on variant
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing[padding],
    };

    const variantStyles = {
      elevated: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.md,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: theme.borders.width.thin,
        borderColor: theme.colors.border.default,
      },
      filled: {
        backgroundColor: theme.colors.neutral[50],
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
    };
  };

  const cardStyles = [getCardStyles(), style];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} testID={testID} accessibilityRole="button" {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ style, children }) => {
  const { theme } = useTheme();

  const headerStyles = [
    {
      paddingBottom: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: theme.borders.width.thin,
      borderBottomColor: theme.colors.border.default,
    },
    style,
  ];

  return <View style={headerStyles}>{children}</View>;
};

const CardTitle: React.FC<CardTitleProps> = ({ style, children, variant = 'h4' }) => {
  const titleStyles = [
    {
      marginBottom: 4,
    },
    style,
  ];

  return (
    <Text variant={variant} color="primary" weight="semibold" style={titleStyles}>
      {children}
    </Text>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ style, children }) => {
  const descriptionStyles = [
    {
      marginBottom: 8,
    },
    style,
  ];

  return (
    <Text variant="body2" color="secondary" style={descriptionStyles}>
      {children}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({ style, children }) => {
  const { theme } = useTheme();

  const contentStyles = [
    {
      paddingVertical: theme.spacing.xs,
    },
    style,
  ];

  return <View style={contentStyles}>{children}</View>;
};

const CardFooter: React.FC<CardFooterProps> = ({ style, children, alignment = 'right' }) => {
  const { theme } = useTheme();

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
      borderTopColor: theme.colors.border.default,
    },
    style,
  ];

  return <View style={footerStyles}>{children}</View>;
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

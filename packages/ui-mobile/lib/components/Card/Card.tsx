import React from 'react';
import { 
  Card as KittenCard, 
  CardProps as KittenCardProps,
  Text
} from '@ui-kitten/components';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  StyleProp 
} from 'react-native';

export interface CardProps extends Omit<KittenCardProps, 'children'> {
  children?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  elevation?: 'none' | 'low' | 'medium' | 'high';
}

export interface CardHeaderProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CardTitleProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  category?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  category?: 'p1' | 'p2' | 's1' | 's2' | 'c1' | 'c2';
}

export interface CardContentProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CardFooterProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default',
  elevation = 'medium',
  style,
  ...props 
}) => {
  // Map our variants to UI Kitten appearance
  const getKittenAppearance = (): KittenCardProps['appearance'] => {
    switch (variant) {
      case 'outlined':
        return 'outline';
      case 'filled':
        return 'filled';
      case 'default':
      default:
        return 'filled';
    }
  };

  // Apply elevation styles
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return styles.elevationNone;
      case 'low':
        return styles.elevationLow;
      case 'high':
        return styles.elevationHigh;
      case 'medium':
      default:
        return styles.elevationMedium;
    }
  };

  const cardStyles = [
    getElevationStyle(),
    style,
  ];

  return (
    <KittenCard
      appearance={getKittenAppearance()}
      style={cardStyles}
      {...props}
    >
      {children}
    </KittenCard>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ style, children }) => {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ 
  style, 
  children, 
  category = 'h5' 
}) => {
  return (
    <Text 
      category={category}
      style={[styles.title, style]}
    >
      {typeof children === 'string' ? children : String(children)}
    </Text>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ 
  style, 
  children, 
  category = 'p2' 
}) => {
  return (
    <Text 
      category={category}
      appearance="hint"
      style={[styles.description, style]}
    >
      {typeof children === 'string' ? children : String(children)}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({ style, children }) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ 
  style, 
  children, 
  alignment = 'right' 
}) => {
  const getAlignmentStyle = () => {
    switch (alignment) {
      case 'left':
        return styles.footerLeft;
      case 'center':
        return styles.footerCenter;
      case 'space-between':
        return styles.footerSpaceBetween;
      case 'right':
      default:
        return styles.footerRight;
    }
  };

  return (
    <View style={[styles.footer, getAlignmentStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Elevation styles
  elevationNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  elevationLow: {
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  elevationMedium: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  elevationHigh: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  
  // Component styles
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    // UI Kitten Text with appearance="hint" will handle the styling
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLeft: {
    justifyContent: 'flex-start',
  },
  footerCenter: {
    justifyContent: 'center',
  },
  footerRight: {
    justifyContent: 'flex-end',
  },
  footerSpaceBetween: {
    justifyContent: 'space-between',
  },
});

// Set display names for debugging
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
};

export default {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
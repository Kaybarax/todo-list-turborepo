import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  StyleProp 
} from 'react-native';
import theme from '../../theme';

export interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
}

export interface CardHeaderProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CardTitleProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export interface CardDescriptionProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export interface CardContentProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CardFooterProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ style, children, testID }) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ style, children }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

export const CardTitle: React.FC<CardTitleProps> = ({ style, children }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ style, children }) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

export const CardContent: React.FC<CardContentProps> = ({ style, children }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardFooterProps> = ({ style, children }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.medium,
  },
  content: {
    padding: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
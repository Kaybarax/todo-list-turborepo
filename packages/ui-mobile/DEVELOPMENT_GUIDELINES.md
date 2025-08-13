# Development Guidelines and Best Practices

## @todo/ui-mobile Component Library

This document outlines the development guidelines, best practices, and standards for contributing to the `@todo/ui-mobile` component library built on UI Kitten components with Eva Design System theming.

## 📋 Table of Contents

- [Component Development](#component-development)
- [TypeScript Guidelines](#typescript-guidelines)
- [Styling and Theming](#styling-and-theming)
- [Testing Standards](#testing-standards)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Guidelines](#performance-guidelines)
- [Platform Considerations](#platform-considerations)
- [Documentation Standards](#documentation-standards)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

## 🧩 Component Development

### Component Architecture

All components should follow this architectural pattern:

```tsx
// 1. Imports
import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as UIKittenButton, ButtonProps as UIKittenButtonProps } from '@ui-kitten/components';

// 2. TypeScript interface extending UI Kitten props
export interface ButtonProps extends Omit<UIKittenButtonProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
}

// 3. Component implementation
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  rounded = false,
  loading = false,
  leftIcon,
  rightIcon,
  iconColor,
  style,
  ...props
}) => {
  // 4. Variant mapping to UI Kitten status
  const getStatus = (): string => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'basic';
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      case 'outline':
        return 'basic';
      case 'ghost':
        return 'basic';
      default:
        return 'basic';
    }
  };

  // 5. Size mapping
  const getSize = (): string => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  // 6. Style composition
  const buttonStyle = [fullWidth && styles.fullWidth, rounded && styles.rounded, style];

  // 7. Render with UI Kitten component
  return (
    <UIKittenButton
      status={getStatus()}
      size={getSize()}
      style={buttonStyle}
      disabled={loading || props.disabled}
      accessoryLeft={leftIcon ? () => <Icon name={leftIcon} fill={iconColor} /> : undefined}
      accessoryRight={rightIcon ? () => <Icon name={rightIcon} fill={iconColor} /> : undefined}
      {...props}
    >
      {loading ? 'Loading...' : title}
    </UIKittenButton>
  );
};

// 8. Styles using StyleSheet
const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: 25,
  },
});
```

### Component Guidelines

#### 1. Use UI Kitten Components as Foundation

```tsx
// ✅ Good - Build on UI Kitten components
import { Input as UIKittenInput, InputProps as UIKittenInputProps } from '@ui-kitten/components';

export interface InputProps extends UIKittenInputProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Input: React.FC<InputProps> = ({ label, helperText, error, leftIcon, rightIcon, ...props }) => {
  return (
    <UIKittenInput
      status={error ? 'danger' : 'basic'}
      label={label}
      caption={helperText}
      accessoryLeft={leftIcon ? () => <Icon name={leftIcon} /> : undefined}
      accessoryRight={rightIcon ? () => <Icon name={rightIcon} /> : undefined}
      {...props}
    />
  );
};

// ❌ Avoid - Building from scratch when UI Kitten component exists
import { TextInput, View, Text } from 'react-native';

export const Input = ({ label, ...props }) => {
  return (
    <View>
      {label && <Text>{label}</Text>}
      <TextInput {...props} />
    </View>
  );
};
```

#### 2. Implement Proper TypeScript Types

```tsx
// ✅ Good - Comprehensive TypeScript interface
export interface AvatarProps {
  source?: { uri: string } | number;
  initials?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
}

// ❌ Avoid - Loose typing
export interface AvatarProps {
  source?: any;
  size?: string;
  style?: any;
  onPress?: any;
}
```

#### 3. Support Platform-Specific Styling

```tsx
// ✅ Good - Platform-specific styling
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

// ❌ Avoid - Ignoring platform differences
const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // This won't work on iOS
  },
});
```

## 🔷 TypeScript Guidelines

### Type Definitions

#### 1. Extend UI Kitten Props Properly

```tsx
// ✅ Good - Proper UI Kitten props extension
import { CardProps as UIKittenCardProps } from '@ui-kitten/components';

export interface CardProps extends UIKittenCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

// ❌ Avoid - Missing UI Kitten props
export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}
```

#### 2. Use React Native Style Types

```tsx
// ✅ Good - Proper React Native style types
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface ComponentProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
}

// ❌ Avoid - Generic style types
export interface ComponentProps {
  containerStyle?: any;
  textStyle?: object;
  imageStyle?: {};
}
```

## 🎨 Styling and Theming

### Eva Design System Integration

#### 1. Use Eva Design Tokens

```tsx
// ✅ Good - Use Eva Design tokens
import { useTheme } from '@ui-kitten/components';

const Component = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme['background-basic-color-1'],
      borderColor: theme['border-basic-color-3'],
    },
    text: {
      color: theme['text-basic-color'],
      fontSize: theme['text-font-size'],
    },
  });

  return <View style={styles.container}>/* ... */</View>;
};

// ❌ Avoid - Hardcoded colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  text: {
    color: '#000000',
    fontSize: 16,
  },
});
```

## 🧪 Testing Standards

### Unit Testing with React Native Testing Library

```tsx
// ✅ Good - Comprehensive rendering tests
import React from 'react';
import { render } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Button } from './Button';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Button', () => {
  it('renders with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />, { wrapper: TestWrapper });

    expect(getByText('Test Button')).toBeTruthy();
  });
});
```

## ♿ Accessibility Requirements

### React Native Accessibility

```tsx
// ✅ Good - Proper accessibility labels
const Button = ({ title, onPress, ...props }) => {
  return (
    <UIKittenButton
      onPress={onPress}
      accessibilityLabel={props.accessibilityLabel || title}
      accessibilityHint={props.accessibilityHint}
      accessibilityRole="button"
      {...props}
    >
      {title}
    </UIKittenButton>
  );
};
```

## ⚡ Performance Guidelines

### React Native Performance

```tsx
// ✅ Good - Memoized components
const Badge = React.memo<BadgeProps>(({ text, variant, style }) => {
  const theme = useTheme();

  const badgeStyle = React.useMemo(
    () => [
      {
        backgroundColor: theme[`color-${variant}-default`],
      },
      style,
    ],
    [theme, variant, style],
  );

  return <UIKittenText style={badgeStyle}>{text}</UIKittenText>;
});
```

## 📱 Platform Considerations

### iOS Specific Guidelines

```tsx
// ✅ Good - iOS-specific styling
const IOSButton = ({ title, onPress }) => {
  return (
    <UIKittenButton
      onPress={onPress}
      style={Platform.select({
        ios: {
          backgroundColor: '#007AFF',
          borderRadius: 8,
        },
        android: {
          backgroundColor: '#2196F3',
          borderRadius: 4,
        },
      })}
    >
      {title}
    </UIKittenButton>
  );
};
```

## 🎯 Best Practices Summary

### Do's ✅

1. **Use UI Kitten components** as the foundation for consistency
2. **Implement comprehensive TypeScript types** with proper React Native types
3. **Support both iOS and Android** with platform-specific styling
4. **Use StyleSheet.create** for performance optimization
5. **Write comprehensive tests** including platform-specific tests
6. **Document everything** with JSDoc, Storybook, and examples
7. **Follow semantic versioning** and maintain changelog
8. **Optimize for performance** with memoization and efficient rendering
9. **Ensure accessibility** with proper ARIA attributes and screen reader support
10. **Support both platforms** with iOS and Android considerations

### Don'ts ❌

1. **Don't build from scratch** when UI Kitten components exist
2. **Don't use loose TypeScript types** or `any`
3. **Don't hardcode colors** or spacing values
4. **Don't ignore platform differences** between iOS and Android
5. **Don't skip accessibility** features and testing
6. **Don't create unstable references** in render functions
7. **Don't skip documentation** or examples
8. **Don't break existing APIs** without proper migration guides
9. **Don't ignore performance** implications of changes
10. **Don't merge without proper code review** and testing on both platforms

---

_This document is a living guide and should be updated as the component library evolves. All contributors are expected to follow these guidelines to maintain consistency and quality across the React Native mobile codebase._

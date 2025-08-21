# @todo/ui-mobile

A comprehensive React Native component library built on **UI Kitten** foundation with **Eva Design System** theming. Designed for the Todo app mobile interface with full TypeScript support, cross-platform compatibility, and comprehensive testing.

## ✨ Features

- 📱 **Built on UI Kitten**: Production-ready React Native components with Eva Design System
- 🎯 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🎨 **Eva Design System**: Customizable design system with built-in theming
- 🌙 **Dark Mode Support**: Built-in light and dark theme switching
- ♿ **Accessibility**: React Native accessibility features with proper labels and hints
- 🧪 **Comprehensive Testing**: Unit tests, integration tests, and visual regression testing
- 📚 **Storybook**: Interactive component documentation for React Native
- 🔄 **Visual Regression**: Automated visual testing with Chromatic integration
- 📱 **Cross-Platform**: Consistent behavior across iOS and Android

## 📦 Installation

```bash
# From the monorepo root
pnpm install @todo/ui-mobile

# Or with npm
npm install @todo/ui-mobile

# Or with yarn
yarn add @todo/ui-mobile
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
# React Native and UI Kitten dependencies
npm install react-native @ui-kitten/components @eva-design/eva react-native-svg react-native-vector-icons

# For Expo projects
expo install react-native-svg react-native-vector-icons
```

## 🚀 Quick Start

### Setup

First, wrap your app with the UI Kitten ApplicationProvider:

```tsx
import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as theme } from './custom-theme.json'; // Optional custom theme

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      {/* Your app content */}
    </ApplicationProvider>
  );
}
```

### Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { Button, Card, CardContent, CardHeader, Input, Badge, Switch } from '@todo/ui-mobile';

function ProfileScreen() {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <CardHeader title="Profile Settings" />
        <CardContent>
          <Input placeholder="Enter your name" label="Display Name" leftIcon="person" />
          <Input placeholder="Enter your email" label="Email Address" leftIcon="email" keyboardType="email-address" />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Switch checked={notifications} onValueChange={setNotifications} />
            <Badge text="Notifications" style={{ marginLeft: 8 }} />
          </View>
          <Button
            title="Save Changes"
            variant="primary"
            size="large"
            fullWidth
            style={{ marginTop: 16 }}
            onPress={() => console.log('Save pressed')}
          />
        </CardContent>
      </Card>
    </View>
  );
}
```

## 🧩 Components

### Core Components

| Component    | Description                                         | UI Kitten Base      |
| ------------ | --------------------------------------------------- | ------------------- |
| **Button**   | Versatile button with variants, sizes, and states   | `Button`            |
| **Card**     | Flexible container with header and content sections | `Card`              |
| **Input**    | Form input with validation, icons, and labels       | `Input`             |
| **Badge**    | Status indicators and labels                        | `Text` with styling |
| **Avatar**   | User profile images and placeholders                | `Avatar`            |
| **Switch**   | Toggle switch for boolean values                    | `Toggle`            |
| **Checkbox** | Checkbox input for multiple selections              | `CheckBox`          |

### Button Component

```tsx
import { Button } from '@todo/ui-mobile';

// Variants
<Button title="Primary" variant="primary" onPress={() => {}} />
<Button title="Secondary" variant="secondary" onPress={() => {}} />
<Button title="Outline" variant="outline" onPress={() => {}} />
<Button title="Danger" variant="danger" onPress={() => {}} />
<Button title="Success" variant="success" onPress={() => {}} />
<Button title="Ghost" variant="ghost" onPress={() => {}} />

// Sizes
<Button title="Small" size="small" onPress={() => {}} />
<Button title="Medium" size="medium" onPress={() => {}} />
<Button title="Large" size="large" onPress={() => {}} />

// States and styles
<Button title="Disabled" disabled onPress={() => {}} />
<Button title="Loading" loading onPress={() => {}} />
<Button title="Full Width" fullWidth onPress={() => {}} />
<Button title="Rounded" rounded onPress={() => {}} />

// With icons
<Button title="Back" leftIcon="arrow-back" onPress={() => {}} />
<Button title="Next" rightIcon="arrow-forward" onPress={() => {}} />
<Button title="Save" leftIcon="checkmark" rightIcon="save" onPress={() => {}} />
```

### Card Component

```tsx
import { Card, CardContent, CardHeader } from '@todo/ui-mobile';

<Card>
  <CardHeader
    title="Card Title"
    subtitle="Card subtitle or description"
  />
  <CardContent>
    {/* Your content here */}
  </CardContent>
</Card>

// With custom styling
<Card style={{ margin: 16, elevation: 4 }}>
  <CardContent>
    <Text>Custom styled card</Text>
  </CardContent>
</Card>
```

### Input Component

```tsx
import { Input } from '@todo/ui-mobile';

// Basic input
<Input
  placeholder="Enter text..."
  onChangeText={(text) => console.log(text)}
/>

// With label and validation
<Input
  label="Email Address"
  placeholder="Enter your email"
  keyboardType="email-address"
  leftIcon="email"
  onChangeText={setEmail}
  status={emailError ? 'danger' : 'basic'}
  caption={emailError || 'We will never share your email'}
/>

// Password input
<Input
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  leftIcon="lock"
  rightIcon="eye-off"
  onChangeText={setPassword}
/>
```

### Badge Component

```tsx
import { Badge } from '@todo/ui-mobile';

// Variants
<Badge text="Default" />
<Badge text="Primary" variant="primary" />
<Badge text="Secondary" variant="secondary" />
<Badge text="Success" variant="success" />
<Badge text="Danger" variant="danger" />
<Badge text="Warning" variant="warning" />
<Badge text="Info" variant="info" />

// With custom styling
<Badge
  text="Custom"
  style={{ backgroundColor: '#FF6B6B' }}
  textStyle={{ color: 'white' }}
/>
```

### Avatar Component

```tsx
import { Avatar } from '@todo/ui-mobile';

// With image
<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="large"
/>

// With initials
<Avatar
  initials="JD"
  size="medium"
  backgroundColor="#FF6B6B"
/>

// Different sizes
<Avatar source={avatarSource} size="small" />
<Avatar source={avatarSource} size="medium" />
<Avatar source={avatarSource} size="large" />
```

### Switch Component

```tsx
import { Switch } from '@todo/ui-mobile';

const [enabled, setEnabled] = React.useState(false);

<Switch
  checked={enabled}
  onValueChange={setEnabled}
  text="Enable notifications"
/>

// With custom styling
<Switch
  checked={enabled}
  onValueChange={setEnabled}
  status="success"
  disabled={false}
/>
```

## 🎨 Theming and Customization

### Eva Design System

The library uses Eva Design System for theming. Create a custom theme:

```json
// custom-theme.json
{
  "color-primary-100": "#F2F6FF",
  "color-primary-200": "#D9E4FF",
  "color-primary-300": "#A6C1FF",
  "color-primary-400": "#598BFF",
  "color-primary-500": "#3366FF",
  "color-primary-600": "#274BDB",
  "color-primary-700": "#1A34B8",
  "color-primary-800": "#102694",
  "color-primary-900": "#091C7A"
}
```

### Theme Usage

```tsx
import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as customTheme } from './custom-theme.json';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
      {/* Your app */}
    </ApplicationProvider>
  );
}
```

### Dark Mode Support

```tsx
import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const theme = isDarkMode ? eva.dark : eva.light;

  return (
    <ApplicationProvider {...eva} theme={theme}>
      {/* Your app with theme switching */}
    </ApplicationProvider>
  );
}
```

## 🧪 Development

### Building

```bash
# Build the library
pnpm build

# Build in watch mode
pnpm dev

# From monorepo root
pnpm build --filter=@todo/ui-mobile
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run comprehensive tests
pnpm test:ci

# Run specific test files
pnpm jest __tests__/components/Button.test.tsx
```

### Storybook Development

```bash
# Start Storybook for React Native
pnpm storybook

# Build Storybook for production
pnpm build-storybook

# From monorepo root
pnpm storybook --filter=@todo/ui-mobile
```

### Visual Regression Testing

```bash
# Run Chromatic visual tests
pnpm chromatic

# Run Chromatic in CI mode
pnpm chromatic:ci
```

## 📚 Storybook

Interactive component documentation is available in Storybook for React Native:

- **All component variants** with interactive controls
- **Theme switching** between light and dark modes
- **Device simulation** for different screen sizes
- **Accessibility testing** with React Native accessibility features
- **Code examples** with copy functionality

### Development Commands

```bash
# Start Storybook development server
pnpm storybook

# Build the library
pnpm build

# Run tests
pnpm test
```

## 🏗️ Architecture

### Directory Structure

```
packages/ui-mobile/
├── lib/                        # Source code (consolidated structure)
│   ├── components/            # Component implementations
│   │   ├── Button/
│   │   │   ├── Button.tsx     # Component implementation
│   │   │   └── index.ts       # Exports
│   │   └── ...
│   ├── theme/                 # Theme configuration
│   └── index.ts              # Main exports
├── src/                       # Development files
│   ├── stories/              # Storybook stories
│   ├── test/                 # Test setup
│   └── index.ts              # Package exports
├── __tests__/                 # All test files
│   ├── __mocks__/            # Test mocks
│   └── *.test.tsx            # Component tests
├── .storybook/               # Storybook configuration
└── dist/                     # Built output
```

### Component Architecture

Components are built using:

1. **UI Kitten Components**: Production-ready React Native components
2. **Eva Design System**: Comprehensive design system with theming
3. **TypeScript**: Full type safety with proper prop interfaces
4. **React Native**: Native platform components and APIs

### Example Component Structure

```tsx
import React from 'react';
import { Button as UIKittenButton, ButtonProps as UIKittenButtonProps } from '@ui-kitten/components';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

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
  // Map custom variants to UI Kitten status
  const getStatus = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'basic';
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'basic';
    }
  };

  // Map custom sizes to UI Kitten sizes
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  const buttonStyle = [fullWidth && styles.fullWidth, rounded && styles.rounded, style];

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

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: 25,
  },
});
```

## 🤝 Contributing

### Adding New Components

1. **Create component directory**: `lib/components/ComponentName/`
2. **Implement component**: `ComponentName.tsx` with UI Kitten integration
3. **Create stories**: Add to `src/stories/ComponentName.stories.tsx` with React Native examples
4. **Write tests**: Add to `__tests__/ComponentName.test.tsx`
5. **Add exports**: Update `lib/index.ts` and component `index.ts`
6. **Update documentation**: Add to this README and Storybook docs

### Component Guidelines

- **Use UI Kitten components** as the foundation when available
- **Implement proper TypeScript types** with clear prop interfaces
- **Follow React Native conventions** for styling and accessibility
- **Include comprehensive tests** with React Native Testing Library
- **Document all props** in Storybook stories
- **Support both themes** (light and dark mode)
- **Ensure accessibility** with proper accessibility labels and hints

### Testing Guidelines

- **Unit tests**: Test component logic and prop handling
- **Integration tests**: Test component interactions and state management
- **Visual tests**: Test component appearance across themes and states
- **Accessibility tests**: Test screen reader compatibility and keyboard navigation

## 📱 Platform Considerations

### iOS Specific

- Components automatically adapt to iOS design guidelines
- Proper integration with iOS accessibility features
- Support for iOS-specific gestures and interactions

### Android Specific

- Material Design compliance where appropriate
- Android accessibility service integration
- Support for Android-specific UI patterns

### Cross-Platform

- Consistent API across both platforms
- Platform-specific styling when needed
- Shared business logic with platform-specific presentation

## 🔍 Visual Regression Testing

The library includes comprehensive visual regression testing:

- **Chromatic Integration**: Automated visual testing for React Native components
- **Cross-Platform Testing**: Visual validation across iOS and Android
- **Theme Testing**: Visual validation across light and dark themes
- **Device Testing**: Visual validation across different device sizes

## 📄 License

This package is part of the Todo monorepo and follows the same license terms.

## 🔗 Related Packages

- [`@todo/ui-web`](../ui-web/README.md) - React web component library
- [`@todo/config-eslint`](../config-eslint/README.md) - Shared ESLint configuration
- [`@todo/config-ts`](../config-ts/README.md) - Shared TypeScript configuration

## 📞 Support

For questions, issues, or contributions, please refer to the main repository documentation or create an issue in the monorepo.

## 🚀 Getting Started with Development

1. **Clone the monorepo** and install dependencies
2. **Start Storybook**: `pnpm storybook`
3. **Build the library**: `pnpm build`
4. **Run tests**: `pnpm test`
5. **Make changes** and see them reflected in real-time

For detailed development setup, see the main repository README.

# UI Mobile Showcase Application

A comprehensive Expo React Native showcase application demonstrating all components from the `@todo/ui-mobile` package. Built with Expo and React Native, this application serves as both a testing ground and documentation for the mobile component library.

## 🚀 Quick Start

```bash
# From the ui-mobile package directory
pnpm showcase:start

# Or from the monorepo root
pnpm showcase:start --filter=@todo/ui-mobile

# For specific platforms
pnpm showcase:ios
pnpm showcase:android
pnpm showcase:web
```

## 📱 Features

- **Interactive Component Gallery**: All components with live examples on device
- **Cross-Platform Testing**: Test components on iOS, Android, and web
- **Theme Switching**: Toggle between light and dark Eva Design themes
- **Device Simulation**: Test across different screen sizes and orientations
- **Real-time Updates**: Hot reload during development with Expo
- **Accessibility Testing**: Built-in React Native accessibility features

## 📱 What's Included

### Component Demonstrations

- **Button Component**: All variants, sizes, states, and icon combinations
- **Card Component**: Different layouts and compositions for mobile
- **Input Component**: Form inputs with validation, icons, and keyboard types
- **Badge Component**: Status indicators and labels optimized for mobile
- **Avatar Component**: Profile images with different sizes and fallbacks
- **Switch Component**: Toggle controls with proper mobile interactions
- **Checkbox Component**: Selection controls with accessibility support

### Mobile-Specific Features

- **Touch Interactions**: Proper touch targets and gesture handling
- **Keyboard Management**: Automatic keyboard avoidance and input focus
- **Platform Adaptation**: iOS and Android specific styling and behavior
- **Accessibility**: Screen reader support and accessibility labels
- **Performance**: Optimized for mobile device performance

## 🏗️ Architecture

### File Structure

```
showcase/
├── src/
│   ├── components/          # Showcase-specific components
│   │   ├── ComponentShowcase.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Navigation.tsx
│   ├── screens/            # Screen components
│   │   ├── ButtonScreen.tsx
│   │   ├── CardScreen.tsx
│   │   ├── InputScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── DrawerNavigator.tsx
│   └── data/              # Component examples and data
│       ├── buttonExamples.ts
│       ├── cardExamples.ts
│       └── inputExamples.ts
├── App.tsx                # Main application with UI Kitten setup
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── package.json          # Showcase dependencies
└── README.md            # This file
```

### Navigation Structure

The showcase uses drawer navigation for easy component access:

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Button" component={ButtonScreen} />
          <Drawer.Screen name="Card" component={CardScreen} />
          <Drawer.Screen name="Input" component={InputScreen} />
          {/* More screens... */}
        </Drawer.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}
```

## 🎨 Customization

### Adding New Component Screens

To add a new component demonstration screen:

1. Create a new screen component in `src/screens/`:

```tsx
// src/screens/NewComponentScreen.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { NewComponent } from '@todo/ui-mobile';

export const NewComponentScreen = () => {
  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text category="h1">New Component</Text>

        <View style={{ marginTop: 20 }}>
          <Text category="h6">Basic Usage</Text>
          <NewComponent prop="value" />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text category="h6">Variants</Text>
          <NewComponent variant="primary" />
          <NewComponent variant="secondary" />
        </View>
      </ScrollView>
    </Layout>
  );
};
```

2. Add to the drawer navigator in `App.tsx`:

```tsx
<Drawer.Screen
  name="NewComponent"
  component={NewComponentScreen}
  options={{
    drawerLabel: 'New Component',
    drawerIcon: ({ color, size }) => <Icon name="star" fill={color} width={size} height={size} />,
  }}
/>
```

### Theme Customization

The showcase supports custom Eva Design themes:

```tsx
// Custom theme configuration
const customTheme = {
  ...eva.light,
  'color-primary-100': '#F2F6FF',
  'color-primary-200': '#D9E4FF',
  'color-primary-300': '#A6C1FF',
  'color-primary-400': '#598BFF',
  'color-primary-500': '#3366FF',
  // ... other custom colors
};

<ApplicationProvider {...eva} theme={customTheme}>
  {/* App content */}
</ApplicationProvider>;
```

## 🧪 Development

### Running the Showcase

```bash
# Start Expo development server
pnpm showcase:start

# Run on specific platforms
pnpm showcase:ios      # iOS simulator
pnpm showcase:android  # Android emulator
pnpm showcase:web      # Web browser

# Run on physical device
# Scan QR code with Expo Go app
```

### Building

```bash
# Build for production
pnpm showcase:build

# Build for specific platforms
expo build:ios
expo build:android
```

### Testing

```bash
# Run tests for the showcase
pnpm test:showcase

# Run with coverage
pnpm test:showcase --coverage
```

## 📱 Platform-Specific Features

### iOS Specific

- **iOS Design Guidelines**: Components follow iOS Human Interface Guidelines
- **Safe Area**: Proper safe area handling for notched devices
- **Haptic Feedback**: iOS haptic feedback integration
- **Accessibility**: VoiceOver support and accessibility labels

### Android Specific

- **Material Design**: Components adapt to Material Design principles
- **Navigation**: Android back button and navigation handling
- **Accessibility**: TalkBack support and accessibility services
- **Permissions**: Proper Android permission handling

### Cross-Platform

- **Consistent API**: Same component API across all platforms
- **Platform Detection**: Automatic platform-specific styling
- **Responsive Design**: Adapts to different screen sizes and orientations

## 📚 Usage Examples

### Basic Component Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { Button, Card, CardContent, Input } from '@todo/ui-mobile';

function ExampleForm() {
  const [email, setEmail] = React.useState('');

  return (
    <Card style={{ margin: 16 }}>
      <CardContent>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon="email"
        />
        <Button
          title="Submit"
          variant="primary"
          size="large"
          fullWidth
          style={{ marginTop: 16 }}
          onPress={() => console.log('Submit pressed')}
        />
      </CardContent>
    </Card>
  );
}
```

### Advanced Component Combinations

```tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, CardContent, CardHeader, Input, Badge, Avatar, Switch } from '@todo/ui-mobile';

function UserProfileScreen() {
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john@example.com');
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <CardHeader title="Profile Information" />
        <CardContent>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} size="large" />
            <Badge text="Pro User" variant="success" style={{ marginTop: 8 }} />
          </View>

          <Input label="Full Name" value={name} onChangeText={setName} leftIcon="person" />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon="email"
            style={{ marginTop: 16 }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Text>Push Notifications</Text>
            <Switch checked={notifications} onValueChange={setNotifications} />
          </View>
        </CardContent>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => console.log('Cancel')} />
        <Button title="Save Changes" variant="primary" style={{ flex: 1 }} onPress={() => console.log('Save')} />
      </View>
    </ScrollView>
  );
}
```

## 🔧 Configuration

### Expo Configuration

```json
{
  "expo": {
    "name": "UI Mobile Showcase",
    "slug": "ui-mobile-showcase",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.todo.ui-mobile-showcase"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.todo.ui_mobile_showcase"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Babel Configuration

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@todo/ui-mobile': '../lib',
          },
        },
      ],
    ],
  };
};
```

## 🚀 Deployment

### Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for app stores
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Development Builds

```bash
# Create development build
eas build --profile development --platform all

# Install on device
eas build:run --platform ios
eas build:run --platform android
```

## 📊 Performance

The showcase is optimized for mobile performance:

- **Bundle Splitting**: Components are loaded efficiently
- **Image Optimization**: Proper image sizing and caching
- **Memory Management**: Efficient component mounting/unmounting
- **Smooth Animations**: 60fps animations with native driver
- **Fast Refresh**: Quick development iteration with Expo

## 🔍 Debugging

### Expo Developer Tools

```bash
# Open developer menu on device
# iOS: Cmd+D (simulator) or shake device
# Android: Cmd+M (emulator) or shake device

# Enable remote debugging
# Select "Debug Remote JS" from developer menu
```

### React Native Debugger

```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Start debugger
react-native-debugger
```

## 🤝 Contributing

To contribute to the showcase:

1. **Add new component demonstrations** with comprehensive examples
2. **Improve navigation and user experience** for mobile devices
3. **Enhance accessibility features** and testing
4. **Add platform-specific examples** showcasing iOS/Android differences
5. **Improve performance** and loading times

## 📄 License

This showcase application is part of the `@todo/ui-mobile` package and follows the same license terms.

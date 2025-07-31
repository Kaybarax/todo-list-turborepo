# Contributing to @todo/ui-mobile

Thank you for your interest in contributing to the `@todo/ui-mobile` component library! This document provides guidelines and information for contributors working with React Native and mobile development.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: Version 9.12.0 or higher (required for monorepo management)
- **React Native CLI**: For React Native development
- **Expo CLI**: For Expo development and testing
- **iOS Development**: Xcode (for iOS development)
- **Android Development**: Android Studio and SDK (for Android development)
- **Git**: For version control

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd todo-list-turborepo
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build packages**:
   ```bash
   pnpm build:packages
   ```

4. **Start mobile development**:
   ```bash
   # Start the mobile UI package in development mode
   cd packages/ui-mobile
   pnpm dev
   
   # In another terminal, start Storybook
   pnpm storybook
   
   # In another terminal, start the showcase app
   pnpm showcase:start
   ```

### Mobile Development Environment

#### iOS Setup

1. **Install Xcode**: Download from the Mac App Store
2. **Install iOS Simulator**: Included with Xcode
3. **Install CocoaPods**: `sudo gem install cocoapods`

#### Android Setup

1. **Install Android Studio**: Download from the official website
2. **Configure Android SDK**: Set up SDK and emulator
3. **Set environment variables**:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/mobile-component-name
   ```

2. **Make your changes** following the guidelines in [DEVELOPMENT.md](./DEVELOPMENT.md)

3. **Test your changes**:
   ```bash
   pnpm test
   pnpm test:ci
   pnpm lint
   
   # Test on devices/simulators
   pnpm showcase:ios
   pnpm showcase:android
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(mobile): add new component"
   ```

5. **Push and create a pull request**:
   ```bash
   git push origin feature/mobile-component-name
   ```

## 🧩 Types of Contributions

### 1. New Mobile Components

We welcome new components that work well on mobile devices and follow React Native best practices.

#### Before Creating a New Component

- **Check existing components**: Ensure the component doesn't already exist
- **Consider mobile UX**: Think about touch interactions and mobile usability
- **Plan for platforms**: Consider iOS and Android differences
- **Review UI Kitten**: Check if UI Kitten has a suitable base component
- **Consider accessibility**: Plan for screen readers and accessibility services

#### Mobile Component Requirements

- **Built on UI Kitten**: Use UI Kitten components as foundation
- **TypeScript**: Full TypeScript support with React Native types
- **Cross-platform**: Works on both iOS and Android
- **Accessibility**: React Native accessibility compliance
- **Testing**: Comprehensive unit tests with React Native Testing Library
- **Documentation**: Complete Storybook stories for React Native
- **Performance**: Optimized for mobile device constraints
- **Touch-friendly**: Appropriate touch targets and gestures

### 2. Platform-Specific Improvements

Help us improve platform-specific functionality:

- **iOS-specific features**: iOS design guidelines and interactions
- **Android-specific features**: Material Design compliance
- **Performance optimizations**: Mobile-specific performance improvements
- **Accessibility enhancements**: Platform-specific accessibility features

### 3. Bug Fixes

Mobile-specific bug fixes are crucial:

- **Platform bugs**: Issues specific to iOS or Android
- **Performance issues**: Memory leaks, slow rendering, etc.
- **Accessibility bugs**: Screen reader or accessibility service issues
- **Touch interaction bugs**: Gesture handling and touch response issues

### 4. Documentation Improvements

Help us improve mobile-specific documentation:

- **React Native examples**: Mobile-specific usage patterns
- **Platform guides**: iOS and Android specific information
- **Performance guides**: Mobile optimization techniques
- **Accessibility guides**: Mobile accessibility best practices

## 📋 Mobile-Specific Guidelines

### React Native Best Practices

#### Component Structure

```tsx
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button as UIKittenButton, ButtonProps } from '@ui-kitten/components';

export interface MobileButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  touchFeedback?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  touchFeedback = true,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    fullWidth && styles.fullWidth,
    Platform.OS === 'ios' && styles.ios,
    Platform.OS === 'android' && styles.android,
    style,
  ];

  return (
    <UIKittenButton
      status={variant === 'primary' ? 'primary' : 'basic'}
      style={buttonStyle}
      activeOpacity={touchFeedback ? 0.7 : 1}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44, // Minimum touch target size
  },
  fullWidth: {
    width: '100%',
  },
  ios: {
    borderRadius: 8,
  },
  android: {
    borderRadius: 4,
    elevation: 2,
  },
});
```

#### Accessibility Implementation

```tsx
import { AccessibilityInfo } from 'react-native';

// Good: Comprehensive accessibility
<TouchableOpacity
  accessibilityLabel="Close dialog"
  accessibilityHint="Closes the current dialog and returns to the previous screen"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  style={styles.touchTarget} // Minimum 44x44 points
  onPress={handleClose}
>
  <Text>Close</Text>
</TouchableOpacity>

// Good: Dynamic accessibility
const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);

React.useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    setIsScreenReaderEnabled
  );
  return () => subscription?.remove();
}, []);
```

#### Performance Optimization

```tsx
import { FlatList, VirtualizedList } from 'react-native';

// Good: Optimized list rendering
<FlatList
  data={items}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>

// Good: Memoized components
const MemoizedItem = React.memo(({ item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));
```

### Testing Requirements

#### Unit Tests with React Native Testing Library

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { MobileButton } from '../MobileButton';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('MobileButton', () => {
  it('renders correctly on mobile', () => {
    const { getByText } = render(
      <MobileButton title="Test Button" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles touch interactions', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MobileButton title="Touch Me" onPress={onPress} />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.press(getByText('Touch Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('supports accessibility features', () => {
    const { getByLabelText } = render(
      <MobileButton 
        title="Accessible Button"
        accessibilityLabel="Custom accessibility label"
        onPress={() => {}}
      />,
      { wrapper: TestWrapper }
    );
    
    const button = getByLabelText('Custom accessibility label');
    expect(button).toBeTruthy();
  });
});
```

#### Platform-Specific Tests

```tsx
import { Platform } from 'react-native';

describe('MobileButton Platform Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies iOS-specific styles', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(
      <MobileButton title="iOS Button" testID="button" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByTestId('button');
    expect(button.props.style).toMatchObject({
      borderRadius: 8,
    });
  });

  it('applies Android-specific styles', () => {
    Platform.OS = 'android';
    const { getByTestId } = render(
      <MobileButton title="Android Button" testID="button" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByTestId('button');
    expect(button.props.style).toMatchObject({
      elevation: 2,
    });
  });
});
```

### Storybook for React Native

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MobileButton } from './MobileButton';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const UIKittenWrapper = ({ children }: { children: React.ReactNode }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

const meta: Meta<typeof MobileButton> = {
  title: 'Mobile/Button',
  component: MobileButton,
  decorators: [
    (Story) => (
      <UIKittenWrapper>
        <Story />
      </UIKittenWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A mobile-optimized button component built on UI Kitten.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Mobile Button',
    onPress: () => console.log('Button pressed'),
  },
};

export const PlatformVariants: Story = {
  render: () => (
    <UIKittenWrapper>
      <div style={{ padding: 16, gap: 8 }}>
        <MobileButton title="iOS Style" variant="primary" />
        <MobileButton title="Android Style" variant="secondary" />
      </div>
    </UIKittenWrapper>
  ),
};
```

## 🎨 Mobile Design Guidelines

### Touch Targets

Ensure all interactive elements meet minimum touch target sizes:

```tsx
const styles = StyleSheet.create({
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Platform Design Guidelines

#### iOS Design Guidelines

```tsx
// iOS-specific styling
const iosStyles = StyleSheet.create({
  button: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '400',
  },
});
```

#### Android Design Guidelines

```tsx
// Android-specific styling
const androidStyles = StyleSheet.create({
  button: {
    borderRadius: 4,
    elevation: 5,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
  },
});
```

### Responsive Design for Mobile

```tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const isLandscape = width > height;

const styles = StyleSheet.create({
  container: {
    padding: isTablet ? 24 : 16,
    flexDirection: isLandscape ? 'row' : 'column',
  },
  text: {
    fontSize: isTablet ? 18 : 16,
  },
});
```

## 🧪 Testing on Devices

### iOS Testing

```bash
# Start iOS simulator
pnpm showcase:ios

# Run on specific iOS device
npx expo run:ios --device

# Debug on iOS device
npx expo run:ios --configuration Debug
```

### Android Testing

```bash
# Start Android emulator
pnpm showcase:android

# Run on connected Android device
npx expo run:android --device

# Debug on Android device
npx expo run:android --variant debug
```

### Cross-Platform Testing

```bash
# Test on web (for debugging)
pnpm showcase:web

# Run comprehensive tests
pnpm test:ci

# Test accessibility
pnpm test:a11y
```

## 📱 Platform-Specific Considerations

### iOS Considerations

- **Safe Area**: Handle notched devices and safe areas
- **Haptic Feedback**: Use iOS haptic feedback appropriately
- **Navigation**: Follow iOS navigation patterns
- **Accessibility**: VoiceOver compatibility

### Android Considerations

- **Material Design**: Follow Material Design guidelines
- **Back Button**: Handle Android back button behavior
- **Permissions**: Handle Android runtime permissions
- **Accessibility**: TalkBack compatibility

### Cross-Platform Best Practices

- **Consistent API**: Maintain same component interface
- **Platform Detection**: Use Platform.select() for differences
- **Performance**: Optimize for mobile constraints
- **Testing**: Test on both platforms regularly

## 🚀 Performance Guidelines

### Mobile Performance Optimization

1. **Bundle Size**: Keep bundle size minimal for mobile
2. **Memory Usage**: Monitor and optimize memory consumption
3. **Rendering**: Use FlatList for large datasets
4. **Images**: Optimize images for mobile screens
5. **Animations**: Use native driver for smooth animations

```tsx
// Good: Optimized for mobile performance
import { Animated } from 'react-native';

const fadeAnim = new Animated.Value(0);

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Use native driver for performance
}).start();
```

## 📋 Mobile-Specific Checklist

Before submitting mobile components:

### Implementation
- [ ] Uses UI Kitten as foundation
- [ ] Works on both iOS and Android
- [ ] Follows platform design guidelines
- [ ] Handles touch interactions properly
- [ ] Includes proper error handling
- [ ] Optimized for mobile performance

### Accessibility
- [ ] Minimum 44x44 point touch targets
- [ ] Proper accessibility labels and hints
- [ ] Screen reader compatibility (VoiceOver/TalkBack)
- [ ] Keyboard navigation support
- [ ] High contrast support

### Testing
- [ ] Unit tests with React Native Testing Library
- [ ] Platform-specific tests
- [ ] Accessibility tests
- [ ] Performance tests
- [ ] Manual testing on devices

### Documentation
- [ ] React Native Storybook stories
- [ ] Platform-specific examples
- [ ] Performance considerations documented
- [ ] Accessibility features documented

## 🤝 Mobile Community Guidelines

### Mobile-Specific Support

When asking for help with mobile issues:

1. **Specify platform**: iOS, Android, or both
2. **Include device info**: Device model, OS version
3. **Provide logs**: Metro bundler logs, device logs
4. **Include screenshots**: Visual issues are easier to debug
5. **Test on devices**: Simulator/emulator vs real device behavior

### Mobile Testing Help

We encourage testing on real devices:

- **iOS**: Test on various iPhone and iPad models
- **Android**: Test on different Android versions and manufacturers
- **Performance**: Test on lower-end devices
- **Accessibility**: Test with screen readers enabled

## 📞 Mobile-Specific Contact

For mobile-specific questions:

- **React Native issues**: Tag with "react-native" label
- **iOS issues**: Tag with "ios" label  
- **Android issues**: Tag with "android" label
- **Performance issues**: Tag with "performance" label
- **Accessibility issues**: Tag with "accessibility" label

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to `@todo/ui-mobile`! Your mobile expertise helps make this library better for React Native developers everywhere. 📱🎉
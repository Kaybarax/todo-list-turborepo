# Component API Documentation

## Eva Design Enhanced Components

All components have been enhanced with Eva Design theming while maintaining backward compatibility.

## Button

Enhanced Eva Design Button with comprehensive styling options.

### Props

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  appearance?: 'filled' | 'outline' | 'ghost';
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  disabled?: boolean;
  accessoryLeft?: React.ComponentType;
  accessoryRight?: React.ComponentType;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
// Basic usage
<Button title="Click me" onPress={() => {}} />

// With Eva Design status
<Button
  title="Primary Action"
  status="primary"
  appearance="filled"
  onPress={() => {}}
/>

// With accessories
<Button
  title="Download"
  accessoryLeft={DownloadIcon}
  status="success"
  onPress={() => {}}
/>
```

## Input

Eva Design Input with validation states and enhanced styling.

### Props

```tsx
interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  caption?: string;
  accessoryLeft?: React.ComponentType;
  accessoryRight?: React.ComponentType;
  disabled?: boolean;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
// Basic input
<Input
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>

// With validation
<Input
  placeholder="Email"
  status="danger"
  caption="Please enter a valid email"
  value={email}
  onChangeText={setEmail}
/>
```

## Card

Eva Design Card with elevation and theming.

### Props

```tsx
interface CardProps {
  children: React.ReactNode;
  header?: React.ComponentType;
  footer?: React.ComponentType;
  appearance?: 'filled' | 'outline';
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
// Basic card
<Card>
  <Text>Card content</Text>
</Card>

// Interactive card
<Card
  header={() => <Text category="h6">Card Title</Text>}
  onPress={() => {}}
  status="primary"
>
  <Text>Clickable card content</Text>
</Card>
```

## Modal

Full-screen modal with Eva Design theming and animations.

### Props

```tsx
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  animationType?: 'slide' | 'fade' | 'none';
  showCloseButton?: boolean;
  backdropStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
<Modal visible={isVisible} onClose={() => setIsVisible(false)} title="Modal Title" animationType="slide">
  <Text>Modal content</Text>
</Modal>
```

## Avatar

User avatar component with Eva Design theming.

### Props

```tsx
interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  shape?: 'round' | 'rounded' | 'square';
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
// Image avatar
<Avatar source={{ uri: 'https://example.com/avatar.jpg' }} />

// Initials avatar
<Avatar
  initials="JD"
  size="large"
  shape="rounded"
/>
```

## Badge

Status badge with Eva Design colors.

### Props

```tsx
interface BadgeProps {
  children: React.ReactNode;
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'tiny' | 'small' | 'medium' | 'large';
  appearance?: 'filled' | 'outline';
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
<Badge status="success" size="small">
  <Text>Online</Text>
</Badge>

<Badge status="danger" appearance="outline">
  <Text>Error</Text>
</Badge>
```

## Switch

Toggle switch with Eva Design styling.

### Props

```tsx
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
<Switch checked={isEnabled} onChange={setIsEnabled} status="primary">
  <Text>Enable notifications</Text>
</Switch>
```

## Checkbox

Checkbox with indeterminate state support.

### Props

```tsx
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  indeterminate?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  status="primary"
>
  <Text>Accept terms</Text>
</Checkbox>

// Indeterminate state
<Checkbox
  checked={false}
  indeterminate={true}
  onChange={() => {}}
>
  <Text>Partial selection</Text>
</Checkbox>
```

## NetworkSelector

Network selection component with grid and list variants.

### Props

```tsx
interface NetworkSelectorProps {
  networks: Network[];
  selectedNetwork?: Network;
  onNetworkSelect: (network: Network) => void;
  variant?: 'grid' | 'list';
  showBadges?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface Network {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  chainId?: number;
  isTestnet?: boolean;
}
```

### Examples

```tsx
<NetworkSelector
  networks={availableNetworks}
  selectedNetwork={currentNetwork}
  onNetworkSelect={handleNetworkChange}
  variant="grid"
  showBadges={true}
/>
```

## Text

Eva Design Text with typography categories.

### Props

```tsx
interface TextProps {
  children: React.ReactNode;
  category?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p1' | 'p2' | 'c1' | 'c2' | 'label';
  appearance?: 'default' | 'alternative' | 'hint';
  status?: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  style?: StyleProp<TextStyle>;
}
```

### Examples

```tsx
<Text category="h1">Main Heading</Text>
<Text category="p1" appearance="hint">Subtitle text</Text>
<Text category="label" status="danger">Error message</Text>
```

## Icon

Eva Design Icon with theme integration.

### Props

```tsx
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
```

### Examples

```tsx
<Icon name="home" size={24} />
<Icon name="settings" color={theme['color-primary-default']} />
```

## Theme Integration

All components support Eva Design theming through the `useEnhancedTheme` hook:

```tsx
import { useEnhancedTheme } from '@repo/ui-mobile/theme';

const MyComponent = () => {
  const { evaTheme } = useEnhancedTheme();

  return (
    <View style={{ backgroundColor: evaTheme['background-basic-color-1'] }}>
      <Button title="Themed Button" status="primary" onPress={() => {}} />
    </View>
  );
};
```

## Accessibility

All components include Eva Design's built-in accessibility features:

- Screen reader support
- Keyboard navigation
- High contrast mode compatibility
- Semantic labeling
- Focus management

## Styling Guidelines

### Use Eva Design Status Props

```tsx
// ✅ Preferred
<Button status="primary" title="Action" />
<Input status="danger" caption="Error message" />

// ❌ Avoid custom colors when status props are available
<Button style={{ backgroundColor: '#3366FF' }} title="Action" />
```

### Leverage Theme Tokens

```tsx
const { evaTheme } = useEnhancedTheme();

// ✅ Use theme tokens
const styles = {
  container: {
    padding: evaTheme['spacing-medium'],
    backgroundColor: evaTheme['background-basic-color-2'],
  },
};

// ❌ Avoid hardcoded values
const styles = {
  container: {
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
};
```

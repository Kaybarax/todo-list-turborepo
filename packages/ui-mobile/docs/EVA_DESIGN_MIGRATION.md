# Eva Design Migration Guide

## Overview

This guide covers the migration of the UI Mobile package to Eva Design, providing modern theming, accessibility, and component consistency across the mobile application.

## What Changed

### Core Components Migrated

All major UI components have been migrated to Eva Design:

- **Atoms**: Button, Input, Text, Icon
- **Molecules**: Card, ListItem, SearchBar, TabBar, Header
- **Organisms**: Modal, NetworkSelector
- **Specialized**: Avatar, Badge, Switch, Checkbox

### Theme System

The theme system now uses Eva Design's comprehensive theming approach:

```tsx
import { useEnhancedTheme } from '@repo/ui-mobile/theme';

const MyComponent = () => {
  const { theme, evaTheme } = useEnhancedTheme();

  return (
    <View style={{ backgroundColor: evaTheme['background-basic-color-1'] }}>
      <Text style={{ color: evaTheme['text-basic-color'] }}>Themed content</Text>
    </View>
  );
};
```

## Migration Steps

### 1. Update Imports

**Before:**

```tsx
import { Button, Card, Input } from '@repo/ui-mobile';
```

**After:**

```tsx
import { Button, Card, Input } from '@repo/ui-mobile';
// Components maintain the same API for backward compatibility
```

### 2. Theme Provider Setup

Wrap your app with the Eva Design providers:

```tsx
import { EvaProvider } from '@repo/ui-mobile/theme';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

function App() {
  return (
    <ApplicationProvider {...eva.light} theme={eva.light}>
      <EvaProvider>
        <YourApp />
      </EvaProvider>
    </ApplicationProvider>
  );
}
```

### 3. Component Updates

Most components maintain backward compatibility, but some props have been enhanced:

#### Button Component

```tsx
// Still works
<Button title="Click me" onPress={handlePress} />

// New Eva Design variants
<Button
  title="Primary"
  appearance="filled"
  status="primary"
/>
```

#### Input Component

```tsx
// Enhanced with Eva Design styling
<Input
  placeholder="Enter text"
  status="success" // New Eva Design status
  caption="Helper text" // New Eva Design caption
/>
```

### 4. Custom Styling

Use Eva Design tokens for consistent styling:

```tsx
import { useEnhancedTheme } from '@repo/ui-mobile/theme';

const MyComponent = () => {
  const { evaTheme } = useEnhancedTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: evaTheme['background-basic-color-1'],
      padding: evaTheme['spacing-medium'],
      borderRadius: evaTheme['border-radius-medium'],
    },
    text: {
      color: evaTheme['text-basic-color'],
      fontSize: evaTheme['text-paragraph-1-font-size'],
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </View>
  );
};
```

## Breaking Changes

### Minimal Breaking Changes

The migration maintains backward compatibility for most use cases. However, there are some considerations:

1. **Theme Structure**: If you were accessing internal theme properties, these may have changed
2. **Custom Styling**: Some hardcoded colors may need updates to use Eva Design tokens
3. **TypeScript**: Some type definitions have been enhanced

### Component-Specific Changes

#### Modal Component

- Now uses Eva Design Card as base
- Enhanced animation and backdrop styling
- Maintains all existing props

#### NetworkSelector Component

- Grid and list variants preserved
- Enhanced with Eva Design Select styling
- Badge integration improved

## Best Practices

### 1. Use Eva Design Tokens

Always prefer Eva Design tokens over hardcoded values:

```tsx
// ❌ Avoid
const styles = {
  backgroundColor: '#3366FF',
  padding: 16,
};

// ✅ Preferred
const { evaTheme } = useEnhancedTheme();
const styles = {
  backgroundColor: evaTheme['color-primary-default'],
  padding: evaTheme['spacing-medium'],
};
```

### 2. Leverage Eva Design Status

Use Eva Design status props for consistent state indication:

```tsx
<Input status="danger" caption="Error message" />
<Button status="success" title="Success Action" />
```

### 3. Theme Switching

Implement theme switching using the enhanced theme system:

```tsx
import { ThemeProvider } from '@repo/ui-mobile/theme';

// In your app root
<ThemeProvider>
  <YourApp />
</ThemeProvider>;

// In components
const { toggleTheme, isDark } = useEnhancedTheme();
<Button title={isDark ? 'Light Mode' : 'Dark Mode'} onPress={toggleTheme} />;
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure `@ui-kitten/components` types are properly installed
2. **Theme Not Applied**: Verify ApplicationProvider and EvaProvider are properly configured
3. **Style Conflicts**: Check for hardcoded styles overriding Eva Design tokens

### Performance Considerations

- Eva Design components are optimized for performance
- Use `useEnhancedTheme` hook efficiently (avoid creating new objects in render)
- Leverage React.memo for components with complex Eva Design styling

## Examples

See the Storybook documentation for comprehensive examples of all migrated components with Eva Design theming.

## Support

For issues or questions about the Eva Design migration:

1. Check this migration guide
2. Review component documentation in Storybook
3. Consult Eva Design official documentation
4. Check the project's issue tracker

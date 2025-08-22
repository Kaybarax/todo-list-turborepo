# Mobile Design System Migration Guide

This guide documents the complete migration of the mobile Todo app to use the design system components and tokens.

## Overview

The mobile app has been successfully migrated from custom components and hardcoded styles to a comprehensive design system implementation with:

- **Design System Components**: All UI components now use `@todo/ui-mobile` components
- **Design Tokens**: Consistent spacing, colors, typography, and other design tokens
- **Theme Support**: Full light/dark theme support with ThemeProvider
- **Type Safety**: Complete TypeScript integration with design system types

## Migration Summary

### Task 9.1: Component Replacement ✅

- Replaced `TouchableOpacity` buttons with design system `Button` components
- Updated button props: `title` → `children`, size values (`large`/`small` → `lg`/`sm`)
- Replaced custom inputs with design system `Input` components
- Integrated `Card`, `CardContent`, `Badge` components throughout the app
- Fixed all component API mismatches and TypeScript errors

### Task 9.2: Design Tokens Implementation ✅

- Created `useDesignTokens` hook for centralized token access
- Replaced hardcoded colors with semantic color tokens
- Updated spacing values to use consistent spacing scale
- Migrated typography to use design system font sizes and weights
- Implemented border radius and shadow tokens

### Task 9.3: Theme Support ✅

- Integrated `ThemeProvider` at app root level
- Updated `useDesignTokens` hook to support theme context
- Added fallback mechanism for theme unavailability
- Enabled light/dark theme switching capability

### Task 9.4: Custom Style Removal ✅

- Converted all `StyleSheet.create` to `createStyles` functions using tokens
- Removed hardcoded color values (`#374151`, `#ef4444`, etc.)
- Replaced magic numbers with semantic spacing tokens
- Ensured consistent styling across all components

## Key Files Modified

### Core Infrastructure

- `apps/mobile/src/hooks/useDesignTokens.ts` - Central design tokens hook
- `apps/mobile/app/_layout.tsx` - ThemeProvider integration

### Screen Components

- `apps/mobile/app/index.tsx` - Home screen with design tokens
- `apps/mobile/app/todos.tsx` - Todo list screen with design system components

### Feature Components

- `apps/mobile/src/components/TodoItem.tsx` - Todo item with design tokens
- `apps/mobile/src/components/TodoForm.tsx` - Form with design system inputs

## Design Token Usage

### Colors

```typescript
const tokens = useDesignTokens();

// Semantic colors
tokens.colors.primary; // Primary brand color
tokens.colors.success; // Success states
tokens.colors.warning; // Warning states
tokens.colors.error; // Error states

// Text colors
tokens.colors.text.primary; // Primary text
tokens.colors.text.secondary; // Secondary text
tokens.colors.text.disabled; // Disabled text

// Surface colors
tokens.colors.background; // App background
tokens.colors.surface; // Card/surface background
```

### Spacing

```typescript
// Consistent spacing scale
tokens.spacing.xs; // 4px
tokens.spacing.sm; // 8px
tokens.spacing.md; // 12px
tokens.spacing.lg; // 16px
tokens.spacing.xl; // 20px
tokens.spacing.xxl; // 24px
tokens.spacing.xxxl; // 32px
tokens.spacing.xxxxl; // 40px
```

### Typography

```typescript
// Font sizes
tokens.typography.fontSize.sm; // Small text
tokens.typography.fontSize.md; // Body text
tokens.typography.fontSize.lg; // Large text
tokens.typography.fontSize.xxxl; // Headings

// Font weights
tokens.typography.fontWeight.normal;
tokens.typography.fontWeight.semibold;
tokens.typography.fontWeight.bold;
```

## Component Usage Examples

### Button Component

```tsx
import { Button } from '@todo/ui-mobile';

// Before
<TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>

// After
<Button variant="primary" size="lg" onPress={handlePress}>
  Submit
</Button>
```

### Input Component

```tsx
import { Input } from '@todo/ui-mobile';

// Before
<TextInput
  style={styles.input}
  placeholder="Enter title"
  value={title}
  onChangeText={setTitle}
/>

// After
<Input
  placeholder="Enter title"
  value={title}
  onChangeText={setTitle}
/>
```

### Card Component

```tsx
import { Card, CardContent } from '@todo/ui-mobile';

// Before
<View style={styles.card}>
  <View style={styles.cardContent}>
    {children}
  </View>
</View>

// After
<Card>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

## Styling Patterns

### Using Design Tokens in Styles

```tsx
import { useDesignTokens } from '../hooks/useDesignTokens';

const MyComponent = () => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  return <View style={styles.container}>{children}</View>;
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.background,
      borderRadius: tokens.borders.radius.md,
    },
    text: {
      fontSize: tokens.typography.fontSize.md,
      color: tokens.colors.text.primary,
      fontWeight: tokens.typography.fontWeight.normal,
    },
  });
```

## Theme Integration

### ThemeProvider Setup

```tsx
// apps/mobile/app/_layout.tsx
import { ThemeProvider } from '@todo/ui-mobile/lib/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>{/* App screens */}</Stack>
    </ThemeProvider>
  );
}
```

### Theme-Aware Components

The `useDesignTokens` hook automatically provides theme-aware tokens:

```tsx
const tokens = useDesignTokens();
// Automatically uses current theme (light/dark)
// Falls back to light theme if ThemeProvider unavailable
```

## Benefits Achieved

### Consistency

- Unified color palette across all screens
- Consistent spacing and typography
- Standardized component behavior

### Maintainability

- Centralized design token management
- Easy theme switching
- Reduced code duplication

### Developer Experience

- Type-safe design token usage
- Clear component APIs
- Comprehensive documentation

### Performance

- Optimized component rendering
- Reduced bundle size through shared components
- Efficient theme switching

## Future Enhancements

### Planned Features

- Dynamic theme switching UI
- Custom theme creation
- Advanced accessibility features
- Animation and transition tokens

### Migration Opportunities

- Additional screen migrations
- Enhanced component variants
- Advanced layout components

## Troubleshooting

### Common Issues

1. **Theme not available**: Ensure ThemeProvider wraps your app
2. **Token not found**: Check token path and spelling
3. **Style not applying**: Verify createStyles function usage

### Debug Tips

- Use React DevTools to inspect theme context
- Check console for theme validation errors
- Verify component prop types match design system API

## Conclusion

The mobile app has been successfully migrated to use the design system, providing:

- ✅ Consistent visual design
- ✅ Improved maintainability
- ✅ Enhanced developer experience
- ✅ Full theme support
- ✅ Type safety throughout

The migration establishes a solid foundation for future development and ensures the mobile app aligns with the overall design system strategy.

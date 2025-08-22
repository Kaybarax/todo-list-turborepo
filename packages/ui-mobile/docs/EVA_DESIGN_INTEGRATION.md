# Eva Design Integration Documentation

## Architecture Overview

The UI Mobile package has been fully integrated with Eva Design to provide a modern, accessible, and themeable component library for React Native applications.

## Core Integration Components

### Theme System

#### EvaProvider

Central theme provider that wraps Eva Design's ApplicationProvider with enhanced functionality:

```tsx
import { EvaProvider } from '@repo/ui-mobile/theme';

<EvaProvider>
  <YourApp />
</EvaProvider>;
```

#### useEnhancedTheme Hook

Provides access to both Eva Design themes and enhanced theme utilities:

```tsx
import { useEnhancedTheme } from '@repo/ui-mobile/theme';

const { theme, evaTheme, isDark, toggleTheme } = useEnhancedTheme();
```

**Returns:**

- `theme`: Current Eva Design theme object
- `evaTheme`: Flattened theme tokens for easy access
- `isDark`: Boolean indicating dark mode state
- `toggleTheme`: Function to switch between light/dark themes

### Token System

Eva Design tokens are generated using Style Dictionary and available as TypeScript types:

```tsx
// Generated tokens include:
interface EvaThemeTokens {
  'color-primary-default': string;
  'color-success-default': string;
  'background-basic-color-1': string;
  'text-basic-color': string;
  'spacing-tiny': number;
  'spacing-small': number;
  'spacing-medium': number;
  'border-radius-small': number;
  // ... and many more
}
```

## Component Architecture

### Base Component Pattern

All migrated components follow this pattern:

1. **Extend UI Kitten base components** for Eva Design integration
2. **Maintain backward compatibility** with existing APIs
3. **Use enhanced theming** via `useEnhancedTheme` hook
4. **Apply Eva Design tokens** for consistent styling

Example implementation:

```tsx
import React from 'react';
import { Button as KittenButton } from '@ui-kitten/components';
import { useEnhancedTheme } from '../theme';

export const Button: React.FC<ButtonProps> = ({ title, appearance = 'filled', status = 'primary', ...props }) => {
  const { evaTheme } = useEnhancedTheme();

  return (
    <KittenButton appearance={appearance} status={status} {...props}>
      {title}
    </KittenButton>
  );
};
```

### Component Categories

#### Atoms

- **Button**: Eva Design Button with enhanced styling
- **Input**: Eva Design Input with validation states
- **Text**: Eva Design Text with typography categories
- **Icon**: Eva Design Icon with theme integration

#### Molecules

- **Card**: Eva Design Card with elevation and theming
- **ListItem**: Enhanced ListItem with Eva Design styling
- **SearchBar**: Input-based search with Eva Design theming
- **TabBar**: Navigation tabs with Eva Design theming
- **Header**: Navigation header with Eva Design styling

#### Organisms

- **Modal**: Full-screen modal with Eva Design Card base
- **NetworkSelector**: Grid/list network selection with Eva Design

#### Specialized

- **Avatar**: User avatar with Eva Design theming
- **Badge**: Status badges with Eva Design colors
- **Switch**: Toggle switch with Eva Design styling
- **Checkbox**: Checkbox with indeterminate state support

## Theming System

### Light and Dark Themes

Eva Design provides comprehensive light and dark themes:

```tsx
import * as eva from '@eva-design/eva';

// Light theme tokens
eva.light['background-basic-color-1']; // '#FFFFFF'
eva.light['text-basic-color']; // '#222B45'

// Dark theme tokens
eva.dark['background-basic-color-1']; // '#1A2138'
eva.dark['text-basic-color']; // '#FFFFFF'
```

### Custom Theme Extension

Extend Eva Design themes with custom tokens:

```tsx
const customTheme = {
  ...eva.light,
  'color-brand-primary': '#FF6B35',
  'color-brand-secondary': '#004E89',
};
```

### Theme Persistence

Theme preferences are automatically persisted using AsyncStorage in the mobile app:

```tsx
// ThemeProvider handles persistence automatically
import { ThemeProvider } from '@repo/mobile/providers';

<ThemeProvider>
  <App />
</ThemeProvider>;
```

## Build System Integration

### Style Dictionary Configuration

Tokens are generated using Style Dictionary with custom transforms:

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    'react-native': {
      transformGroup: 'react-native',
      buildPath: 'lib/theme/tokens/',
      files: [
        {
          destination: 'eva-tokens.ts',
          format: 'typescript/eva-theme-tokens',
        },
      ],
    },
  },
};
```

### Build Scripts

```json
{
  "scripts": {
    "build:tokens": "style-dictionary build",
    "dev:tokens": "style-dictionary build --watch",
    "build": "npm run build:tokens && tsc"
  }
}
```

## Accessibility Features

Eva Design provides built-in accessibility features:

- **Screen reader support** for all components
- **High contrast mode** compatibility
- **Keyboard navigation** support
- **Focus management** for modals and overlays
- **Semantic HTML** structure in web builds

## Performance Optimizations

### Bundle Size Optimization

- Tree-shaking enabled for Eva Design components
- Selective imports to reduce bundle size
- Lazy loading for complex components

### Runtime Performance

- Memoized theme calculations
- Efficient re-rendering with React.memo
- Optimized Style Dictionary token access

## Testing Integration

### Component Testing

```tsx
import { render } from '@testing-library/react-native';
import { EvaProvider } from '@repo/ui-mobile/theme';

const renderWithTheme = component => {
  return render(<EvaProvider>{component}</EvaProvider>);
};
```

### Theme Testing

```tsx
import { useEnhancedTheme } from '@repo/ui-mobile/theme';

// Test theme switching
const { toggleTheme, isDark } = useEnhancedTheme();
expect(isDark).toBe(false);
toggleTheme();
expect(isDark).toBe(true);
```

## Storybook Integration

Storybook is configured with Eva Design theming:

```tsx
// .storybook/preview.ts
export const globalTypes = {
  theme: {
    description: 'Eva Design Theme',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
};
```

## Migration Benefits

### Developer Experience

- **Consistent theming** across all components
- **TypeScript support** for theme tokens
- **Hot reloading** for theme changes
- **Comprehensive documentation** and examples

### User Experience

- **Accessible components** out of the box
- **Smooth animations** and interactions
- **Consistent visual language** across the app
- **Dark mode support** with automatic persistence

### Maintenance

- **Centralized theme management**
- **Automated token generation**
- **Backward compatibility** preservation
- **Future-proof architecture** for design system evolution

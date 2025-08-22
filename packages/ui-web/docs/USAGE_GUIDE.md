# Design System Usage Guide

## Overview

The `@todo/ui-web` design system provides a comprehensive set of React components, design tokens, and utilities for building consistent user interfaces across the Todo application ecosystem.

## Installation

```bash
npm install @todo/ui-web
# or
pnpm add @todo/ui-web
```

## Quick Start

### 1. Import Components

```tsx
import { Button, Input, Card } from '@todo/ui-web';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text..." />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### 2. Theme Setup

Wrap your application with the ThemeProvider:

```tsx
import { ThemeProvider } from '@todo/ui-web';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. Import Styles

```tsx
import '@todo/ui-web/styles.css';
```

## Component Categories

### Form Components

- **Button**: Primary actions, secondary actions, ghost buttons
- **Input**: Text inputs with validation states
- **Textarea**: Multi-line text inputs
- **Select**: Dropdown selections

### Layout Components

- **Card**: Content containers with headers and footers
- **Dialog**: Modal dialogs and overlays
- **Tabs**: Tabbed navigation interfaces

### Navigation Components

- **Breadcrumb**: Hierarchical navigation
- **Pagination**: Page navigation controls
- **Dropdown**: Action menus and selections

### Feedback Components

- **Badge**: Status indicators and labels
- **Tooltip**: Contextual help text
- **Spinner**: Loading indicators

### Media Components

- **Avatar**: User profile images with fallbacks
- **Image**: Responsive images with loading states

## Design Tokens

### Colors

```tsx
// Using CSS custom properties
.my-element {
  color: var(--color-primary-500);
  background: var(--color-surface-100);
}

// Using Tailwind classes
<div className="text-primary-500 bg-surface-100">
  Content
</div>
```

### Typography

```tsx
// Typography scales
<h1 className="text-heading-xl">Large Heading</h1>
<p className="text-body-md">Body text</p>
<span className="text-caption-sm">Small caption</span>
```

### Spacing

```tsx
// Consistent spacing
<div className="p-space-md m-space-lg">Content with consistent spacing</div>
```

## Component Variants

Most components support multiple variants for different use cases:

```tsx
// Button variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Input states
<Input state="default" />
<Input state="error" />
<Input state="success" />
```

## Accessibility Features

All components include built-in accessibility features:

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant colors

### Keyboard Shortcuts

- **Tab/Shift+Tab**: Navigate between focusable elements
- **Enter/Space**: Activate buttons and controls
- **Escape**: Close dialogs and dropdowns
- **Arrow Keys**: Navigate within components (tabs, dropdowns)

## Theme Customization

### Custom Themes

```tsx
import { ThemeProvider } from '@todo/ui-web';

const customTheme = {
  name: 'custom',
  cssVars: {
    '--color-primary-500': '#your-color',
    '--color-surface-100': '#your-surface',
  },
};

<ThemeProvider themes={[customTheme]} defaultThemeName="custom">
  <App />
</ThemeProvider>;
```

### Theme Switching

```tsx
import { useThemeContext } from '@todo/ui-web';

function ThemeToggle() {
  const { mode, setMode } = useThemeContext();

  return <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>Toggle Theme</Button>;
}
```

## Migration Guide

### From Legacy Components

1. **Replace hardcoded styles** with design tokens:

```tsx
// Before
<button style={{ color: '#3b82f6' }}>Click me</button>

// After
<Button variant="primary">Click me</Button>
```

2. **Update component imports**:

```tsx
// Before
import Button from './components/Button';

// After
import { Button } from '@todo/ui-web';
```

3. **Add theme provider**:

```tsx
// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Breaking Changes

- Component props may have changed - check individual component documentation
- CSS classes are now generated automatically
- Some components require the ThemeProvider context

## Performance Optimization

### Tree Shaking

Import only what you need:

```tsx
// Good - tree-shakable
import { Button } from '@todo/ui-web';

// Avoid - imports everything
import * as UI from '@todo/ui-web';
```

### Bundle Size

The design system is optimized for minimal bundle impact:

- Components are tree-shakable
- CSS is automatically optimized
- No runtime dependencies on large libraries

## Testing

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@todo/ui-web';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices

### Component Usage

1. **Use semantic variants**: Choose variants that match the component's purpose
2. **Maintain consistency**: Use the same variants for similar actions
3. **Follow accessibility guidelines**: Provide proper labels and descriptions
4. **Test with keyboard**: Ensure all interactions work without a mouse

### Styling

1. **Use design tokens**: Prefer tokens over hardcoded values
2. **Leverage variants**: Use built-in variants before custom styling
3. **Maintain theme compatibility**: Ensure custom styles work in all themes
4. **Test responsive behavior**: Verify components work on all screen sizes

### Performance

1. **Import selectively**: Only import components you use
2. **Optimize images**: Use proper formats and sizes for Avatar/Image components
3. **Lazy load**: Consider lazy loading for large component trees
4. **Monitor bundle size**: Use bundle analysis tools to track impact

## Troubleshooting

### Common Issues

**Theme not applying**

- Ensure ThemeProvider wraps your app
- Check that CSS is imported
- Verify theme configuration

**Components not styled**

- Import the CSS file
- Check Tailwind configuration
- Verify build process includes CSS

**TypeScript errors**

- Update to latest version
- Check component prop types
- Verify import paths

**Accessibility warnings**

- Add proper labels
- Check ARIA attributes
- Test with screen readers

## Support

For questions and issues:

- Check component documentation in Storybook
- Review accessibility guidelines
- Test with provided utilities
- Follow established patterns

## Resources

- [Storybook Documentation](http://localhost:6006)
- [Component API Reference](./API.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
- [Migration Guide](./MIGRATION.md)

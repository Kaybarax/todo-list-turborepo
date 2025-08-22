# Migration Guide

## Overview

This guide helps you migrate from legacy UI components to the `@todo/ui-web` design system.

## Pre-Migration Checklist

- [ ] Audit existing components and their usage
- [ ] Identify custom styles that need token replacements
- [ ] Plan theme integration strategy
- [ ] Set up testing for migrated components
- [ ] Create migration timeline and phases

## Step-by-Step Migration

### Phase 1: Setup and Infrastructure

1. **Install the design system**:

```bash
pnpm add @todo/ui-web
```

2. **Add CSS imports** to your main entry file:

```tsx
import '@todo/ui-web/styles.css';
```

3. **Set up ThemeProvider** at your app root:

```tsx
import { ThemeProvider } from '@todo/ui-web';

function App() {
  return <ThemeProvider defaultMode="system">{/* Your app content */}</ThemeProvider>;
}
```

### Phase 2: Component Migration

#### Button Components

**Before:**

```tsx
// Legacy button
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleClick}>
  Click me
</button>
```

**After:**

```tsx
import { Button } from '@todo/ui-web';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>;
```

#### Form Components

**Before:**

```tsx
// Legacy input
<input
  type="text"
  className="border border-gray-300 px-3 py-2 rounded focus:border-blue-500"
  placeholder="Enter text"
/>
```

**After:**

```tsx
import { Input } from '@todo/ui-web';

<Input placeholder="Enter text" />;
```

#### Card Components

**Before:**

```tsx
// Legacy card
<div className="bg-white shadow-md rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

**After:**

```tsx
import { Card } from '@todo/ui-web';

<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Content</p>
  </Card.Content>
</Card>;
```

### Phase 3: Design Token Migration

#### Color Migration

**Before:**

```css
.my-component {
  color: #3b82f6;
  background-color: #f8fafc;
  border-color: #e2e8f0;
}
```

**After:**

```css
.my-component {
  color: var(--color-primary-500);
  background-color: var(--color-surface-50);
  border-color: var(--color-border-200);
}
```

Or using Tailwind classes:

```tsx
<div className="text-primary-500 bg-surface-50 border-border-200">Content</div>
```

#### Spacing Migration

**Before:**

```css
.my-component {
  padding: 16px;
  margin: 24px;
  gap: 8px;
}
```

**After:**

```css
.my-component {
  padding: var(--space-md);
  margin: var(--space-lg);
  gap: var(--space-sm);
}
```

Or using Tailwind:

```tsx
<div className="p-space-md m-space-lg gap-space-sm">Content</div>
```

#### Typography Migration

**Before:**

```css
.heading {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}
```

**After:**

```css
.heading {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}
```

Or using Tailwind:

```tsx
<h1 className="text-heading-xl">Heading</h1>
```

### Phase 4: Theme Integration

#### Custom Theme Creation

If you have brand-specific colors:

```tsx
const brandTheme = {
  name: 'brand',
  cssVars: {
    '--color-primary-500': '#your-brand-color',
    '--color-primary-600': '#your-brand-color-dark',
    // ... other overrides
  },
};

<ThemeProvider themes={[brandTheme]} defaultThemeName="brand">
  <App />
</ThemeProvider>;
```

#### Dark Mode Support

**Before:**

```css
@media (prefers-color-scheme: dark) {
  .my-component {
    background-color: #1f2937;
    color: #f9fafb;
  }
}
```

**After:**

```tsx
// Automatic dark mode support with design tokens
<div className="bg-surface-100 text-content-primary">Content adapts to theme automatically</div>
```

## Common Migration Patterns

### Custom Component Wrapper

For components that need additional customization:

```tsx
// Create a wrapper component
import { Button, type ButtonProps } from '@todo/ui-web';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export function CustomButton({ isLoading, children, ...props }: CustomButtonProps) {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? 'Loading...' : children}
    </Button>
  );
}
```

### Gradual Migration Strategy

1. **Start with new features**: Use design system for all new components
2. **Migrate by page**: Convert one page/section at a time
3. **Update shared components**: Migrate commonly used components first
4. **Replace hardcoded values**: Convert colors, spacing, typography incrementally

### Coexistence Period

During migration, you can run both systems:

```tsx
// Legacy component
import LegacyButton from './legacy/Button';

// New component
import { Button } from '@todo/ui-web';

function MixedComponent() {
  return (
    <div>
      <LegacyButton>Legacy</LegacyButton>
      <Button variant="primary">New</Button>
    </div>
  );
}
```

## Breaking Changes

### Component API Changes

| Legacy                       | New                                             | Notes                       |
| ---------------------------- | ----------------------------------------------- | --------------------------- |
| `<Button color="blue">`      | `<Button variant="primary">`                    | Semantic variants           |
| `<Input error="Error text">` | `<Input state="error" helperText="Error text">` | Separate state and message  |
| `<Card shadow="lg">`         | `<Card>`                                        | Consistent shadow in design |

### CSS Class Changes

| Legacy           | New                              | Notes                    |
| ---------------- | -------------------------------- | ------------------------ |
| `.btn-primary`   | Use `<Button variant="primary">` | Component-based styling  |
| `.text-blue-500` | `.text-primary-500`              | Semantic color tokens    |
| `.p-4`           | `.p-space-md`                    | Consistent spacing scale |

### Import Path Changes

```tsx
// Before
import Button from './components/Button';
import { Input } from './components/forms';

// After
import { Button, Input } from '@todo/ui-web';
```

## Validation and Testing

### Visual Regression Testing

Set up visual tests to catch styling changes:

```tsx
// Example with Chromatic/Storybook
export const MigratedComponent = () => <Button variant="primary">Migrated Button</Button>;
```

### Accessibility Testing

Ensure accessibility is maintained:

```tsx
import { axe } from 'jest-axe';

test('migrated component has no accessibility violations', async () => {
  const { container } = render(<MigratedComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Cross-browser Testing

Test migrated components across browsers:

- Chrome/Chromium
- Firefox
- Safari
- Edge

## Performance Considerations

### Bundle Size Impact

Monitor bundle size during migration:

```bash
# Analyze bundle before/after
pnpm run bundle-analyze
```

### Tree Shaking

Ensure proper tree shaking:

```tsx
// Good - tree-shakable
import { Button } from '@todo/ui-web';

// Avoid - imports everything
import * as UI from '@todo/ui-web';
```

## Rollback Strategy

### Feature Flags

Use feature flags for gradual rollout:

```tsx
const useNewDesignSystem = useFeatureFlag('new-design-system');

return useNewDesignSystem ? <Button variant="primary">New</Button> : <LegacyButton>Old</LegacyButton>;
```

### Component Versioning

Keep legacy components available during transition:

```tsx
// Keep both available
export { Button } from '@todo/ui-web'; // New
export { Button as LegacyButton } from './legacy/Button'; // Old
```

## Migration Timeline

### Week 1-2: Setup

- Install design system
- Set up ThemeProvider
- Configure build tools
- Create migration plan

### Week 3-4: Core Components

- Migrate Button, Input, Card
- Update shared components
- Test in development

### Week 5-6: Layout Components

- Migrate navigation components
- Update page layouts
- Test responsive behavior

### Week 7-8: Specialized Components

- Migrate remaining components
- Update custom styling
- Performance optimization

### Week 9-10: Cleanup

- Remove legacy code
- Update documentation
- Final testing and deployment

## Troubleshooting

### Common Issues

**Styling conflicts**

- Check CSS specificity
- Verify import order
- Use CSS modules if needed

**Theme not applying**

- Ensure ThemeProvider is at root
- Check CSS custom property support
- Verify theme configuration

**TypeScript errors**

- Update component prop types
- Check import paths
- Verify version compatibility

**Performance regression**

- Check bundle size impact
- Optimize imports
- Use code splitting

## Support and Resources

- **Component Documentation**: Available in Storybook
- **Design Tokens**: Reference in token explorer
- **Migration Examples**: See example migrations in `/examples`
- **Testing Utilities**: Use provided test helpers

## Post-Migration

### Maintenance

- Keep design system updated
- Monitor for breaking changes
- Contribute improvements back
- Maintain documentation

### Optimization

- Regular bundle analysis
- Performance monitoring
- Accessibility audits
- User feedback collection

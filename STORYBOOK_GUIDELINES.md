# Storybook Stories Implementation Guidelines

This document provides comprehensive guidelines for creating and maintaining Storybook stories across both ui-web and ui-mobile packages in the monorepo.

## Overview

Our Storybook setup consists of two separate instances:
- **ui-web**: Web components using React + Tailwind CSS (Port 6007)
- **ui-mobile**: React Native components with web-compatible previews (Port 6006)

## Quick Start

### Running Storybook

From the monorepo root:
```bash
# Start web Storybook
pnpm storybook:web

# Start mobile Storybook  
pnpm storybook:mobile

# Build Storybook for deployment
pnpm storybook:build:web
pnpm storybook:build:mobile
```

### Creating a New Story

1. **For Web Components**: Use `packages/ui-web/src/stories/ComponentTemplate.stories.tsx`
2. **For Mobile Components**: Use `packages/ui-mobile/src/stories/ComponentTemplate.stories.tsx`
3. **Read the Guidelines**: Check package-specific `STORY_TEMPLATE.md` files

## Story Requirements

Every component story MUST include:

### Required Stories
- [ ] **Default**: Component with minimal required props
- [ ] **All Variants**: Each visual variant (primary, secondary, etc.)
- [ ] **All Sizes**: Each size option (small, medium, large)
- [ ] **All States**: Disabled, loading, error states
- [ ] **Accessibility**: Proper accessibility demonstration

### Optional but Recommended Stories
- [ ] **Interactive**: Demonstrates user interactions
- [ ] **Composition**: Multiple components together
- [ ] **Real-world Usage**: Common usage patterns
- [ ] **Responsive**: Different screen sizes
- [ ] **Dark Mode**: Theme variations

## File Organization

```
packages/
├── ui-web/
│   ├── src/stories/
│   │   ├── ComponentName.stories.tsx
│   │   └── ComponentTemplate.stories.tsx (template)
│   ├── STORY_TEMPLATE.md (guidelines)
│   └── .storybook/ (configuration)
└── ui-mobile/
    ├── src/stories/
    │   ├── ComponentName.stories.tsx
    │   └── ComponentTemplate.stories.tsx (template)
    ├── STORY_TEMPLATE.md (guidelines)
    └── .storybook/ (configuration)
```

## Naming Conventions

### Story Files
- Use PascalCase: `ComponentName.stories.tsx`
- Match component name exactly
- Place in `src/stories/` directory

### Story Names
- Use PascalCase: `Default`, `Primary`, `WithIcon`
- Be descriptive: `LoadingWithText` not `Loading1`
- Group related: `SmallPrimary`, `LargePrimary`

### Story Titles
- Format: `Components/ComponentName`
- Use consistent categorization
- Group related components: `Forms/Input`, `Navigation/Button`

## TypeScript Standards

### Meta Configuration
```typescript
const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
    docs: {
      description: {
        component: 'Clear, concise component description'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Comprehensive prop controls
  },
  args: { 
    onClick: fn(), // Mock functions for testing
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

### Control Configuration

Configure controls for all interactive props:

```typescript
argTypes: {
  // Text inputs
  label: {
    control: { type: 'text' },
    description: 'Label text for the component',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  
  // Boolean toggles
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether the component is disabled',
  },
  
  // Select dropdowns
  variant: {
    control: { type: 'select' },
    options: ['primary', 'secondary', 'outline'],
    description: 'Visual variant of the component',
  },
  
  // Number inputs
  maxLength: {
    control: { type: 'number', min: 0, max: 100, step: 1 },
    description: 'Maximum number of characters',
  },
  
  // Event handlers
  onClick: { action: 'clicked' },
  onSubmit: { action: 'submitted' },
}
```

## Accessibility Requirements

Every story must demonstrate accessibility:

### Required Accessibility Features
- [ ] Proper ARIA labels and descriptions
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Color contrast compliance

### Accessibility Story Example
```typescript
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Close dialog',
    'aria-describedby': 'close-description',
  },
  render: (args) => (
    <div>
      <ComponentName {...args} />
      <div id="close-description" className="sr-only">
        This button will close the current dialog
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates proper accessibility attributes and screen reader support.'
      }
    }
  },
};
```

## Web vs Mobile Differences

### Web Components (ui-web)
- Use actual React components
- Leverage Tailwind CSS classes
- Support standard web interactions
- Use `onClick` handlers
- Standard HTML attributes

### Mobile Components (ui-mobile)
- Create web-compatible versions for Storybook
- Convert React Native styles to CSS-in-JS
- Map mobile props to web equivalents:
  - `onPress` → `onClick`
  - `accessibilityLabel` → `aria-label`
  - `testID` → `data-testid`
- Use mobile-appropriate touch targets (min 44px)
- Include mobile-specific patterns

### Mobile Web Conversion Example
```typescript
// React Native component conversion for web preview
const MobileComponent: React.FC<Props> = ({ onPress, accessibilityLabel, ...props }) => {
  const handleClick = () => {
    if (onPress) onPress();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={accessibilityLabel}
      style={{
        // Convert React Native styles to CSS
        minHeight: 44, // Mobile touch target
        fontFamily: 'system-ui, -apple-system, sans-serif',
        // ... other mobile-appropriate styles
      }}
      {...props}
    />
  );
};
```

## Testing Integration

Stories should support multiple testing approaches:

### Visual Regression Testing
```typescript
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual regression test for all variants'
      }
    }
  },
};
```

### Interaction Testing
```typescript
import { userEvent, within } from '@storybook/test';

export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Add assertions here
  },
};
```

### Accessibility Testing
- Use `@storybook/addon-a11y` for automated testing
- Include manual keyboard navigation tests
- Test with screen readers when possible

## Performance Guidelines

### Story Optimization
- Keep render functions lightweight
- Use mock data instead of real API calls
- Avoid heavy computations in stories
- Use dynamic imports for heavy components

### Image Optimization
- Use optimized images in stories
- Provide alt text for all images
- Consider different screen densities for mobile

## Common Patterns

### Form Components
```typescript
export const FormExample: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <ComponentName 
          value={value}
          onChange={setValue}
          label="Example Input"
        />
        <button type="submit">Submit</button>
      </form>
    );
  },
};
```

### Loading States
```typescript
export const Loading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Please wait...',
  },
};
```

### Error States
```typescript
export const WithError: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required',
  },
};
```

### Interactive Examples
```typescript
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState(initialState);
    
    const handleAction = () => {
      setState(newState);
    };
    
    return (
      <ComponentName 
        value={state}
        onAction={handleAction}
      />
    );
  },
};
```

## Documentation Standards

### Component Descriptions
Provide clear, comprehensive descriptions:

```typescript
docs: {
  description: {
    component: 'A versatile button component built on Radix UI with multiple variants, sizes, and states. Supports icons, loading states, and full accessibility compliance. Used throughout the application for user interactions.'
  }
}
```

### Story Descriptions
Add context for complex stories:

```typescript
parameters: {
  docs: {
    description: {
      story: 'This story demonstrates how the component behaves with different prop combinations and user interactions. Use the controls panel to experiment with different configurations.'
    }
  }
}
```

## Quality Checklist

Before submitting a story, verify:

### Functionality
- [ ] All stories render without errors
- [ ] Controls work correctly
- [ ] Event handlers are properly mocked
- [ ] TypeScript compilation passes
- [ ] No console warnings or errors

### Completeness
- [ ] All required stories are present
- [ ] All component variants are covered
- [ ] All states are demonstrated
- [ ] Accessibility is properly implemented
- [ ] Documentation is clear and helpful

### Standards Compliance
- [ ] Follows naming conventions
- [ ] Uses proper TypeScript types
- [ ] Includes proper descriptions
- [ ] Follows file organization standards
- [ ] Passes linting and formatting checks

### Testing
- [ ] Visual regression tests pass
- [ ] Accessibility tests pass
- [ ] Interactive tests work correctly
- [ ] Stories work in different viewports
- [ ] Dark mode support (if applicable)

## Troubleshooting

### Common Issues

**Stories not appearing in Storybook:**
- Check file naming (must end with `.stories.tsx`)
- Verify file is in correct directory (`src/stories/`)
- Check Storybook configuration in `.storybook/main.ts`

**TypeScript errors:**
- Ensure proper imports and types
- Use `satisfies Meta<typeof Component>` for meta
- Type story objects as `Story = StoryObj<typeof meta>`

**Controls not working:**
- Verify `argTypes` configuration
- Check prop names match component interface
- Ensure event handlers use `action()` or `fn()`

**Mobile components not rendering:**
- Check web-compatible conversion
- Verify CSS-in-JS styles are correct
- Ensure touch targets meet minimum size requirements

### Getting Help

1. Check package-specific `STORY_TEMPLATE.md` files
2. Review existing stories for examples
3. Consult Storybook documentation
4. Ask team members for guidance

## Maintenance

### Regular Tasks
- Update stories when components change
- Review and improve existing stories
- Add new stories for new components
- Update documentation as needed

### Version Updates
- Keep Storybook dependencies up to date
- Test stories after Storybook updates
- Update templates and guidelines as needed
- Maintain compatibility between packages

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Web Component Template](packages/ui-web/src/stories/ComponentTemplate.stories.tsx)
- [Mobile Component Template](packages/ui-mobile/src/stories/ComponentTemplate.stories.tsx)
- [Web Guidelines](packages/ui-web/STORY_TEMPLATE.md)
- [Mobile Guidelines](packages/ui-mobile/STORY_TEMPLATE.md)
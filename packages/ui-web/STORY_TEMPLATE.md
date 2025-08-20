# Web Component Story Template & Guidelines

This document provides templates and guidelines for creating Storybook stories for web components in the ui-web package.

## Quick Start Template

Use this template for creating new component stories:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentName } from '../components/ComponentName';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
    docs: {
      description: {
        component: 'Brief description of what this component does and its primary use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for each prop
    propName: {
      control: { type: 'text' }, // or 'boolean', 'select', 'number', etc.
      description: 'Description of what this prop does',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default value' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['option1', 'option2', 'option3'],
      description: 'Visual variant of the component',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
    },
    onClick: { action: 'clicked' }, // For event handlers
  },
  args: {
    onClick: fn(), // Mock function for testing
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required: Default story
export const Default: Story = {
  args: {
    // Minimal props to show the component in its default state
  },
};

// Recommended: Variant stories for different visual states
export const Variant1: Story = {
  args: {
    variant: 'variant1',
    // Other relevant props
  },
};

export const Variant2: Story = {
  args: {
    variant: 'variant2',
    // Other relevant props
  },
};

// Recommended: State stories
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

// Optional: Complex composition stories
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-2">
        <ComponentName variant="variant1">Variant 1</ComponentName>
        <ComponentName variant="variant2">Variant 2</ComponentName>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all component variants.',
      },
    },
  },
};

// Optional: Interactive example
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState(initialState);

    return (
      <ComponentName
        value={state}
        onChange={setState}
        // other props
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example demonstrating component behavior.',
      },
    },
  },
};
```

## Story Guidelines

### Required Stories

Every component MUST have these stories:

1. **Default**: Shows the component with minimal required props
2. **All Variants**: If the component has variants (size, color, type), show each one
3. **All States**: Show disabled, loading, error, and other states
4. **Accessibility**: Demonstrate proper accessibility features

### Story Naming Conventions

- Use PascalCase for story names: `Default`, `Primary`, `WithIcon`
- Be descriptive but concise: `LoadingWithText` instead of `Loading1`
- Group related stories with prefixes: `SmallPrimary`, `LargePrimary`

### Control Configuration

Configure controls for all public props:

```typescript
argTypes: {
  // Text inputs
  label: {
    control: { type: 'text' },
    description: 'Label text for the component',
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

  // Color picker
  color: {
    control: { type: 'color' },
    description: 'Custom color for the component',
  },

  // Range slider
  opacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.1 },
    description: 'Opacity level',
  },

  // Event handlers
  onClick: { action: 'clicked' },
  onSubmit: { action: 'submitted' },
}
```

### Layout Parameters

Choose appropriate layout for your component:

- `centered`: For small components (buttons, badges, icons)
- `padded`: For medium components that need some space
- `fullscreen`: For large components (modals, pages, complex layouts)

### Documentation Standards

#### Component Description

Provide a clear, concise description:

```typescript
docs: {
  description: {
    component: 'A versatile button component built with DaisyUI styling with multiple variants, sizes, and states. Supports icons, loading states, and full accessibility.',
  },
},
```

#### Story Descriptions

Add descriptions for complex stories:

```typescript
parameters: {
  docs: {
    description: {
      story: 'This story demonstrates how the component behaves with different prop combinations.',
    },
  },
},
```

### Accessibility Requirements

Every story should demonstrate accessibility features:

1. **Keyboard Navigation**: Show how the component works with keyboard
2. **Screen Reader Support**: Include proper ARIA labels and descriptions
3. **Focus Management**: Demonstrate focus states and management
4. **Color Contrast**: Ensure all variants meet WCAG guidelines

Example accessibility story:

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
        story: 'Demonstrates proper accessibility attributes and screen reader support.',
      },
    },
  },
};
```

### TypeScript Best Practices

1. **Use satisfies**: Use `satisfies Meta<typeof Component>` for better type checking
2. **Type Story Objects**: Always type your stories as `Story = StoryObj<typeof meta>`
3. **Prop Types**: Ensure all props are properly typed in the component interface
4. **Generic Components**: For generic components, provide proper type parameters

### Testing Considerations

Stories should support:

1. **Visual Regression Testing**: Create comprehensive visual states
2. **Interaction Testing**: Use `@storybook/test` for user interactions
3. **Accessibility Testing**: Include a11y addon testing
4. **Responsive Testing**: Test different viewport sizes

### Performance Guidelines

1. **Lazy Loading**: Use dynamic imports for heavy components
2. **Mock Data**: Use realistic but lightweight mock data
3. **Avoid Heavy Computations**: Keep story render functions lightweight
4. **Optimize Images**: Use optimized images in stories

### Common Patterns

#### Form Components

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

#### Error States

```typescript
export const WithError: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required',
  },
};
```

#### Loading States

```typescript
export const Loading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Please wait...',
  },
};
```

### File Organization

- Place stories in `src/stories/` directory
- Name files as `ComponentName.stories.tsx`
- Keep one component per story file
- Group related components in subdirectories if needed

### Common Mistakes to Avoid

1. **Missing Default Story**: Every component needs a Default story
2. **No Controls**: Always configure argTypes for interactive props
3. **Poor Descriptions**: Provide meaningful component and story descriptions
4. **Missing States**: Don't forget disabled, loading, and error states
5. **No Accessibility**: Always consider and test accessibility
6. **Hardcoded Values**: Use controls instead of hardcoded prop values
7. **Complex Render Functions**: Keep story render functions simple and focused

### Review Checklist

Before submitting a story, ensure:

- [ ] Default story exists and works
- [ ] All variants are covered
- [ ] All states (disabled, loading, error) are shown
- [ ] Controls are configured for all interactive props
- [ ] Component description is clear and helpful
- [ ] Accessibility is demonstrated
- [ ] TypeScript types are correct
- [ ] Story names follow conventions
- [ ] No console errors or warnings
- [ ] Visual regression tests pass

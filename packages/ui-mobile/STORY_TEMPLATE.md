# Mobile Component Story Template & Guidelines

This document provides templates and guidelines for creating Storybook stories for React Native components in the ui-mobile package.

## Quick Start Template

Use this template for creating new mobile component stories:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// TODO: Replace with actual component import
// import { ComponentName } from '../components/ComponentName';

// TODO: Define your component's prop interface
interface ComponentNameProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  accessibilityLabel?: string;
}

// TODO: Create web-compatible version of your React Native component
const ComponentName: React.FC<ComponentNameProps> = ({
  title = 'Component',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  leftIcon,
  rightIcon,
  accessibilityLabel,
}) => {
  // Web-compatible styling that mimics React Native appearance
  const baseStyles: React.CSSProperties = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    border: 'none',
    borderRadius: 8,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s ease-in-out',
  };

  // Add variant, size, and state-specific styles
  const variantStyles = {
    primary: { backgroundColor: '#007AFF', color: '#FFFFFF' },
    secondary: { backgroundColor: '#5856D6', color: '#FFFFFF' },
    outline: { backgroundColor: 'transparent', color: '#007AFF', border: '1px solid #007AFF' },
  };

  const sizeStyles = {
    small: { padding: '8px 12px', fontSize: 14 },
    medium: { padding: '12px 16px', fontSize: 16 },
    large: { padding: '16px 20px', fontSize: 18 },
  };

  const handleClick = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={accessibilityLabel || title}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {loading ? 'Loading...' : title}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description of the mobile component and its use cases (web preview for development)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Text content to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Component' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual variant of the component',
      table: {
        type: { summary: 'primary | secondary | outline' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the component',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the component is in loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', '←', '→', '+', '−', '✓', '✕', '⚙', '🏠', '👤'],
      description: 'Icon to display on the left',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', '←', '→', '+', '−', '✓', '✕', '⚙', '🏠', '👤'],
      description: 'Icon to display on the right',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onPress: { 
      action: 'pressed',
      description: 'Function called when component is pressed',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Required: Default story
export const Default: Story = {
  args: {
    title: 'Default Component',
    onPress: () => console.log('Component pressed'),
  },
};

// Variant stories
export const Primary: Story = {
  args: {
    title: 'Primary',
    variant: 'primary',
    onPress: () => console.log('Primary pressed'),
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary',
    variant: 'secondary',
    onPress: () => console.log('Secondary pressed'),
  },
};

export const Outline: Story = {
  args: {
    title: 'Outline',
    variant: 'outline',
    onPress: () => console.log('Outline pressed'),
  },
};

// Size stories
export const Small: Story = {
  args: {
    title: 'Small',
    size: 'small',
    onPress: () => console.log('Small pressed'),
  },
};

export const Medium: Story = {
  args: {
    title: 'Medium',
    size: 'medium',
    onPress: () => console.log('Medium pressed'),
  },
};

export const Large: Story = {
  args: {
    title: 'Large',
    size: 'large',
    onPress: () => console.log('Large pressed'),
  },
};

// State stories
export const Disabled: Story = {
  args: {
    title: 'Disabled',
    disabled: true,
    onPress: () => console.log('This should not be called'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading',
    loading: true,
    onPress: () => console.log('Loading pressed'),
  },
};

// Icon stories
export const WithLeftIcon: Story = {
  args: {
    title: 'With Icon',
    leftIcon: '+',
    onPress: () => console.log('Icon button pressed'),
  },
};

export const WithRightIcon: Story = {
  args: {
    title: 'Next',
    rightIcon: '→',
    onPress: () => console.log('Next pressed'),
  },
};

// Composition story
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <ComponentName title="Primary" variant="primary" onPress={() => {}} />
        <ComponentName title="Secondary" variant="secondary" onPress={() => {}} />
        <ComponentName title="Outline" variant="outline" onPress={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <ComponentName title="Small" size="small" onPress={() => {}} />
        <ComponentName title="Medium" size="medium" onPress={() => {}} />
        <ComponentName title="Large" size="large" onPress={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <ComponentName title="Disabled" disabled onPress={() => {}} />
        <ComponentName title="Loading" loading onPress={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all component variants, sizes, and states'
      }
    }
  },
};

// Interactive story
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handlePress = async () => {
      setLoading(true);
      setTimeout(() => {
        setCount(prev => prev + 1);
        setLoading(false);
      }, 1000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Count: {count}</div>
        <ComponentName 
          title={loading ? 'Processing...' : 'Increment'}
          loading={loading}
          onPress={handlePress}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example demonstrating component behavior and state management'
      }
    }
  },
};

// Accessibility story
export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Component',
    accessibilityLabel: 'This is an accessible component for screen readers',
    onPress: () => console.log('Accessible component pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates proper accessibility attributes for mobile screen readers'
      }
    }
  },
};
```

## Mobile-Specific Guidelines

### React Native to Web Conversion

Since Storybook runs in a web environment, you need to create web-compatible versions of your React Native components:

1. **Replace React Native imports** with web equivalents:
   ```typescript
   // Instead of:
   import { View, Text, TouchableOpacity } from 'react-native';
   
   // Use:
   import React from 'react';
   // Create web-compatible versions using HTML elements
   ```

2. **Convert StyleSheet to CSS-in-JS**:
   ```typescript
   // Instead of:
   const styles = StyleSheet.create({
     button: { backgroundColor: '#007AFF', padding: 10 }
   });
   
   // Use:
   const buttonStyle: React.CSSProperties = {
     backgroundColor: '#007AFF',
     padding: 10
   };
   ```

3. **Map React Native props to web equivalents**:
   ```typescript
   // onPress -> onClick
   // accessibilityLabel -> aria-label
   // testID -> data-testid
   ```

### Mobile UI Patterns

Focus on mobile-specific patterns in your stories:

1. **Touch Interactions**: Show how components respond to touch
2. **Mobile Layouts**: Demonstrate responsive mobile layouts
3. **Gesture Support**: If applicable, show gesture interactions
4. **Mobile States**: Loading, offline, error states common in mobile apps

### Icon Handling

For mobile components with icons:

```typescript
// Create a simple icon mapping for web preview
const iconMap: Record<string, string> = {
  'add': '+',
  'remove': '−',
  'edit': '✎',
  'delete': '🗑',
  'save': '💾',
  'search': '🔍',
  'settings': '⚙',
  'home': '🏠',
  'user': '👤',
  'heart': '♥',
  'star': '★',
  'check': '✓',
  'close': '✕',
  'arrow-forward': '→',
  'arrow-back': '←',
};

const renderIcon = (iconName: string) => (
  <span>{iconMap[iconName] || iconName}</span>
);
```

### Theme Integration

Ensure your stories work with the mobile theme system:

```typescript
// Use theme colors that match your React Native theme
const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  light: '#F2F2F7',
  medium: '#8E8E93',
  white: '#FFFFFF',
};
```

### Required Stories for Mobile Components

Every mobile component should have:

1. **Default**: Basic component state
2. **All Variants**: Different visual styles
3. **All Sizes**: Small, medium, large if applicable
4. **Touch States**: Normal, pressed, disabled
5. **Loading States**: If the component can be in loading state
6. **Icon Variations**: With and without icons
7. **Accessibility**: Proper screen reader support
8. **Mobile Layout**: How it behaves in mobile containers

### Control Configuration for Mobile

Configure controls appropriate for mobile components:

```typescript
argTypes: {
  // Touch event handlers
  onPress: { action: 'pressed' },
  onLongPress: { action: 'long-pressed' },
  
  // Mobile-specific props
  hapticFeedback: {
    control: { type: 'boolean' },
    description: 'Whether to provide haptic feedback on press',
  },
  
  // Icon selection
  iconName: {
    control: { type: 'select' },
    options: ['add', 'remove', 'edit', 'delete', 'save', 'search'],
    description: 'Icon to display',
  },
  
  // Mobile sizes
  size: {
    control: { type: 'select' },
    options: ['small', 'medium', 'large'],
    description: 'Component size optimized for mobile touch targets',
  },
}
```

### Accessibility for Mobile

Mobile accessibility considerations:

1. **Touch Target Size**: Ensure minimum 44px touch targets
2. **Screen Reader Support**: Use proper accessibility labels
3. **Voice Control**: Support voice navigation
4. **High Contrast**: Test with high contrast modes

```typescript
export const AccessibilityDemo: Story = {
  args: {
    accessibilityLabel: 'Add new todo item',
    accessibilityHint: 'Double tap to add a new todo item to your list',
    accessibilityRole: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates mobile accessibility features including VoiceOver support'
      }
    }
  },
};
```

### Performance Considerations

1. **Lightweight Stories**: Keep story render functions simple
2. **Mock Heavy Operations**: Mock network calls and heavy computations
3. **Optimize Images**: Use optimized images for mobile contexts
4. **Lazy Loading**: Use dynamic imports for heavy components

### Testing Mobile Components

Stories should support:

1. **Visual Regression**: Test component appearance
2. **Interaction Testing**: Test touch interactions
3. **Accessibility Testing**: Test screen reader support
4. **Responsive Testing**: Test different mobile screen sizes

### Common Mobile Patterns

#### Form Input Components
```typescript
export const FormExample: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <div style={{ width: '300px', padding: '16px' }}>
        <ComponentName 
          value={value}
          onChangeText={setValue}
          placeholder="Enter text here"
          label="Mobile Input"
        />
      </div>
    );
  },
};
```

#### List Item Components
```typescript
export const ListExample: Story = {
  render: () => (
    <div style={{ width: '300px', backgroundColor: '#f5f5f5' }}>
      <ComponentName title="First Item" onPress={() => {}} />
      <ComponentName title="Second Item" onPress={() => {}} />
      <ComponentName title="Third Item" onPress={() => {}} />
    </div>
  ),
};
```

### File Organization

- Place stories in `src/stories/` directory
- Name files as `ComponentName.stories.tsx`
- Keep mobile-specific naming conventions
- Group related mobile components together

### Review Checklist for Mobile Stories

Before submitting a mobile component story:

- [ ] Web-compatible version works correctly
- [ ] All mobile variants are covered
- [ ] Touch interactions are demonstrated
- [ ] Accessibility labels are included
- [ ] Mobile-appropriate sizing is used
- [ ] Icons render correctly in web preview
- [ ] Loading states are shown
- [ ] Component works in mobile-sized containers
- [ ] TypeScript types are correct
- [ ] No console errors in Storybook
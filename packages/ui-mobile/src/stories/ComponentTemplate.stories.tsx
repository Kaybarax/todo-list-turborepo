import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// TODO: Replace with actual component import
// import { ComponentName } from '../components/ComponentName';

// TODO: Define your component's prop interface based on React Native component
interface ComponentNameProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  rounded?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// TODO: Remove this mock component and import the real React Native component
// This is a web-compatible version for Storybook preview
const ComponentName: React.FC<ComponentNameProps> = ({
  title = 'Component',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  // Theme colors matching React Native theme
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

  const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  };

  const fontSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const borderRadius = {
    md: 8,
    round: 9999,
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.white,
      borderColor: colors.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      borderColor: colors.primary,
    },
    danger: {
      backgroundColor: colors.danger,
      color: colors.white,
      borderColor: colors.danger,
    },
    success: {
      backgroundColor: colors.success,
      color: colors.white,
      borderColor: colors.success,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary,
      borderColor: 'transparent',
    },
  };

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      fontSize: fontSizes.sm,
      minWidth: 80,
      minHeight: 32,
    },
    medium: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      fontSize: fontSizes.md,
      minWidth: 120,
      minHeight: 40,
    },
    large: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontSize: fontSizes.lg,
      minWidth: 160,
      minHeight: 48,
    },
  };

  // Icon mapping for web preview
  const iconMap: Record<string, string> = {
    add: '+',
    remove: '−',
    edit: '✎',
    delete: '🗑',
    save: '💾',
    search: '🔍',
    settings: '⚙',
    home: '🏠',
    user: '👤',
    heart: '♥',
    star: '★',
    check: '✓',
    close: '✕',
    'arrow-forward': '→',
    'arrow-back': '←',
    download: '⬇',
    upload: '⬆',
  };

  const renderIcon = (iconName: string) => (
    <span style={{ fontSize: sizeStyles[size].fontSize }}>{iconMap[iconName] || iconName}</span>
  );

  const buttonStyle: React.CSSProperties = {
    borderRadius: rounded ? borderRadius.round : borderRadius.md,
    paddingTop: sizeStyles[size].paddingVertical,
    paddingBottom: sizeStyles[size].paddingVertical,
    paddingLeft: sizeStyles[size].paddingHorizontal,
    paddingRight: sizeStyles[size].paddingHorizontal,
    minWidth: sizeStyles[size].minWidth,
    minHeight: sizeStyles[size].minHeight,
    width: fullWidth ? '100%' : 'auto',
    backgroundColor: disabled ? colors.medium : variantStyles[variant].backgroundColor,
    color: disabled ? colors.light : variantStyles[variant].color,
    border: `1px solid ${disabled ? colors.medium : variantStyles[variant].borderColor}`,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: sizeStyles[size].fontSize,
    fontWeight: '500',
    textAlign: 'center',
    textDecoration: 'none',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    gap: spacing.xs,
  };

  const handleClick = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={accessibilityLabel || title}
      title={accessibilityHint}
      data-testid={testID}
      type="button"
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            border: `2px solid ${variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        <>
          {leftIcon && renderIcon(leftIcon)}
          {title}
          {rightIcon && renderIcon(rightIcon)}
        </>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

const meta: Meta<typeof ComponentName> = {
  title: 'Templates/MobileComponentTemplate',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is a template for creating mobile component stories. Replace ComponentName with your actual React Native component and update all props and stories accordingly. This web version mimics the mobile component appearance for development purposes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Text content to display on the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Component' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost'],
      description: 'Visual variant of the component',
      table: {
        type: { summary: 'primary | secondary | outline | danger | success | ghost' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the component (optimized for mobile touch targets)',
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
      options: [
        '',
        'add',
        'remove',
        'edit',
        'delete',
        'save',
        'search',
        'settings',
        'home',
        'user',
        'heart',
        'star',
        'check',
        'close',
        'arrow-forward',
        'arrow-back',
        'download',
        'upload',
      ],
      description: 'Icon to display on the left side',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    rightIcon: {
      control: { type: 'select' },
      options: [
        '',
        'add',
        'remove',
        'edit',
        'delete',
        'save',
        'search',
        'settings',
        'home',
        'user',
        'heart',
        'star',
        'check',
        'close',
        'arrow-forward',
        'arrow-back',
        'download',
        'upload',
      ],
      description: 'Icon to display on the right side',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the component should take full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rounded: {
      control: { type: 'boolean' },
      description: 'Whether the component should have fully rounded corners',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    accessibilityHint: {
      control: { type: 'text' },
      description: 'Accessibility hint describing what happens when the component is activated',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    testID: {
      control: { type: 'text' },
      description: 'Test identifier for automated testing',
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

// Required: Default story showing the component in its most basic state
export const Default: Story = {
  args: {
    title: 'Default Component',
    onPress: () => console.log('Component pressed'),
  },
};

// Variant stories - show each visual variant
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

export const Danger: Story = {
  args: {
    title: 'Danger',
    variant: 'danger',
    onPress: () => console.log('Danger pressed'),
  },
};

export const Success: Story = {
  args: {
    title: 'Success',
    variant: 'success',
    onPress: () => console.log('Success pressed'),
  },
};

export const Ghost: Story = {
  args: {
    title: 'Ghost',
    variant: 'ghost',
    onPress: () => console.log('Ghost pressed'),
  },
};

// Size stories - show each size option
export const Small: Story = {
  args: {
    title: 'Small',
    size: 'small',
    variant: 'primary',
    onPress: () => console.log('Small pressed'),
  },
};

export const Medium: Story = {
  args: {
    title: 'Medium',
    size: 'medium',
    variant: 'primary',
    onPress: () => console.log('Medium pressed'),
  },
};

export const Large: Story = {
  args: {
    title: 'Large',
    size: 'large',
    variant: 'primary',
    onPress: () => console.log('Large pressed'),
  },
};

// State stories - show different component states
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

export const LoadingOutline: Story = {
  args: {
    title: 'Loading Outline',
    loading: true,
    variant: 'outline',
    onPress: () => console.log('Loading outline pressed'),
  },
};

// Icon stories - show icon usage
export const WithLeftIcon: Story = {
  args: {
    title: 'Add Item',
    leftIcon: 'add',
    variant: 'primary',
    onPress: () => console.log('Add button pressed'),
  },
};

export const WithRightIcon: Story = {
  args: {
    title: 'Next',
    rightIcon: 'arrow-forward',
    variant: 'primary',
    onPress: () => console.log('Next pressed'),
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Save',
    leftIcon: 'save',
    rightIcon: 'check',
    variant: 'success',
    onPress: () => console.log('Save pressed'),
  },
};

export const IconOnly: Story = {
  args: {
    title: '',
    leftIcon: 'heart',
    variant: 'ghost',
    size: 'small',
    accessibilityLabel: 'Like this item',
    onPress: () => console.log('Heart pressed'),
  },
};

// Layout stories - show layout options
export const FullWidth: Story = {
  args: {
    title: 'Full Width Component',
    fullWidth: true,
    variant: 'primary',
    onPress: () => console.log('Full width pressed'),
  },
  parameters: {
    layout: 'padded',
  },
};

export const Rounded: Story = {
  args: {
    title: 'Rounded',
    rounded: true,
    variant: 'primary',
    onPress: () => console.log('Rounded pressed'),
  },
};

export const RoundedFullWidth: Story = {
  args: {
    title: 'Rounded Full Width',
    rounded: true,
    fullWidth: true,
    variant: 'success',
    onPress: () => console.log('Rounded full width pressed'),
  },
  parameters: {
    layout: 'padded',
  },
};

// Composition story - show multiple variants together
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', maxWidth: '320px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <ComponentName title="Primary" variant="primary" onPress={() => {}} />
        <ComponentName title="Secondary" variant="secondary" onPress={() => {}} />
        <ComponentName title="Outline" variant="outline" onPress={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <ComponentName title="Danger" variant="danger" onPress={() => {}} />
        <ComponentName title="Success" variant="success" onPress={() => {}} />
        <ComponentName title="Ghost" variant="ghost" onPress={() => {}} />
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
        story: 'Visual comparison showing all component variants, sizes, and states in a mobile-optimized layout.',
      },
    },
  },
};

// Interactive story - demonstrate component behavior
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleIncrement = async () => {
      setLoading(true);
      // Simulate async operation
      setTimeout(() => {
        setCount(prev => prev + 1);
        setLoading(false);
      }, 1000);
    };

    const handleReset = () => {
      setCount(0);
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          padding: '16px',
          maxWidth: '300px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ComponentName
            title="+"
            size="small"
            variant="primary"
            loading={loading}
            onPress={handleIncrement}
            accessibilityLabel="Increment counter"
          />
          <ComponentName
            title="Reset"
            size="small"
            variant="outline"
            disabled={count === 0}
            onPress={handleReset}
            accessibilityLabel="Reset counter to zero"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example demonstrating component behavior, state management, and mobile-style layout.',
      },
    },
  },
};

// Accessibility story - demonstrate accessibility features
export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Component',
    accessibilityLabel: 'This is an accessible component',
    accessibilityHint: 'Double tap to activate this component',
    testID: 'accessible-component',
    onPress: () => console.log('Accessible component pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates proper accessibility attributes for mobile screen readers and automated testing.',
      },
    },
  },
};

// Mobile usage patterns
export const MobileFormActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        maxWidth: '300px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <ComponentName
        title="Save Changes"
        leftIcon="save"
        variant="primary"
        fullWidth
        onPress={() => console.log('Save pressed')}
      />
      <ComponentName title="Cancel" variant="outline" fullWidth onPress={() => console.log('Cancel pressed')} />
      <ComponentName
        title="Delete"
        leftIcon="delete"
        variant="danger"
        fullWidth
        onPress={() => console.log('Delete pressed')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common mobile form action pattern with full-width buttons in a card layout.',
      },
    },
  },
};

export const MobileListActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '300px',
      }}
    >
      <span style={{ flex: 1, fontSize: '16px' }}>Todo Item</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <ComponentName
          title=""
          leftIcon="edit"
          size="small"
          variant="ghost"
          accessibilityLabel="Edit item"
          onPress={() => console.log('Edit pressed')}
        />
        <ComponentName
          title=""
          leftIcon="check"
          size="small"
          variant="success"
          accessibilityLabel="Mark as complete"
          onPress={() => console.log('Complete pressed')}
        />
        <ComponentName
          title=""
          leftIcon="delete"
          size="small"
          variant="danger"
          accessibilityLabel="Delete item"
          onPress={() => console.log('Delete pressed')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile list item with inline action buttons, common in todo and task management apps.',
      },
    },
  },
};

// Responsive mobile story
export const MobileResponsive: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '375px', padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <ComponentName title="Full Width" fullWidth variant="primary" onPress={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <ComponentName title="Half" variant="outline" style={{ flex: 1 }} onPress={() => {}} />
        <ComponentName title="Half" variant="outline" style={{ flex: 1 }} onPress={() => {}} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <ComponentName title="1/3" variant="secondary" style={{ flex: 1 }} onPress={() => {}} />
        <ComponentName title="1/3" variant="secondary" style={{ flex: 1 }} onPress={() => {}} />
        <ComponentName title="1/3" variant="secondary" style={{ flex: 1 }} onPress={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive behavior in mobile-sized containers.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

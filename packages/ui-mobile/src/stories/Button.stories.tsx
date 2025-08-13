import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Button component for Storybook
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  fullWidth?: boolean;
  rounded?: boolean;
  accessibilityLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  iconColor,
  fullWidth = false,
  rounded = false,
  accessibilityLabel,
}) => {
  // Theme colors matching the React Native theme
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
      iconSize: 16,
    },
    medium: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      fontSize: fontSizes.md,
      minWidth: 120,
      iconSize: 20,
    },
    large: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontSize: fontSizes.lg,
      minWidth: 160,
      iconSize: 24,
    },
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white;
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: rounded ? borderRadius.round : borderRadius.md,
    paddingTop: sizeStyles[size].paddingVertical,
    paddingBottom: sizeStyles[size].paddingVertical,
    paddingLeft: sizeStyles[size].paddingHorizontal,
    paddingRight: sizeStyles[size].paddingHorizontal,
    minWidth: sizeStyles[size].minWidth,
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
    if (!disabled && !loading) {
      onPress();
    }
  };

  const renderIcon = (iconName: string, position: 'left' | 'right') => {
    // Simple icon representation for web preview
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
      'download': '⬇',
      'upload': '⬆',
    };

    return (
      <span 
        style={{ 
          color: getIconColor(),
          fontSize: sizeStyles[size].iconSize,
          lineHeight: 1,
        }}
      >
        {iconMap[iconName] || iconName}
      </span>
    );
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={accessibilityLabel || title}
      type="button"
    >
      {loading ? (
        <span style={{ 
          display: 'inline-block',
          width: sizeStyles[size].iconSize,
          height: sizeStyles[size].iconSize,
          border: `2px solid ${variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}`,
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      ) : (
        <>
          {leftIcon && renderIcon(leftIcon, 'left')}
          {title}
          {rightIcon && renderIcon(rightIcon, 'right')}
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

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, states, and icon support for mobile interfaces (web preview)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Text content to display on the button',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', 'add', 'remove', 'edit', 'delete', 'save', 'search', 'settings', 'home', 'user', 'heart', 'star', 'check', 'close', 'arrow-forward', 'arrow-back', 'download', 'upload'],
      description: 'Icon to display on the left side of the button',
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', 'add', 'remove', 'edit', 'delete', 'save', 'search', 'settings', 'home', 'user', 'heart', 'star', 'check', 'close', 'arrow-forward', 'arrow-back', 'download', 'upload'],
      description: 'Icon to display on the right side of the button',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button should take full width',
    },
    rounded: {
      control: { type: 'boolean' },
      description: 'Whether the button should have rounded corners',
    },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    title: 'Button',
    onPress: () => console.log('Button pressed'),
  },
};

// Variant stories
export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
    onPress: () => console.log('Primary button pressed'),
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
    onPress: () => console.log('Secondary button pressed'),
  },
};

export const Outline: Story = {
  args: {
    title: 'Outline Button',
    variant: 'outline',
    onPress: () => console.log('Outline button pressed'),
  },
};

export const Danger: Story = {
  args: {
    title: 'Danger Button',
    variant: 'danger',
    onPress: () => console.log('Danger button pressed'),
  },
};

export const Success: Story = {
  args: {
    title: 'Success Button',
    variant: 'success',
    onPress: () => console.log('Success button pressed'),
  },
};

export const Ghost: Story = {
  args: {
    title: 'Ghost Button',
    variant: 'ghost',
    onPress: () => console.log('Ghost button pressed'),
  },
};

// Size stories
export const Small: Story = {
  args: {
    title: 'Small Button',
    size: 'small',
    variant: 'primary',
    onPress: () => console.log('Small button pressed'),
  },
};

export const Medium: Story = {
  args: {
    title: 'Medium Button',
    size: 'medium',
    variant: 'primary',
    onPress: () => console.log('Medium button pressed'),
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
    variant: 'primary',
    onPress: () => console.log('Large button pressed'),
  },
};

// State stories
export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    disabled: true,
    onPress: () => console.log('This should not be called'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
    onPress: () => console.log('Loading button pressed'),
  },
};

export const LoadingOutline: Story = {
  args: {
    title: 'Loading Outline',
    loading: true,
    variant: 'outline',
    onPress: () => console.log('Loading outline button pressed'),
  },
};

// Icon stories
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
    onPress: () => console.log('Next button pressed'),
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Save',
    leftIcon: 'save',
    rightIcon: 'check',
    variant: 'success',
    onPress: () => console.log('Save button pressed'),
  },
};

export const IconOnly: Story = {
  args: {
    title: '',
    leftIcon: 'heart',
    variant: 'ghost',
    size: 'small',
    onPress: () => console.log('Heart button pressed'),
  },
};

// Layout stories
export const FullWidth: Story = {
  args: {
    title: 'Full Width Button',
    fullWidth: true,
    variant: 'primary',
    onPress: () => console.log('Full width button pressed'),
  },
  parameters: {
    layout: 'padded',
  },
};

export const Rounded: Story = {
  args: {
    title: 'Rounded Button',
    rounded: true,
    variant: 'primary',
    onPress: () => console.log('Rounded button pressed'),
  },
};

export const RoundedFullWidth: Story = {
  args: {
    title: 'Rounded Full Width',
    rounded: true,
    fullWidth: true,
    variant: 'success',
    onPress: () => console.log('Rounded full width button pressed'),
  },
  parameters: {
    layout: 'padded',
  },
};

// Combined variant and size examples
export const SmallVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Primary" variant="primary" size="small" onPress={() => {}} />
      <Button title="Secondary" variant="secondary" size="small" onPress={() => {}} />
      <Button title="Outline" variant="outline" size="small" onPress={() => {}} />
      <Button title="Danger" variant="danger" size="small" onPress={() => {}} />
      <Button title="Success" variant="success" size="small" onPress={() => {}} />
      <Button title="Ghost" variant="ghost" size="small" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in small size'
      }
    }
  },
};

export const MediumVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Primary" variant="primary" size="medium" onPress={() => {}} />
      <Button title="Secondary" variant="secondary" size="medium" onPress={() => {}} />
      <Button title="Outline" variant="outline" size="medium" onPress={() => {}} />
      <Button title="Danger" variant="danger" size="medium" onPress={() => {}} />
      <Button title="Success" variant="success" size="medium" onPress={() => {}} />
      <Button title="Ghost" variant="ghost" size="medium" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in medium size'
      }
    }
  },
};

export const LargeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Primary" variant="primary" size="large" onPress={() => {}} />
      <Button title="Secondary" variant="secondary" size="large" onPress={() => {}} />
      <Button title="Outline" variant="outline" size="large" onPress={() => {}} />
      <Button title="Danger" variant="danger" size="large" onPress={() => {}} />
      <Button title="Success" variant="success" size="large" onPress={() => {}} />
      <Button title="Ghost" variant="ghost" size="large" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in large size'
      }
    }
  },
};

// State combinations
export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Primary" variant="primary" disabled onPress={() => {}} />
      <Button title="Secondary" variant="secondary" disabled onPress={() => {}} />
      <Button title="Outline" variant="outline" disabled onPress={() => {}} />
      <Button title="Danger" variant="danger" disabled onPress={() => {}} />
      <Button title="Success" variant="success" disabled onPress={() => {}} />
      <Button title="Ghost" variant="ghost" disabled onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in disabled state'
      }
    }
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Primary" variant="primary" loading onPress={() => {}} />
      <Button title="Secondary" variant="secondary" loading onPress={() => {}} />
      <Button title="Outline" variant="outline" loading onPress={() => {}} />
      <Button title="Danger" variant="danger" loading onPress={() => {}} />
      <Button title="Success" variant="success" loading onPress={() => {}} />
      <Button title="Ghost" variant="ghost" loading onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in loading state'
      }
    }
  },
};

// Real-world usage examples
export const TodoActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Add Todo" leftIcon="add" variant="primary" onPress={() => {}} />
      <Button title="Edit" leftIcon="edit" variant="outline" size="small" onPress={() => {}} />
      <Button title="Delete" leftIcon="delete" variant="danger" size="small" onPress={() => {}} />
      <Button title="Complete" leftIcon="check" variant="success" size="small" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button usage for todo item actions'
      }
    }
  },
};

export const FormActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Save" leftIcon="save" variant="success" onPress={() => {}} />
      <Button title="Cancel" variant="outline" onPress={() => {}} />
      <Button title="Reset" variant="ghost" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button usage for form actions'
      }
    }
  },
};

export const NavigationActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button title="Back" leftIcon="arrow-back" variant="ghost" onPress={() => {}} />
      <Button title="Next" rightIcon="arrow-forward" variant="primary" onPress={() => {}} />
      <Button title="Home" leftIcon="home" variant="outline" onPress={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button usage for navigation actions'
      }
    }
  },
};

// Accessibility examples
export const AccessibilityExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button 
        title="❤️" 
        variant="ghost" 
        size="small" 
        accessibilityLabel="Like this item"
        onPress={() => {}} 
      />
      <Button 
        title="⭐" 
        variant="ghost" 
        size="small" 
        accessibilityLabel="Add to favorites"
        onPress={() => {}} 
      />
      <Button 
        title="🔍" 
        variant="outline" 
        size="small" 
        accessibilityLabel="Search for items"
        onPress={() => {}} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with proper accessibility labels for screen readers'
      }
    }
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleIncrement = () => {
      setCount(prev => prev + 1);
    };

    const handleDecrement = () => {
      setCount(prev => Math.max(0, prev - 1));
    };

    const handleReset = async () => {
      setLoading(true);
      // Simulate async operation
      setTimeout(() => {
        setCount(0);
        setLoading(false);
      }, 1000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button 
            title="−" 
            variant="outline" 
            size="small" 
            disabled={count === 0}
            onPress={handleDecrement} 
          />
          <Button 
            title="+" 
            variant="primary" 
            size="small" 
            onPress={handleIncrement} 
          />
          <Button 
            title="Reset" 
            variant="danger" 
            size="small" 
            loading={loading}
            onPress={handleReset} 
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing button states and user interactions'
      }
    }
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Button component for Storybook
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = false,
  leftIcon,
  rightIcon,
}) => {
  const baseStyles = {
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    borderRadius: rounded ? '9999px' : '12px',
  };

  const variantStyles = {
    primary: { backgroundColor: '#007AFF', color: '#FFFFFF' },
    secondary: { backgroundColor: '#5856D6', color: '#FFFFFF' },
    outline: { backgroundColor: 'transparent', color: '#007AFF', border: '1px solid #007AFF' },
    danger: { backgroundColor: '#FF3B30', color: '#FFFFFF' },
    success: { backgroundColor: '#34C759', color: '#FFFFFF' },
    ghost: { backgroundColor: 'transparent', color: '#007AFF' },
  };

  const sizeStyles = {
    small: { padding: '4px 16px', fontSize: '14px', minWidth: '80px' },
    medium: { padding: '8px 24px', fontSize: '16px', minWidth: '120px' },
    large: { padding: '16px 32px', fontSize: '18px', minWidth: '160px' },
  };

  const buttonStyle = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <button
      style={buttonStyle}
      onClick={onPress}
      disabled={disabled || loading}
    >
      {leftIcon && <span>🔹</span>}
      {loading ? 'Loading...' : title}
      {rightIcon && <span>▶️</span>}
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
        component: 'A customizable button component for mobile interfaces (web preview)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    rounded: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Button',
    onPress: () => console.log('Button pressed'),
  },
};

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

export const Small: Story = {
  args: {
    title: 'Small Button',
    size: 'small',
    onPress: () => console.log('Small button pressed'),
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
    onPress: () => console.log('Large button pressed'),
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    disabled: true,
    onPress: () => console.log('This should not fire'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
    onPress: () => console.log('Loading button pressed'),
  },
};

export const FullWidth: Story = {
  args: {
    title: 'Full Width Button',
    fullWidth: true,
    onPress: () => console.log('Full width button pressed'),
  },
};

export const Rounded: Story = {
  args: {
    title: 'Rounded Button',
    rounded: true,
    onPress: () => console.log('Rounded button pressed'),
  },
};

export const WithLeftIcon: Story = {
  args: {
    title: 'With Icon',
    leftIcon: 'add',
    onPress: () => console.log('Button with icon pressed'),
  },
};

export const WithRightIcon: Story = {
  args: {
    title: 'With Icon',
    rightIcon: 'arrow-forward',
    onPress: () => console.log('Button with right icon pressed'),
  },
};
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { buildMobileMeta } from './helpers/storyMeta';

// Web-compatible Button component for Storybook (does not rely on React Native or UI Kitten)
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface WebButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const WebButton: React.FC<WebButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  children,
}) => {
  const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    destructive: '#FF3B30',
    border: '#CECED2',
    text: '#1C1C1E',
    white: '#FFFFFF',
    transparent: 'transparent',
  };

  const paddings: Record<ButtonSize, { py: number; px: number; fontSize: number }> = {
    sm: { py: 6, px: 10, fontSize: 14 },
    md: { py: 8, px: 14, fontSize: 16 },
    lg: { py: 10, px: 18, fontSize: 18 },
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    userSelect: 'none',
    width: fullWidth ? '100%' : undefined,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
  };

  const { py, px, fontSize } = paddings[size];

  const stylesByVariant: Record<ButtonVariant, React.CSSProperties> = {
    primary: { backgroundColor: colors.primary, color: colors.white, borderColor: colors.primary },
    secondary: { backgroundColor: colors.white, color: colors.text, borderColor: colors.border },
    outline: { backgroundColor: colors.white, color: colors.text, borderColor: colors.border },
    ghost: { backgroundColor: colors.transparent, color: colors.text, borderColor: colors.transparent },
    link: { backgroundColor: colors.transparent, color: colors.primary, borderColor: colors.transparent },
    destructive: { backgroundColor: colors.destructive, color: colors.white, borderColor: colors.destructive },
  };

  const style: React.CSSProperties = {
    ...baseStyle,
    ...stylesByVariant[variant],
    padding: `${py}px ${px}px`,
    fontSize,
  };

  return (
    <button style={style} onClick={onPress} disabled={disabled}>
      {loading ? 'Loading…' : children}
    </button>
  );
};

const meta: Meta<typeof WebButton> = buildMobileMeta({
  title: 'Components/Button',
  component: WebButton,
  parameters: {
    docs: {
      description: {
        component:
          'A customizable button component with multiple variants, sizes, and states. Supports accessibility features and theme integration.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button takes full width of container',
    },
    onPress: { action: 'pressed' },
  },
});

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    size: 'md',
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={containerStyle}>
      <WebButton variant="primary" onPress={() => {}}>
        Primary
      </WebButton>
      <WebButton variant="secondary" onPress={() => {}}>
        Secondary
      </WebButton>
      <WebButton variant="outline" onPress={() => {}}>
        Outline
      </WebButton>
      <WebButton variant="ghost" onPress={() => {}}>
        Ghost
      </WebButton>
      <WebButton variant="link" onPress={() => {}}>
        Link
      </WebButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={containerStyle}>
      <WebButton variant="primary" size="sm" onPress={() => {}}>
        Small
      </WebButton>
      <WebButton variant="primary" size="md" onPress={() => {}}>
        Medium
      </WebButton>
      <WebButton variant="primary" size="lg" onPress={() => {}}>
        Large
      </WebButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 200,
  alignItems: 'flex-start',
};

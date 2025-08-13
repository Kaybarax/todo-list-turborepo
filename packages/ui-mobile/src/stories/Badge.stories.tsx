import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible Badge component for Storybook
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  testID?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'medium', testID }) => {
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
  };

  const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
  };

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: colors.light,
      color: colors.medium,
    },
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.white,
    },
    success: {
      backgroundColor: colors.success,
      color: colors.white,
    },
    warning: {
      backgroundColor: colors.warning,
      color: colors.white,
    },
    danger: {
      backgroundColor: colors.danger,
      color: colors.white,
    },
  };

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: spacing.xs / 2,
      fontSize: fontSizes.xs,
    },
    medium: {
      paddingVertical: spacing.xs,
      fontSize: fontSizes.sm,
    },
    large: {
      paddingVertical: spacing.sm,
      fontSize: fontSizes.md,
    },
  };

  const containerStyle: React.CSSProperties = {
    borderRadius: 9999, // round
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    paddingTop: sizeStyles[size].paddingVertical,
    paddingBottom: sizeStyles[size].paddingVertical,
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variantStyles[variant].backgroundColor,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const textStyle: React.CSSProperties = {
    fontSize: sizeStyles[size].fontSize,
    fontWeight: '500',
    color: variantStyles[variant].color,
    margin: 0,
    padding: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div style={containerStyle} data-testid={testID}>
      <span style={textStyle}>{text}</span>
    </div>
  );
};

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile badge component for displaying status, labels, or notifications with multiple variants and sizes (web preview)',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Text content to display in the badge',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Visual variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    text: 'Badge',
  },
};

// Variant stories
export const Primary: Story = {
  args: {
    text: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    text: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    text: 'Warning',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger',
    variant: 'danger',
  },
};

// Size stories
export const Small: Story = {
  args: {
    text: 'Small',
    size: 'small',
    variant: 'primary',
  },
};

export const Medium: Story = {
  args: {
    text: 'Medium',
    size: 'medium',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    text: 'Large',
    size: 'large',
    variant: 'primary',
  },
};

// Content type stories
export const ShortText: Story = {
  args: {
    text: 'New',
    variant: 'success',
  },
};

export const LongText: Story = {
  args: {
    text: 'Very Long Badge Text',
    variant: 'warning',
  },
};

export const NumberBadge: Story = {
  args: {
    text: '42',
    variant: 'danger',
    size: 'small',
  },
};

export const StatusBadge: Story = {
  args: {
    text: 'Active',
    variant: 'success',
  },
};

export const NotificationBadge: Story = {
  args: {
    text: '99+',
    variant: 'danger',
    size: 'small',
  },
};

// Combined variant and size examples
export const SmallVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="Default" variant="default" size="small" />
      <Badge text="Primary" variant="primary" size="small" />
      <Badge text="Secondary" variant="secondary" size="small" />
      <Badge text="Success" variant="success" size="small" />
      <Badge text="Warning" variant="warning" size="small" />
      <Badge text="Danger" variant="danger" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in small size',
      },
    },
  },
};

export const MediumVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="Default" variant="default" size="medium" />
      <Badge text="Primary" variant="primary" size="medium" />
      <Badge text="Secondary" variant="secondary" size="medium" />
      <Badge text="Success" variant="success" size="medium" />
      <Badge text="Warning" variant="warning" size="medium" />
      <Badge text="Danger" variant="danger" size="medium" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in medium size',
      },
    },
  },
};

export const LargeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="Default" variant="default" size="large" />
      <Badge text="Primary" variant="primary" size="large" />
      <Badge text="Secondary" variant="secondary" size="large" />
      <Badge text="Success" variant="success" size="large" />
      <Badge text="Warning" variant="warning" size="large" />
      <Badge text="Danger" variant="danger" size="large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in large size',
      },
    },
  },
};

// Real-world usage examples
export const TodoStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="Todo" variant="default" />
      <Badge text="In Progress" variant="warning" />
      <Badge text="Completed" variant="success" />
      <Badge text="Overdue" variant="danger" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for todo item status',
      },
    },
  },
};

export const UserRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="Admin" variant="danger" size="small" />
      <Badge text="Moderator" variant="warning" size="small" />
      <Badge text="User" variant="primary" size="small" />
      <Badge text="Guest" variant="default" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for user roles and permissions',
      },
    },
  },
};

export const NotificationCounts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge text="1" variant="danger" size="small" />
      <Badge text="5" variant="danger" size="small" />
      <Badge text="12" variant="danger" size="small" />
      <Badge text="99+" variant="danger" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for notification counts',
      },
    },
  },
};

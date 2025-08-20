import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge/Badge';
import { Check, AlertTriangle, Info as InfoIcon, X } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
      description: 'The visual style of the badge',
    },
    icon: {
      control: { disable: true },
      description: 'Icon to display in the badge',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Success',
    variant: 'success',
    icon: <Check className="h-3 w-3" />,
  },
};

export const AllVariantsWithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive" icon={<X className="h-3 w-3" />}>
        Destructive
      </Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" icon={<Check className="h-3 w-3" />}>
        Success
      </Badge>
      <Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>
        Warning
      </Badge>
      <Badge variant="info" icon={<InfoIcon className="h-3 w-3" />}>
        Info
      </Badge>
    </div>
  ),
};

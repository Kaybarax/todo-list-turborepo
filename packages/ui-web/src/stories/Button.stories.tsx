import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../components/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component built on Flowbite with multiple variants and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    isLoading: {
      control: { type: 'boolean' },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants for visual regression testing
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🔍',
  },
};

// State variants
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading',
  },
};

export const LoadingWithText: Story = {
  args: {
    isLoading: true,
    loadingText: 'Please wait...',
    children: 'Submit',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <span>←</span>,
    children: 'Back',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <span>→</span>,
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <span>📁</span>,
    rightIcon: <span>↗</span>,
    children: 'Open',
  },
};

// Visual regression test: All variants in one view
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-2">
        <Button>Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="space-x-2">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🔍</Button>
      </div>
      <div className="space-x-2">
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
        <Button leftIcon={<span>←</span>}>With Icon</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual regression test showing all button variants and states.',
      },
    },
  },
};

// Dark mode test
export const DarkMode: Story = {
  args: {
    children: 'Dark Mode Button',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Responsive test
export const ResponsiveTest: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <Button className="w-full">Full Width</Button>
      <Button className="w-1/2">Half Width</Button>
      <Button className="w-1/4">Quarter Width</Button>
    </div>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
};

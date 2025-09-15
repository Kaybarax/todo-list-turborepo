import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Button, type ButtonProps } from '../../lib/components/Button/Button';

// Native Button stories (replacing prior web-only shim)
// We expose the same variant/size controls that map through componentMappings

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'Native Button component using UI Kitten + Eva Design tokens. Variants/sizes map via componentMappings; this Storybook now reflects real runtime behavior.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      description: 'Visual style variant (mapped to Eva appearance/status)',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size (mapped to small/medium/large in UI Kitten)',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner and disable interactions',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Stretch button to container width',
    },
    onPress: { action: 'pressed' },
    icon: { control: false },
    iconPosition: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'Placement for optional icon',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = { args: { children: 'Primary Button', variant: 'primary', size: 'md' } };

export const Secondary: Story = { args: { children: 'Secondary Button', variant: 'secondary', size: 'md' } };

export const Outline: Story = { args: { children: 'Outline Button', variant: 'outline', size: 'md' } };

export const Ghost: Story = { args: { children: 'Ghost Button', variant: 'ghost', size: 'md' } };

export const Destructive: Story = { args: { children: 'Destructive Button', variant: 'destructive', size: 'md' } };

export const Small: Story = { args: { children: 'Small Button', variant: 'primary', size: 'sm' } };

export const Large: Story = { args: { children: 'Large Button', variant: 'primary', size: 'lg' } };

export const Disabled: Story = {
  args: { children: 'Disabled Button', variant: 'primary', size: 'md', disabled: true },
};

export const Loading: Story = { args: { children: 'Loading Button', variant: 'primary', size: 'md', loading: true } };

export const FullWidth: Story = {
  args: { children: 'Full Width Button', variant: 'primary', size: 'md', fullWidth: true },
  parameters: { layout: 'padded' },
};

export const AllVariants: Story = {
  render: () => (
    <React.Fragment>
      {(['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as ButtonProps['variant'][]).map(v => (
        <Button key={v} variant={v} size="md" style={{ marginBottom: 12 }} onPress={() => {}}>
          {v!.charAt(0).toUpperCase() + v!.slice(1)}
        </Button>
      ))}
    </React.Fragment>
  ),
  parameters: { controls: { disable: true } },
};

export const AllSizes: Story = {
  render: () => (
    <React.Fragment>
      {(['sm', 'md', 'lg'] as ButtonProps['size'][]).map(s => (
        <Button key={s} variant="primary" size={s} style={{ marginBottom: 12 }} onPress={() => {}}>
          {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
        </Button>
      ))}
    </React.Fragment>
  ),
  parameters: { controls: { disable: true } },
};
// NOTE: Removed web-only containerStyle; native Button already centers via layout params in Storybook canvas wrappers.

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Mobile/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component built on UI Kitten with multiple variants and states.',
      },
    },
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
  args: { onPress: () => console.info('Button pressed') },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    title: 'Outline Button',
    variant: 'outline',
  },
};

export const Danger: Story = {
  args: {
    title: 'Danger Button',
    variant: 'danger',
  },
};

export const Success: Story = {
  args: {
    title: 'Success Button',
    variant: 'success',
  },
};

export const Ghost: Story = {
  args: {
    title: 'Ghost Button',
    variant: 'ghost',
  },
};

// Size variants
export const Small: Story = {
  args: {
    title: 'Small Button',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    title: 'Medium Button',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
  },
};

// State variants
export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
  },
};

// Style variants
export const FullWidth: Story = {
  args: {
    title: 'Full Width Button',
    fullWidth: true,
  },
};

export const Rounded: Story = {
  args: {
    title: 'Rounded Button',
    rounded: true,
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    title: 'With Left Icon',
    leftIcon: 'star',
  },
};

export const WithRightIcon: Story = {
  args: {
    title: 'With Right Icon',
    rightIcon: 'arrow-forward',
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Both Icons',
    leftIcon: 'star',
    rightIcon: 'arrow-forward',
  },
};

// Visual regression test: All variants
export const AllVariants: Story = {
  args: {
    title: 'Button',
  },
  render: () => (
    <div style={{ padding: 16, gap: 8 }}>
      <Button title="Primary" variant="primary" onPress={() => {}} />
      <Button title="Secondary" variant="secondary" onPress={() => {}} />
      <Button title="Outline" variant="outline" onPress={() => {}} />
      <Button title="Danger" variant="danger" onPress={() => {}} />
      <Button title="Success" variant="success" onPress={() => {}} />
      <Button title="Ghost" variant="ghost" onPress={() => {}} />

      <Button title="Small" size="small" onPress={() => {}} />
      <Button title="Medium" size="medium" onPress={() => {}} />
      <Button title="Large" size="large" onPress={() => {}} />

      <Button title="Disabled" disabled onPress={() => {}} />
      <Button title="Loading" loading onPress={() => {}} />
      <Button title="Full Width" fullWidth onPress={() => {}} />
      <Button title="Rounded" rounded onPress={() => {}} />

      <Button title="With Icon" leftIcon="star" onPress={() => {}} />
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

// Complex button combinations
export const ComplexButtons: Story = {
  args: {
    title: 'Button',
  },
  render: () => (
    <div style={{ padding: 16, gap: 12 }}>
      <Button title="Complex Primary" variant="primary" size="large" leftIcon="check" rounded onPress={() => {}} />
      <Button
        title="Complex Secondary"
        variant="secondary"
        size="medium"
        rightIcon="arrow-forward"
        fullWidth
        onPress={() => {}}
      />
      <Button
        title="Complex Outline"
        variant="outline"
        size="small"
        leftIcon="star"
        rightIcon="heart"
        onPress={() => {}}
      />
    </div>
  ),
};

// Dark theme test
export const DarkTheme: Story = {
  args: {
    title: 'Button',
  },
  render: () => (
    <div style={{ padding: 16, backgroundColor: '#1a1a1a' }}>
      <Button title="Dark Theme Button" variant="primary" onPress={() => {}} />
      <Button title="Dark Secondary" variant="secondary" onPress={() => {}} />
      <Button title="Dark Outline" variant="outline" onPress={() => {}} />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Button group
export const ButtonGroup: Story = {
  args: {
    title: 'Button',
  },
  render: () => (
    <div style={{ padding: 16, flexDirection: 'row', gap: 8 }}>
      <Button title="Cancel" variant="outline" onPress={() => {}} />
      <Button title="Save" variant="primary" onPress={() => {}} />
    </div>
  ),
};

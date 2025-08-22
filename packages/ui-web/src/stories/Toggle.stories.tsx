import { type Meta, type StoryObj } from '@storybook/react';

import { Toggle } from '../components/Toggle/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'ghost', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Toggle', pressed: false },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle variant="default">Default</Toggle>
      <Toggle variant="secondary">Secondary</Toggle>
      <Toggle variant="ghost">Ghost</Toggle>
      <Toggle variant="outline">Outline</Toggle>
    </div>
  ),
};

import { type Meta, type StoryObj } from '@storybook/react';

import { Divider } from '../components/Divider/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    tone: {
      control: 'select',
      options: ['default', 'neutral', 'muted', 'strong', 'primary', 'secondary', 'success', 'error'],
    },
    inset: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Divider' } };

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: args => (
    <div className="flex items-center gap-4">
      <span>A</span>
      <Divider {...args} />
      <span>B</span>
    </div>
  ),
};

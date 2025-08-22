import { type Meta, type StoryObj } from '@storybook/react';

import { Progress } from '../components/Progress/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 40 } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[320px]">
      <Progress value={15} tone="primary" />
      <Progress value={35} tone="success" />
      <Progress value={60} tone="warning" striped />
      <Progress value={80} tone="error" animated />
    </div>
  ),
};

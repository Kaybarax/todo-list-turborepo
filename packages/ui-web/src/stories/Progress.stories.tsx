import { type Meta, type StoryObj } from '@storybook/react';

import { Progress } from '../components/Progress/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
      description: 'DaisyUI color variant',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 40 } };

export const DaisyUIVariants: Story = {
  name: 'DaisyUI Color Variants',
  render: () => (
    <div className="flex flex-col gap-3 w-[320px]">
      <Progress value={15} variant="primary" />
      <Progress value={25} variant="secondary" />
      <Progress value={35} variant="accent" />
      <Progress value={45} variant="info" />
      <Progress value={55} variant="success" />
      <Progress value={65} variant="warning" />
      <Progress value={75} variant="error" />
    </div>
  ),
};

export const ProgressValues: Story = {
  name: 'Different Progress Values',
  render: () => (
    <div className="flex flex-col gap-3 w-[320px]">
      <Progress value={0} variant="primary" />
      <Progress value={25} variant="success" />
      <Progress value={50} variant="warning" />
      <Progress value={75} variant="info" />
      <Progress value={100} variant="accent" />
    </div>
  ),
};

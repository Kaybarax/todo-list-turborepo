import { type Meta, type StoryObj } from '@storybook/react';

import { Loading } from '../../lib/components/Loading/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Feedback/Loading',
  component: Loading,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'select', options: ['spinner', 'ring', 'dots', 'bars', 'ball'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { kind: 'spinner', size: 'md' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loading kind="spinner" />
      <Loading kind="ring" />
      <Loading kind="dots" />
      <Loading kind="bars" />
      <Loading kind="ball" />
    </div>
  ),
};

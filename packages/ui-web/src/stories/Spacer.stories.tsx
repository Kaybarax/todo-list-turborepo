import { type Meta, type StoryObj } from '@storybook/react';

import { Spacer } from '../../lib/components/Spacer/Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'px', 'py'] },
    direction: { control: 'select', options: ['vertical', 'horizontal', 'square'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md', direction: 'vertical' },
};

export const HorizontalRule: Story = {
  args: { size: 'py', direction: 'horizontal' },
  render: args => (
    <div className="w-64">
      <div>Above</div>
      <Spacer {...args} className="bg-base-300" />
      <div>Below</div>
    </div>
  ),
};

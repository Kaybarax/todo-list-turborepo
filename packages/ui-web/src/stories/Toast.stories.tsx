import { type Meta, type StoryObj } from '@storybook/react';

import { Toast, Toaster } from '../components/Toast/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div>
      <Toaster position="top-right">
        <Toast {...args} title="Saved" description="Your changes have been saved." />
      </Toaster>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <>
      <Toaster position="top-left">
        <Toast title="Top Left" />
      </Toaster>
      <Toaster position="top-center">
        <Toast title="Top Center" />
      </Toaster>
      <Toaster position="bottom-left">
        <Toast title="Bottom Left" />
      </Toaster>
      <Toaster position="bottom-center">
        <Toast title="Bottom Center" />
      </Toaster>
      <Toaster position="bottom-right">
        <Toast title="Bottom Right" />
      </Toaster>
    </>
  ),
};

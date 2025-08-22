import { type Meta, type StoryObj } from '@storybook/react';

import { Alert } from '../components/Alert/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Heads up!', description: 'This is an informational alert.' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[420px]">
      <Alert variant="info" title="Info" description="Informational" />
      <Alert variant="success" title="Success" description="All good" />
      <Alert variant="warning" title="Warning" description="Be careful" />
      <Alert variant="error" title="Error" description="Something went wrong" />
      <Alert variant="neutral" title="Neutral" description="Neutral tone" />
    </div>
  ),
};

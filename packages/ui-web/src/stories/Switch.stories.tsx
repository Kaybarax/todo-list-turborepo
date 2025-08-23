import { type Meta, type StoryObj } from '@storybook/react';

import { Switch } from '../../lib/components/Switch/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'success', 'error'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: 'sw1', label: 'Enable feature', 'aria-label': 'Enable feature' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch id="sw-xs" size="sm" label="Small" aria-label="Small" />
      <Switch id="sw-md" size="md" label="Medium" aria-label="Medium" />
      <Switch id="sw-lg" size="lg" label="Large" aria-label="Large" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch id="sw-def" state="default" label="Default" aria-label="Default" />
      <Switch id="sw-ok" state="success" label="Success" aria-label="Success" helperText="Looks good" />
      <Switch id="sw-err" state="error" label="Error" aria-label="Error" helperText="Please fix" />
    </div>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'terms',
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: 'checked',
    checked: true,
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        This is checked
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'disabled',
    disabled: true,
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor="disabled"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        This is disabled
      </label>
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <form className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <label
          htmlFor="newsletter"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Subscribe to newsletter
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <label
          htmlFor="marketing"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Receive marketing emails
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="updates" defaultChecked />
        <label
          htmlFor="updates"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Get product updates
        </label>
      </div>
    </form>
  ),
};

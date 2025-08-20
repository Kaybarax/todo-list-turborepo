import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../components/Textarea/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
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
    placeholder: 'Enter your message...',
  },
};

export const WithLabel: Story = {
  render: args => (
    <div className="w-full max-w-sm">
      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
        Message
      </label>
      <Textarea id="message" placeholder="Enter your message..." {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    error: true,
    helperText: 'This field is required',
    placeholder: 'Enter your message...',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Maximum 500 characters',
    placeholder: 'Enter your message...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This textarea is disabled',
    value: 'You cannot edit this text',
  },
};

export const Resizable: Story = {
  args: {
    placeholder: 'This textarea can be resized',
    className: 'resize',
  },
};

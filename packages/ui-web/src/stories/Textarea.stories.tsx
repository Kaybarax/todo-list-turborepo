import { type Meta, type StoryObj } from '@storybook/react';

import { Textarea } from '../components/Textarea/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
    },
    state: {
      control: 'select',
      options: ['default', 'success', 'error'],
      description: 'State variant',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    autoResize: { control: 'boolean' },
    showCount: { control: 'boolean' },
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Textarea placeholder="XS" size="xs" />
      <Textarea placeholder="SM" size="sm" />
      <Textarea placeholder="MD" size="md" />
      <Textarea placeholder="LG" size="lg" />
      <Textarea placeholder="XL" size="xl" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Textarea placeholder="Default" state="default" />
      <Textarea placeholder="Success" state="success" helperText="Looks good!" />
      <Textarea placeholder="Error" state="error" helperText="This field is required" />
    </div>
  ),
};

export const AutoResizeAndCount: Story = {
  args: {
    placeholder: 'Auto-resizing textarea... type to expand',
    autoResize: true,
    showCount: true,
    maxLength: 120,
  },
};

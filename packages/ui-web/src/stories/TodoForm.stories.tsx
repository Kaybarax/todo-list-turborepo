import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TodoForm } from '../components/todo/TodoForm/TodoForm';

const meta: Meta<typeof TodoForm> = {
  title: 'Todo/TodoForm',
  component: TodoForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable form component for creating and editing todos with customizable validation and styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline'],
      description: 'The visual layout variant of the form',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the form elements',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the form is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the form is in a loading state',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Function called when the form is submitted',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Function called when the form is cancelled',
    },
    initialData: {
      control: 'object',
      description: 'Initial data to populate the form',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoForm>;

export const Default: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
  },
};

export const Compact: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'compact',
    size: 'md',
  },
};

export const Inline: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'inline',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'lg',
  },
};

export const WithInitialData: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    initialData: {
      title: 'Sample Todo',
      description: 'This is a sample todo with initial data',
      priority: 'high',
      tags: ['sample', 'important'],
    },
  },
};

export const Loading: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    disabled: true,
  },
};

export const WithCancel: Story = {
  args: {
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    variant: 'default',
    size: 'md',
  },
};

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'The type of the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    leftIcon: {
      control: { disable: true },
      description: 'Icon to display on the left side of the input',
    },
    rightIcon: {
      control: { disable: true },
      description: 'Icon to display on the right side of the input',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter text here',
    error: true,
    helperText: 'This field is required',
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter text here',
    helperText: 'This is a helper text',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Search className="h-4 w-4 text-muted-foreground" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter your email',
    rightIcon: <Mail className="h-4 w-4 text-muted-foreground" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Search className="h-4 w-4 text-muted-foreground" />,
    rightIcon: <Eye className="h-4 w-4 text-muted-foreground" />,
  },
};

export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        rightIcon={
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="pointer-events-auto">
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        }
      />
    );
  },
};

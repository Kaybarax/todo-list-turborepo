import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { Input, type InputProps } from '../../lib/components/Input/Input';

// Native Input stories (concise subset replacing verbose web-only preview)
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Native Input component (UI Kitten) with variant, size, status mappings. This replaces prior web-only implementation and focuses on core usage patterns.',
      },
    },
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['outline', 'filled', 'underline'] },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    status: { control: { type: 'select' }, options: ['default', 'primary', 'success', 'warning', 'danger'] },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    secureTextEntry: { control: 'boolean' },
    multiline: { control: 'boolean' },
    numberOfLines: { control: { type: 'number', min: 1, max: 8 } },
    onChangeText: { action: 'text changed' },
  },
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = { args: { placeholder: 'Enter text...', variant: 'outline', size: 'md' } };
export const Filled: Story = { args: { placeholder: 'Filled style', variant: 'filled', size: 'md' } };
export const Underline: Story = { args: { placeholder: 'Underline style', variant: 'underline', size: 'md' } };
export const WithValue: Story = { args: { value: 'Preset value', variant: 'outline' } };
export const Password: Story = { args: { placeholder: 'Password', secureTextEntry: true, variant: 'outline' } };
export const Multiline: Story = { args: { placeholder: 'Multiline input...', multiline: true, numberOfLines: 4 } };
export const StatusSuccess: Story = { args: { value: 'Looks good', status: 'success' } };
export const StatusError: Story = { args: { value: 'Invalid value', status: 'error' } };

// Controlled example
export const Controlled: Story = {
  render: args => {
    const [text, setText] = React.useState('');
    return <Input {...args} value={text} onChangeText={setText} placeholder={args.placeholder || 'Type...'} />;
  },
};

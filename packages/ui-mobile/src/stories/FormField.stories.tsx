import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { buildMobileMeta } from './helpers/storyMeta';

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChangeText?: (t: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required,
  disabled,
  value: controlled,
  onChangeText,
}) => {
  const [value, setValue] = React.useState(controlled ?? '');
  const id = React.useId();
  const describedBy: string[] = [];
  if (hint) describedBy.push(`${id}-hint`);
  if (error) describedBy.push(`${id}-error`);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChangeText?.(e.target.value);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 320 }}>
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        {label} {required ? '*' : ''}
      </label>
      <input
        id={id}
        aria-describedby={describedBy.join(' ') || undefined}
        aria-invalid={!!error || undefined}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        style={{
          padding: '8px 10px',
          borderRadius: 8,
          border: `1px solid ${error ? '#FF3B30' : '#CECED2'}`,
          outline: 'none',
        }}
      />
      {hint && !error && (
        <div id={`${id}-hint`} style={{ fontSize: 12, color: '#666' }}>
          {hint}
        </div>
      )}
      {error && (
        <div id={`${id}-error`} style={{ fontSize: 12, color: '#FF3B30' }}>
          {error}
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof FormField> = buildMobileMeta({
  title: 'Forms/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component: 'Composable label + input wrapper exposing hint and error messaging with accessible relationships.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    hint: { control: 'text', description: 'Helper text displayed when no error' },
    error: { control: 'text', description: 'Error text (overrides hint when present)' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    onChangeText: { action: 'change' },
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Email', hint: 'We will never share your email.' } };
export const WithError: Story = { args: { label: 'Email', error: 'Invalid email format' } };
export const Required: Story = { args: { label: 'Username', required: true } };
export const Disabled: Story = { args: { label: 'Phone Number', disabled: true, hint: 'Disabled example' } };

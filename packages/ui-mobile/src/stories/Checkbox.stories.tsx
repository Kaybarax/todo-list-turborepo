import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';

type Status = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

interface WebCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  status?: Status;
  onValueChange?: (checked: boolean) => void;
}

const colorByStatus: Record<Status, string> = {
  basic: '#CECED2',
  primary: '#007AFF',
  success: '#34C759',
  info: '#5856D6',
  warning: '#FF9500',
  danger: '#FF3B30',
};

const WebCheckbox: React.FC<WebCheckboxProps> = ({
  checked = false,
  disabled = false,
  indeterminate = false,
  label,
  status = 'primary',
  onValueChange,
}) => {
  const borderColor = colorByStatus[status] || '#CECED2';
  return (
    <label
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onValueChange?.(e.target.checked)}
        ref={el => {
          if (el) el.indeterminate = indeterminate;
        }}
        style={{ width: 18, height: 18, accentColor: borderColor }}
      />
      {label && <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{label}</span>}
    </label>
  );
};

const meta: Meta<typeof WebCheckbox> = {
  title: 'Components/Checkbox',
  component: WebCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable checkbox component with multiple states and accessibility features. Built with UI Kitten and Eva Design.',
      },
    },
  },
  decorators: [withUIKitten],
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in indeterminate state',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text for the checkbox',
    },
    status: {
      control: { type: 'select' },
      options: ['basic', 'primary', 'success', 'info', 'warning', 'danger'],
      description: 'Visual status of the checkbox',
    },
    onValueChange: { action: 'changed' },
  },
} satisfies Meta<typeof WebCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Default Checkbox',
    onValueChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked Checkbox',
    onValueChange: () => {},
  },
};

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    label: 'Indeterminate Checkbox',
    onValueChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled Checkbox',
    onValueChange: () => {},
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled Checked Checkbox',
    onValueChange: () => {},
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
    onValueChange: () => {},
  },
};

export const AllStatuses: Story = {
  args: {
    checked: false,
    onValueChange: () => {},
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <WebCheckbox checked={false} label="Basic" status="basic" onValueChange={() => {}} />
      <WebCheckbox checked={true} label="Primary" status="primary" onValueChange={() => {}} />
      <WebCheckbox checked={true} label="Success" status="success" onValueChange={() => {}} />
      <WebCheckbox checked={true} label="Info" status="info" onValueChange={() => {}} />
      <WebCheckbox checked={true} label="Warning" status="warning" onValueChange={() => {}} />
      <WebCheckbox checked={true} label="Danger" status="danger" onValueChange={() => {}} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

const InteractiveCheckboxDemo = () => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 200 }}>
      <WebCheckbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        label="Interactive Checkbox"
        onValueChange={setChecked}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <WebCheckbox checked={indeterminate} label="Indeterminate" onValueChange={setIndeterminate} />
        <WebCheckbox checked={disabled} label="Disabled" onValueChange={setDisabled} />
      </div>
    </div>
  );
};

export const Interactive: Story = {
  args: {
    checked: false,
    onValueChange: () => {},
  },
  render: () => <InteractiveCheckboxDemo />,
  parameters: {
    controls: { disable: true },
  },
};

// Inline styles used for simplicity; no React Native dependency

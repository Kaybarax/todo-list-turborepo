import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Checkbox } from '../../lib/components/Checkbox/Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable checkbox component with multiple states and accessibility features. Built with UI Kitten and Eva Design.',
      },
    },
  },
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
} satisfies Meta<typeof Checkbox>;

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
    <View style={styles.container}>
      <Checkbox checked={false} label="Basic" status="basic" onValueChange={() => {}} />
      <Checkbox checked={true} label="Primary" status="primary" onValueChange={() => {}} />
      <Checkbox checked={true} label="Success" status="success" onValueChange={() => {}} />
      <Checkbox checked={true} label="Info" status="info" onValueChange={() => {}} />
      <Checkbox checked={true} label="Warning" status="warning" onValueChange={() => {}} />
      <Checkbox checked={true} label="Danger" status="danger" onValueChange={() => {}} />
    </View>
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
    <View style={styles.interactiveContainer}>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        label="Interactive Checkbox"
        onValueChange={setChecked}
      />

      <View style={styles.controls}>
        <Checkbox checked={indeterminate} label="Indeterminate" onValueChange={setIndeterminate} />
        <Checkbox checked={disabled} label="Disabled" onValueChange={setDisabled} />
      </View>
    </View>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'flex-start',
  },
  interactiveContainer: {
    flexDirection: 'column',
    gap: 24,
    minWidth: 200,
  },
  controls: {
    flexDirection: 'column',
    gap: 12,
  },
});

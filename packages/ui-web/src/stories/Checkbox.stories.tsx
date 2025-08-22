import { type Meta, type StoryObj } from '@storybook/react';

import { Checkbox } from '../components/Checkbox/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'cbx-1',
    label: 'Accept terms',
    'aria-label': 'Accept terms',
  },
};

export const Indeterminate: Story = {
  args: {
    id: 'cbx-2',
    label: 'Select all',
    indeterminate: true,
    helperText: 'Some items selected',
    'aria-label': 'Select all',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="xs" label="Extra small" aria-label="XS" />
      <Checkbox size="sm" label="Small" aria-label="SM" />
      <Checkbox size="md" label="Medium" aria-label="MD" />
      <Checkbox size="lg" label="Large" aria-label="LG" />
      <Checkbox size="xl" label="Extra large" aria-label="XL" />
    </div>
  ),
};

export const DaisyUIVariants: Story = {
  name: 'DaisyUI Color Variants',
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox variant="primary" label="Primary" aria-label="Primary variant" />
      <Checkbox variant="secondary" label="Secondary" aria-label="Secondary variant" />
      <Checkbox variant="accent" label="Accent" aria-label="Accent variant" />
      <Checkbox variant="info" label="Info" aria-label="Info variant" />
      <Checkbox variant="success" label="Success" aria-label="Success variant" />
      <Checkbox variant="warning" label="Warning" aria-label="Warning variant" />
      <Checkbox variant="error" label="Error" aria-label="Error variant" />
    </div>
  ),
};

export const LegacyStates: Story = {
  name: 'Legacy States (Backward Compatible)',
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox state="default" label="Default" aria-label="Default state" />
      <Checkbox state="success" label="Success" aria-label="Success state" helperText="Looks good" />
      <Checkbox state="error" label="Error" aria-label="Error state" helperText="Please fix" />
    </div>
  ),
};

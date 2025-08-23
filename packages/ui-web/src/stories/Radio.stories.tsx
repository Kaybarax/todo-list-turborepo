import { type Meta, type StoryObj } from '@storybook/react';

import { Radio } from '../../lib/components/Radio/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
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
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'r-1',
    name: 'group1',
    label: 'Option A',
    'aria-label': 'Option A',
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio id="r-a" name="g" label="Option A" aria-label="Option A" />
      <Radio id="r-b" name="g" label="Option B" aria-label="Option B" />
      <Radio id="r-c" name="g" label="Option C" aria-label="Option C" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio size="xs" name="sz" label="XS" aria-label="XS" />
      <Radio size="sm" name="sz" label="SM" aria-label="SM" />
      <Radio size="md" name="sz" label="MD" aria-label="MD" />
      <Radio size="lg" name="sz" label="LG" aria-label="LG" />
      <Radio size="xl" name="sz" label="XL" aria-label="XL" />
    </div>
  ),
};

export const DaisyUIVariants: Story = {
  name: 'DaisyUI Color Variants',
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio variant="primary" name="variants" label="Primary" aria-label="Primary variant" />
      <Radio variant="secondary" name="variants" label="Secondary" aria-label="Secondary variant" />
      <Radio variant="accent" name="variants" label="Accent" aria-label="Accent variant" />
      <Radio variant="info" name="variants" label="Info" aria-label="Info variant" />
      <Radio variant="success" name="variants" label="Success" aria-label="Success variant" />
      <Radio variant="warning" name="variants" label="Warning" aria-label="Warning variant" />
      <Radio variant="error" name="variants" label="Error" aria-label="Error variant" />
    </div>
  ),
};

export const LegacyStates: Story = {
  name: 'Legacy States (Backward Compatible)',
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio state="default" name="st" label="Default" aria-label="Default" />
      <Radio state="success" name="st" label="Success" aria-label="Success" helperText="Looks good" />
      <Radio state="error" name="st" label="Error" aria-label="Error" helperText="Please fix" />
    </div>
  ),
};

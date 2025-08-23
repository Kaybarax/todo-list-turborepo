import { type Meta, type StoryObj } from '@storybook/react';

import { Select } from '../../lib/components/Select/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
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
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
      description: 'Color state variant',
    },
    variant: {
      control: 'select',
      options: ['bordered', 'ghost'],
      description: 'Style variant',
    },
    error: {
      control: 'boolean',
      description: 'Whether the select has an error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[180px]',
    'aria-label': 'Select a fruit',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    className: 'w-[180px]',
    'aria-label': 'Select a fruit with helper',
    helperText: 'Choose your favorite fruit',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    className: 'w-[180px]',
    'aria-label': 'Select a fruit with error',
    error: true,
    helperText: 'Please select a fruit',
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    className: 'w-[180px]',
    'aria-label': 'Disabled select',
    disabled: true,
    children: (
      <>
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

export const WithGroups: Story = {
  args: {
    className: 'w-[200px]',
    'aria-label': 'Select a timezone',
    children: (
      <>
        <option value="">Select a timezone</option>
        <optgroup label="North America">
          <option value="est">Eastern Standard Time (EST)</option>
          <option value="cst">Central Standard Time (CST)</option>
          <option value="mst">Mountain Standard Time (MST)</option>
          <option value="pst">Pacific Standard Time (PST)</option>
        </optgroup>
        <optgroup label="Europe & Africa">
          <option value="gmt">Greenwich Mean Time (GMT)</option>
          <option value="cet">Central European Time (CET)</option>
          <option value="eet">Eastern European Time (EET)</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="ist">India Standard Time (IST)</option>
          <option value="jst">Japan Standard Time (JST)</option>
          <option value="kst">Korea Standard Time (KST)</option>
        </optgroup>
      </>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Select size="xs" aria-label="Size XS">
        <option value="">XS</option>
      </Select>
      <Select size="sm" aria-label="Size SM">
        <option value="">SM</option>
      </Select>
      <Select size="md" aria-label="Size MD">
        <option value="">MD</option>
      </Select>
      <Select size="lg" aria-label="Size LG">
        <option value="">LG</option>
      </Select>
      <Select size="xl" aria-label="Size XL">
        <option value="">XL</option>
      </Select>
    </div>
  ),
};

export const DaisyUIColorStates: Story = {
  name: 'DaisyUI Color States',
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Select state="primary" aria-label="Primary state">
        <option value="">Primary</option>
      </Select>
      <Select state="secondary" aria-label="Secondary state">
        <option value="">Secondary</option>
      </Select>
      <Select state="accent" aria-label="Accent state">
        <option value="">Accent</option>
      </Select>
      <Select state="info" aria-label="Info state">
        <option value="">Info</option>
      </Select>
      <Select state="success" aria-label="Success state">
        <option value="">Success</option>
      </Select>
      <Select state="warning" aria-label="Warning state">
        <option value="">Warning</option>
      </Select>
      <Select state="error" aria-label="Error state">
        <option value="">Error</option>
      </Select>
    </div>
  ),
};

export const DaisyUIStyleVariants: Story = {
  name: 'DaisyUI Style Variants',
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Select variant="bordered" aria-label="Bordered variant">
        <option value="">Bordered (Default)</option>
      </Select>
      <Select variant="ghost" aria-label="Ghost variant">
        <option value="">Ghost</option>
      </Select>
    </div>
  ),
};

export const LegacyStates: Story = {
  name: 'Legacy States (Backward Compatible)',
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Select state="default" aria-label="State default">
        <option value="">Default</option>
      </Select>
      <Select state="success" helperText="Looks good!" aria-label="State success">
        <option value="">Success</option>
      </Select>
      <Select state="error" helperText="Please fix this" aria-label="State error">
        <option value="">Error</option>
      </Select>
    </div>
  ),
};

export const Multiple: Story = {
  args: {
    className: 'w-[220px] h-40',
    'aria-label': 'Select multiple fruits',
    multiple: true,
    children: (
      <>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </>
    ),
  },
};

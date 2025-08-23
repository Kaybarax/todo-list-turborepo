import { type Meta, type StoryObj } from '@storybook/react';

import { Combobox } from '../../lib/components/Combobox/Combobox';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
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
    multiple: { control: 'boolean' },
    helperText: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'fruit-combobox',
    placeholder: 'Search fruits…',
    options: fruits,
    'aria-label': 'Search fruits',
    className: 'w-[240px]',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Combobox options={fruits} size="xs" aria-label="Size XS" placeholder="XS" />
      <Combobox options={fruits} size="sm" aria-label="Size SM" placeholder="SM" />
      <Combobox options={fruits} size="md" aria-label="Size MD" placeholder="MD" />
      <Combobox options={fruits} size="lg" aria-label="Size LG" placeholder="LG" />
      <Combobox options={fruits} size="xl" aria-label="Size XL" placeholder="XL" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Combobox options={fruits} state="default" aria-label="State default" placeholder="Default" />
      <Combobox
        options={fruits}
        state="success"
        aria-label="State success"
        placeholder="Success"
        helperText="Looks good!"
      />
      <Combobox
        options={fruits}
        state="error"
        aria-label="State error"
        placeholder="Error"
        helperText="Please fix this"
      />
    </div>
  ),
};

export const Multiple: Story = {
  args: {
    id: 'fruit-combobox-multi',
    placeholder: 'Search fruits…',
    options: fruits,
    multiple: true,
    'aria-label': 'Search fruits (multiple)',
    className: 'w-[240px]',
  },
};

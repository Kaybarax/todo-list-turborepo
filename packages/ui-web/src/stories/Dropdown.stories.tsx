import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Dropdown, type DropdownItem } from '../components/Dropdown/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Overlay/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof meta>;

const items: DropdownItem[] = [
  { id: 'new', label: 'New' },
  { id: 'open', label: 'Open' },
  { id: 'save', label: 'Save', disabled: true },
  { id: 'exit', label: 'Exit' },
];

export const Default: Story = {
  args: {
    items,
    label: 'Menu',
    defaultOpen: true,
  },
};

import { type Meta, type StoryObj } from '@storybook/react';

import { List } from '../../lib/components/List/List';

const meta: Meta<typeof List> = {
  title: 'Data Display/List',
  component: List,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['unordered', 'ordered', 'none'] },
    spacing: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    as: { control: 'select', options: ['ul', 'ol'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ['First', 'Second', 'Third'],
    as: 'ul',
    variant: 'unordered',
    spacing: 'md',
  },
};

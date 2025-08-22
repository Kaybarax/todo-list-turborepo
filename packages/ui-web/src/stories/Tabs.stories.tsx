import { type Meta, type StoryObj } from '@storybook/react';

import { Tabs, type TabItem } from '../components/Tabs/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const items: TabItem[] = [
  { id: 'tab-1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab-2', label: 'Tab 2', content: <div>Content 2</div> },
  { id: 'tab-3', label: 'Tab 3', content: <div>Content 3</div>, disabled: false },
];

export const Default: Story = {
  args: {
    items,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    items,
    orientation: 'vertical',
  },
};

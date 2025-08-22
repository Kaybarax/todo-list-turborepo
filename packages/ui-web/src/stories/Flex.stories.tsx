import { type Meta, type StoryObj } from '@storybook/react';

import { Flex } from '../components/Flex/Flex';
import { Button } from '../components/Button/Button';

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'row_reverse', 'column', 'column_reverse'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'select', options: ['nowrap', 'wrap', 'wrap_reverse'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: 'row', gap: 'md' },
  render: args => (
    <Flex {...args}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Flex>
  ),
};

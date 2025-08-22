import { type Meta, type StoryObj } from '@storybook/react';

import { Stack } from '../components/Stack/Stack';
import { Button } from '../components/Button/Button';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'select', options: ['nowrap', 'wrap', 'wrap_reverse'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: 'column', gap: 'md' },
  render: args => (
    <Stack {...args}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Stack>
  ),
};

export const RowGapAlign: Story = {
  render: () => (
    <Stack direction="row" gap="lg" align="center" justify="between" style={{ width: 400 }}>
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </Stack>
  ),
};

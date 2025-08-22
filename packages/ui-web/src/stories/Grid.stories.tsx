import { type Meta, type StoryObj } from '@storybook/react';

import { Grid } from '../components/Grid/Grid';
import { Card } from '../components/Card/Card';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    cols: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { cols: 3, gap: 'md' },
  render: args => (
    <Grid {...args}>
      {[...Array(6)].map((_, i) => (
        <Card key={i} title={`Item ${i + 1}`}>
          Content
        </Card>
      ))}
    </Grid>
  ),
};

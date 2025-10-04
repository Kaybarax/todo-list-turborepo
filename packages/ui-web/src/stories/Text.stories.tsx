import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../lib/components/Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'This is a default text component.',
  },
};

export const Heading1: Story = {
  args: {
    as: 'h1',
    variant: 'h1',
    children: 'This is an H1 heading.',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'This is a muted text.',
  },
};

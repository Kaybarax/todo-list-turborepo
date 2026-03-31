import { type Meta, type StoryObj } from '@storybook/react';

import { Avatar } from '../../lib/components/Avatar/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Media/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['round', 'square'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?u=storybook',
    alt: 'User avatar',
    size: 'md',
    shape: 'round',
  },
};

export const WithFallback: Story = {
  args: {
    alt: 'User initials',
    size: 'md',
    children: 'KD',
  },
};

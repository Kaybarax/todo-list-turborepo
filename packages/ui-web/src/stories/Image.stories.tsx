import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Image } from '../components/Image/Image';

const meta: Meta<typeof Image> = {
  title: 'Media/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    fit: { control: 'select', options: ['cover', 'contain', 'fill', 'none', 'scaleDown'] },
    rounded: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    showLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/seed/image/400/240',
    alt: 'Random image',
    fit: 'cover',
    rounded: 'md',
    showLoading: true,
    style: { width: 300, height: 180 },
  },
};

export const WithFallback: Story = {
  args: {
    alt: 'Broken image',
    fallback: <span>Fallback</span>,
    style: { width: 200, height: 120 },
  },
};

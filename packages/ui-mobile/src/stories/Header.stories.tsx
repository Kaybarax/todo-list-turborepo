import { type Meta, type StoryObj } from '@storybook/react';

import { Header } from '../../lib/components/Header/Header';
import { Button } from '../../lib/components/Button';
import { Icon } from '../../lib/components/Icon';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive header component with title, left/right actions, safe area handling, and theme integration.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Header title text',
    },
    showBorder: {
      control: { type: 'boolean' },
      description: 'Whether to show bottom border',
    },
    statusBarStyle: {
      control: { type: 'select' },
      options: ['light-content', 'dark-content', 'default'],
      description: 'Status bar style',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Custom background color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Basic Header',
  },
};

export const WithBorder: Story = {
  args: {
    title: 'Header with Border',
    showBorder: true,
  },
};

export const WithLeftAction: Story = {
  args: {
    title: 'Back Navigation',
    leftAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Back pressed')}>
        <Icon name="arrow-back" size={20} />
      </Button>
    ),
  },
};

export const WithRightAction: Story = {
  args: {
    title: 'Settings',
    rightAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Menu pressed')}>
        <Icon name="menu" size={20} />
      </Button>
    ),
  },
};

export const WithBothActions: Story = {
  args: {
    title: 'Profile',
    leftAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Back pressed')}>
        <Icon name="arrow-back" size={20} />
      </Button>
    ),
    rightAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Edit pressed')}>
        <Icon name="edit" size={20} />
      </Button>
    ),
    showBorder: true,
  },
};

export const CustomBackground: Story = {
  args: {
    title: 'Custom Header',
    backgroundColor: '#6366f1',
    statusBarStyle: 'light-content',
    leftAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Back pressed')}>
        <Icon name="arrow-back" size={20} color="#ffffff" />
      </Button>
    ),
    rightAction: (
      <Button variant="ghost" size="sm" onPress={() => console.log('Share pressed')}>
        <Icon name="share" size={20} color="#ffffff" />
      </Button>
    ),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long header title that might wrap or truncate',
    leftAction: (
      <Button variant="ghost" size="sm">
        <Icon name="arrow-back" size={20} />
      </Button>
    ),
    rightAction: (
      <Button variant="ghost" size="sm">
        <Icon name="more-vertical" size={20} />
      </Button>
    ),
  },
};

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';

interface WebHeaderProps {
  title?: string;
  showBorder?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

const WebHeader: React.FC<WebHeaderProps> = ({
  title,
  showBorder,
  statusBarStyle,
  backgroundColor = '#FFFFFF',
  leftAction,
  rightAction,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: showBorder ? '1px solid #E5E7EB' : 'none',
      backgroundColor,
      color: statusBarStyle === 'light-content' ? '#FFFFFF' : '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div>{leftAction}</div>
    <div style={{ fontWeight: 600 }}>{title}</div>
    <div>{rightAction}</div>
  </div>
);

const meta: Meta<typeof WebHeader> = {
  title: 'Components/Header',
  component: WebHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive header component with title, left/right actions, safe area handling, and theme integration.',
      },
    },
  },
  decorators: [withUIKitten],
  tags: ['autodocs'],
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
    leftAction: <button onClick={() => console.info('Back pressed')}>←</button>,
  },
};

export const WithRightAction: Story = {
  args: {
    title: 'Settings',
    rightAction: <button onClick={() => console.info('Menu pressed')}>☰</button>,
  },
};

export const WithBothActions: Story = {
  args: {
    title: 'Profile',
    leftAction: <button onClick={() => console.info('Back pressed')}>←</button>,
    rightAction: <button onClick={() => console.info('Edit pressed')}>✎</button>,
    showBorder: true,
  },
};

export const CustomBackground: Story = {
  args: {
    title: 'Custom Header',
    backgroundColor: '#6366f1',
    statusBarStyle: 'light-content',
    leftAction: <button style={{ color: '#fff' }}>←</button>,
    rightAction: <button style={{ color: '#fff' }}>⇪</button>,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long header title that might wrap or truncate',
    leftAction: <button>←</button>,
    rightAction: <button>⋮</button>,
  },
};

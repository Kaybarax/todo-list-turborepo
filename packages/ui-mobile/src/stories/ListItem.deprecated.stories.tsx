import React from 'react';
import { type Meta, type StoryObj } from '@storybook/react';
import { buildMobileMeta } from './helpers/storyMeta';

interface ListItemProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  onPress?: () => void;
  deprecated?: boolean;
}

const Banner: React.FC = () => (
  <div
    style={{
      padding: '12px 16px',
      background: '#FFF4E5',
      border: '1px solid #FFC78A',
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 14,
    }}
  >
    <strong>Deprecated:</strong> This component will be removed in a future minor release. Use{' '}
    <code>UIKitten ListItem</code> instead.
  </div>
);

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, disabled, onPress }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 16px',
      gap: 4,
      border: '1px solid #E0E0E5',
      borderRadius: 8,
      background: disabled ? '#F5F5F7' : '#FFFFFF',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      maxWidth: 360,
    }}
    role="listitem"
    aria-disabled={disabled || undefined}
    onClick={() => !disabled && onPress?.()}
  >
    <span style={{ fontWeight: 600 }}>{title}</span>
    {subtitle && <span style={{ fontSize: 14, color: '#555' }}>{subtitle}</span>}
  </div>
);

const meta: Meta<typeof ListItem> = buildMobileMeta({
  title: 'Deprecated/ListItem',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component: 'Deprecated custom ListItem shim. Prefer native UI Kitten ListItem directly.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Deprecated: Story = {
  render: args => (
    <div>
      <Banner />
      <ListItem {...args} />
    </div>
  ),
  args: {
    title: 'Legacy Item',
    subtitle: 'This ListItem is deprecated',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the deprecation banner and the legacy ListItem usage.',
      },
    },
  },
};

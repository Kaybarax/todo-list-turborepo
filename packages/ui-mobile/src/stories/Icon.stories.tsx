import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { buildMobileMeta } from './helpers/storyMeta';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  decorative?: boolean;
  label?: string; // for non-decorative
}

const glyphs: Record<string, string> = {
  search: '🔍',
  close: '✖️',
  check: '✔️',
  warning: '⚠️',
  info: 'ℹ️',
  star: '⭐',
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#1C1C1E', decorative = true, label }) => {
  const glyph = glyphs[name] ?? '❔';
  return (
    <span
      role={decorative ? 'img' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={!decorative ? (label ?? name) : undefined}
      style={{ fontSize: size, lineHeight: 1, color }}
    >
      {glyph}
    </span>
  );
};

const meta: Meta<typeof Icon> = buildMobileMeta({
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    docs: { description: { component: 'Simple emoji-backed icon primitive for Storybook demonstration.' } },
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(glyphs) },
    size: { control: { type: 'number', min: 8, max: 64, step: 1 } },
    color: { control: 'color' },
    decorative: { control: 'boolean', description: 'If false, an accessible label is required' },
    label: { control: 'text' },
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: 'info' } };
export const Large: Story = { args: { name: 'star', size: 48 } };
export const NonDecorative: Story = { args: { name: 'warning', decorative: false, label: 'Warning icon' } };

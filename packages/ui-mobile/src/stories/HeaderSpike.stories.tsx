import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../../lib/components/Header/Header';
import { HeaderTopNavSpike } from '../../lib/components/Header/HeaderTopNavSpike';

const meta: Meta = {
  title: 'Components/Header/SpikeComparison',
};
export default meta;

type Story = StoryObj;

export const Comparison: Story = {
  render: () => (
    <>
      <Header title="Original Header" leftAction={null} rightAction={null} />
      <HeaderTopNavSpike title="Spike TopNavigation Header" />
    </>
  ),
};

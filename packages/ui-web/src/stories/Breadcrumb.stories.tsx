import { type Meta, type StoryObj } from '@storybook/react';

import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#' },
        { label: 'Library', href: '#' },
        { label: 'Data', current: true },
      ]}
    />
  ),
};

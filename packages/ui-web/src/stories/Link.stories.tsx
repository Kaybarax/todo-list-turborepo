import { type Meta, type StoryObj } from '@storybook/react';

import { Link } from '../components/Link/Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'neutral', 'success', 'error', 'subtle'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    underline: { control: 'boolean' },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: '#', children: 'Default Link' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Link href="#" variant="default">
        Primary
      </Link>
      <Link href="#" variant="secondary">
        Secondary
      </Link>
      <Link href="#" variant="neutral">
        Neutral
      </Link>
      <Link href="#" variant="success">
        Success
      </Link>
      <Link href="#" variant="error">
        Error
      </Link>
      <Link href="#" variant="subtle">
        Subtle
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Link href="#" size="sm">
        Small
      </Link>
      <Link href="#" size="md">
        Medium
      </Link>
      <Link href="#" size="lg">
        Large
      </Link>
    </div>
  ),
};

export const UnderlineExternalDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Link href="#" underline>
        Underlined
      </Link>
      <Link href="https://example.com" external>
        External
      </Link>
      <Link href="#" disabled>
        Disabled
      </Link>
    </div>
  ),
};

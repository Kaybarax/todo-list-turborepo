import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';
// Removed buildMobileMeta helper to provide a direct object literal meta export (required for CSF indexing).
import './shared/story-styles.css';

// Web-compatible Avatar component for Storybook
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AvatarVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'light' | 'dark';

interface AvatarProps {
  source?: string;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  testID?: string;
}

const Avatar: React.FC<AvatarProps> = ({ source, initials, size = 'md', variant = 'primary', testID }) => {
  const sizeValue = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  }[size];

  const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  }[size];

  return (
    <div
      className={`sbAvatar sbAvatar--${size} sbAvatar--variant-${variant}`}
      data-testid={testID}
      data-size={sizeValue}
      data-font={fontSize}
    >
      {source ? (
        <img src={source} alt="Avatar" className="sbAvatarImg" data-testid={`${testID}-image`} />
      ) : (
        <span className="sbAvatarText" data-testid={`${testID}-text`}>
          {initials ?? ''}
        </span>
      )}
    </div>
  );
};

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [withUIKitten],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component: 'A customizable avatar component (web preview) for images or initials.',
      },
    },
  },
  argTypes: {
    size: { control: { type: 'select' }, options: ['xs', 'sm', 'md', 'lg', 'xl'], description: 'Size of the avatar' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'light', 'dark'],
      description: 'Predefined color variant',
    },
    initials: { control: { type: 'text' }, description: 'Initials to display when no image is provided' },
    source: { control: { type: 'text' }, description: 'Image URL to display' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initials: 'JD',
  },
};

export const WithInitials: Story = {
  args: {
    initials: 'AB',
    variant: 'primary',
  },
};

export const WithImage: Story = {
  args: {
    source: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=Avatar',
  },
};

export const ExtraSmall: Story = {
  args: {
    initials: 'XS',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    initials: 'SM',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    initials: 'MD',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    initials: 'LG',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    initials: 'XL',
    size: 'xl',
  },
};

export const CustomColors: Story = {
  args: {
    initials: 'CC',
    variant: 'success',
  },
};

export const PrimaryColor: Story = {
  args: {
    initials: 'PR',
    variant: 'primary',
  },
};

export const SecondaryColor: Story = {
  args: {
    initials: 'SC',
    variant: 'secondary',
  },
};

export const SuccessColor: Story = {
  args: {
    initials: 'SU',
    variant: 'success',
  },
};

export const DangerColor: Story = {
  args: {
    initials: 'DN',
    variant: 'danger',
  },
};

export const WarningColor: Story = {
  args: {
    initials: 'WR',
    variant: 'warning',
  },
};

export const LightBackground: Story = {
  args: {
    initials: 'LB',
    variant: 'light',
  },
};

export const DarkBackground: Story = {
  args: {
    initials: 'DB',
    variant: 'dark',
  },
};

export const ImageSmall: Story = {
  args: {
    source: 'https://via.placeholder.com/150/5856D6/FFFFFF?text=SM',
    size: 'sm',
  },
};

export const ImageLarge: Story = {
  args: {
    source: 'https://via.placeholder.com/150/34C759/FFFFFF?text=LG',
    size: 'lg',
  },
};

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';

// Web-compatible Avatar component for Storybook
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string;
  initials?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'md',
  backgroundColor = '#007AFF',
  textColor = '#FFFFFF',
  testID,
}) => {
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

  const containerStyle: React.CSSProperties = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '500',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const textStyle: React.CSSProperties = {
    fontSize,
    color: textColor,
    fontWeight: '500',
    margin: 0,
    padding: 0,
  };

  return (
    <div style={containerStyle} data-testid={testID}>
      {source ? (
        <img src={source} alt="Avatar" style={imageStyle} data-testid={`${testID}-image`} />
      ) : (
        <span style={textStyle} data-testid={`${testID}-text`}>
          {initials ?? ''}
        </span>
      )}
    </div>
  );
};

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable avatar component for displaying user profile images or initials (web preview)',
      },
    },
  },
  decorators: [withUIKitten],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Background color when displaying initials',
    },
    textColor: {
      control: { type: 'color' },
      description: 'Text color for initials',
    },
    initials: {
      control: { type: 'text' },
      description: 'Initials to display when no image is provided',
    },
    source: {
      control: { type: 'text' },
      description: 'Image URL to display',
    },
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
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF',
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
    backgroundColor: '#34C759',
    textColor: '#FFFFFF',
  },
};

export const PrimaryColor: Story = {
  args: {
    initials: 'PR',
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF',
  },
};

export const SecondaryColor: Story = {
  args: {
    initials: 'SC',
    backgroundColor: '#5856D6',
    textColor: '#FFFFFF',
  },
};

export const SuccessColor: Story = {
  args: {
    initials: 'SU',
    backgroundColor: '#34C759',
    textColor: '#FFFFFF',
  },
};

export const DangerColor: Story = {
  args: {
    initials: 'DN',
    backgroundColor: '#FF3B30',
    textColor: '#FFFFFF',
  },
};

export const WarningColor: Story = {
  args: {
    initials: 'WR',
    backgroundColor: '#FF9500',
    textColor: '#FFFFFF',
  },
};

export const LightBackground: Story = {
  args: {
    initials: 'LB',
    backgroundColor: '#F2F2F7',
    textColor: '#1C1C1E',
  },
};

export const DarkBackground: Story = {
  args: {
    initials: 'DB',
    backgroundColor: '#1C1C1E',
    textColor: '#FFFFFF',
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

import React from 'react';

import { withUIKitten } from './decorators/UIKittenProvider';
import './shared/layout.css';
import { Badge } from '../../lib/components/Badge/Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Native Badge component (react-native-web). Supports variant + size using Eva theme tokens via EnhancedThemeProvider.',
      },
    },
  },
  decorators: [withUIKitten],
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Text content to display in the badge',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Visual variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the badge',
    },
  },
};

export default meta;

// Default story
export const Default = {
  args: {
    text: 'Badge',
  },
};

// Variant stories
export const Primary = {
  args: {
    text: 'Primary',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    text: 'Secondary',
    variant: 'secondary',
  },
};

export const Success = {
  args: {
    text: 'Success',
    variant: 'success',
  },
};

export const Warning = {
  args: {
    text: 'Warning',
    variant: 'warning',
  },
};

export const Danger = {
  args: {
    text: 'Danger',
    variant: 'danger',
  },
};

// Size stories
export const Small = {
  args: {
    text: 'Small',
    size: 'small',
    variant: 'primary',
  },
};

export const Medium = {
  args: {
    text: 'Medium',
    size: 'medium',
    variant: 'primary',
  },
};

export const Large = {
  args: {
    text: 'Large',
    size: 'large',
    variant: 'primary',
  },
};

// Content type stories
export const ShortText = {
  args: {
    text: 'New',
    variant: 'success',
  },
};

export const LongText = {
  args: {
    text: 'Very Long Badge Text',
    variant: 'warning',
  },
};

export const NumberBadge = {
  args: {
    text: '42',
    variant: 'danger',
    size: 'small',
  },
};

export const StatusBadge = {
  args: {
    text: 'Active',
    variant: 'success',
  },
};

export const NotificationBadge = {
  args: {
    text: '99+',
    variant: 'danger',
    size: 'small',
  },
};

// Combined variant and size examples
export const SmallVariants = {
  render: () => (
    <div className="badgeRow">
      <Badge text="Default" variant="default" size="small" />
      <Badge text="Primary" variant="primary" size="small" />
      <Badge text="Secondary" variant="secondary" size="small" />
      <Badge text="Success" variant="success" size="small" />
      <Badge text="Warning" variant="warning" size="small" />
      <Badge text="Danger" variant="danger" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in small size',
      },
    },
  },
};

export const MediumVariants = {
  render: () => (
    <div className="badgeRow">
      <Badge text="Default" variant="default" size="medium" />
      <Badge text="Primary" variant="primary" size="medium" />
      <Badge text="Secondary" variant="secondary" size="medium" />
      <Badge text="Success" variant="success" size="medium" />
      <Badge text="Warning" variant="warning" size="medium" />
      <Badge text="Danger" variant="danger" size="medium" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in medium size',
      },
    },
  },
};

export const LargeVariants = {
  render: () => (
    <div className="badgeRow">
      <Badge text="Default" variant="default" size="large" />
      <Badge text="Primary" variant="primary" size="large" />
      <Badge text="Secondary" variant="secondary" size="large" />
      <Badge text="Success" variant="success" size="large" />
      <Badge text="Warning" variant="warning" size="large" />
      <Badge text="Danger" variant="danger" size="large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants in large size',
      },
    },
  },
};

// Real-world usage examples
export const TodoStatus = {
  render: () => (
    <div className="badgeRow">
      <Badge text="Todo" variant="default" />
      <Badge text="In Progress" variant="warning" />
      <Badge text="Completed" variant="success" />
      <Badge text="Overdue" variant="danger" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for todo item status',
      },
    },
  },
};

export const UserRoles = {
  render: () => (
    <div className="badgeRow">
      <Badge text="Admin" variant="danger" size="small" />
      <Badge text="Moderator" variant="warning" size="small" />
      <Badge text="User" variant="primary" size="small" />
      <Badge text="Guest" variant="default" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for user roles and permissions',
      },
    },
  },
};

export const NotificationCounts = {
  render: () => (
    <div className="badgeRow">
      <Badge text="1" variant="danger" size="small" />
      <Badge text="5" variant="danger" size="small" />
      <Badge text="12" variant="danger" size="small" />
      <Badge text="99+" variant="danger" size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge usage for notification counts',
      },
    },
  },
};

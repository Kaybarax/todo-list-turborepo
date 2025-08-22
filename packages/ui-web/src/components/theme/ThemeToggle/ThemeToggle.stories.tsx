import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../../theme';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          'An enhanced theme toggle component that supports multiple variants and cycling modes. Can toggle between light/dark modes, cycle through all themes, or cycle through light/dark/system modes with smooth transitions and proper accessibility.',
      },
    },
  },
  decorators: [
    Story => (
      <ThemeProvider>
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['button', 'icon', 'switch', 'compact'],
      description: 'The visual variant of the theme toggle',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the theme toggle',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the theme label text',
    },
    cycleThrough: {
      control: 'select',
      options: ['mode', 'themes', 'lightDark'],
      description: 'What to cycle through when toggling',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showLabel: false,
    cycleThrough: 'mode',
  },
};

export const IconVariant: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showLabel: false,
    cycleThrough: 'mode',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only theme toggle that cycles through light/dark/system modes.',
      },
    },
  },
};

export const ButtonVariant: Story = {
  args: {
    variant: 'button',
    size: 'md',
    showLabel: true,
    cycleThrough: 'mode',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button variant with label showing current theme mode.',
      },
    },
  },
};

export const SwitchVariant: Story = {
  args: {
    variant: 'switch',
    size: 'md',
    showLabel: true,
    cycleThrough: 'lightDark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle switch variant for simple light/dark switching.',
      },
    },
  },
};

export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    size: 'sm',
    showLabel: true,
    cycleThrough: 'mode',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant for tight spaces with small text.',
      },
    },
  },
};

export const LightDarkToggle: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showLabel: false,
    cycleThrough: 'lightDark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple light/dark toggle without system mode.',
      },
    },
  },
};

export const ThemeCycler: Story = {
  args: {
    variant: 'button',
    size: 'md',
    showLabel: true,
    cycleThrough: 'themes',
  },
  parameters: {
    docs: {
      description: {
        story: 'Cycles through all available themes instead of just modes.',
      },
    },
  },
};

export const WithCustomIcons: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showLabel: false,
    cycleThrough: 'mode',
    customIcons: {
      light: '🌞',
      dark: '🌙',
      system: '💻',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle with custom emoji icons.',
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeToggle variant="icon" size="sm" showLabel={false} />
      <ThemeToggle variant="icon" size="md" showLabel={false} />
      <ThemeToggle variant="icon" size="lg" showLabel={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Theme toggles in different sizes (small, medium, large).',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Icon Variant</h3>
        <ThemeToggle variant="icon" size="md" showLabel={false} cycleThrough="mode" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Button Variant</h3>
        <ThemeToggle variant="button" size="md" showLabel={true} cycleThrough="mode" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Switch Variant</h3>
        <ThemeToggle variant="switch" size="md" showLabel={true} cycleThrough="lightDark" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Compact Variant</h3>
        <ThemeToggle variant="compact" size="sm" showLabel={true} cycleThrough="mode" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all theme toggle variants in one view.',
      },
    },
  },
};

export const CycleModes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Mode Cycling (Light → Dark → System)</h4>
        <ThemeToggle variant="button" showLabel={true} cycleThrough="mode" />
      </div>

      <div>
        <h4 className="font-medium mb-2">Light/Dark Toggle</h4>
        <ThemeToggle variant="button" showLabel={true} cycleThrough="lightDark" />
      </div>

      <div>
        <h4 className="font-medium mb-2">Theme Cycling</h4>
        <ThemeToggle variant="button" showLabel={true} cycleThrough="themes" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different cycling modes for theme toggling.',
      },
    },
  },
};

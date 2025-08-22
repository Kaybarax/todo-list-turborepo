import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from '../../../theme';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Theme/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A flexible theme switcher component that supports multiple variants and works with both DaisyUI themes and custom theme configurations.

## Features
- **Multiple Variants**: Select, dropdown, and button group layouts
- **Theme Grouping**: Organize themes by light/dark categories
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Support for custom theme lists and styling

## Usage Guidelines
- Use the **select** variant for forms and settings pages
- Use the **dropdown** variant for navigation bars and headers
- Use the **buttons** variant for prominent theme switching
- Enable **groupThemes** for better organization with many themes
- Use **showLabel** based on available space and context

## Accessibility
- Keyboard navigation with arrow keys and Enter
- Screen reader announcements for theme changes
- Focus management and visible focus indicators
- Semantic HTML with proper ARIA attributes`,
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
      options: ['select', 'dropdown', 'buttons'],
      description: 'The visual variant of the theme switcher',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the theme switcher',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the "Theme" label',
    },
    groupThemes: {
      control: 'boolean',
      description: 'Whether to group themes by light/dark categories',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  args: {
    variant: 'select',
    size: 'md',
    showLabel: true,
    groupThemes: true,
  },
};

export const SelectVariant: Story = {
  args: {
    variant: 'select',
    size: 'md',
    showLabel: true,
    groupThemes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Select dropdown variant with grouped themes and label.',
      },
    },
  },
};

export const DropdownVariant: Story = {
  args: {
    variant: 'dropdown',
    size: 'md',
    showLabel: false,
    groupThemes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown button variant with grouped themes, no label.',
      },
    },
  },
};

export const ButtonsVariant: Story = {
  args: {
    variant: 'buttons',
    size: 'md',
    showLabel: true,
    groupThemes: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button group variant showing first 6 themes with overflow dropdown.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    variant: 'select',
    size: 'sm',
    showLabel: true,
    groupThemes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant of the theme switcher.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'dropdown',
    size: 'lg',
    showLabel: false,
    groupThemes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant of the theme switcher.',
      },
    },
  },
};

export const WithoutLabel: Story = {
  args: {
    variant: 'select',
    size: 'md',
    showLabel: false,
    groupThemes: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher without label for compact layouts.',
      },
    },
  },
};

export const UngroupedThemes: Story = {
  args: {
    variant: 'dropdown',
    size: 'md',
    showLabel: false,
    groupThemes: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher with ungrouped themes in a flat list.',
      },
    },
  },
};

export const CustomThemes: Story = {
  args: {
    variant: 'select',
    size: 'md',
    showLabel: true,
    groupThemes: false,
    customThemes: ['light', 'dark', 'cupcake', 'synthwave', 'retro'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher with a custom subset of themes.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Variant</h3>
        <ThemeSwitcher variant="select" size="md" showLabel={true} groupThemes={true} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Dropdown Variant</h3>
        <ThemeSwitcher variant="dropdown" size="md" showLabel={false} groupThemes={true} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Buttons Variant</h3>
        <ThemeSwitcher variant="buttons" size="md" showLabel={true} groupThemes={false} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all theme switcher variants in one view.',
      },
    },
  },
};

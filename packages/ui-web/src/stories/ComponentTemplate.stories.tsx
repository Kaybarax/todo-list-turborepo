import { type Meta, type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

// TODO: Replace with actual component import
// import { ComponentName } from '../components/ComponentName';

// TODO: Replace with actual component interface
interface ComponentNameProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

// TODO: Remove this mock component and import the real one
const ComponentName: React.FC<ComponentNameProps> = ({
  children = 'Component',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  ...props
}) => (
  <button
    className={`component-${variant} component-${size} ${className}`}
    disabled={disabled || isLoading}
    onClick={onClick}
    {...props}
  >
    {isLoading ? 'Loading...' : children}
  </button>
);

const meta = {
  title: 'Templates/ComponentTemplate',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is a template for creating component stories. Replace ComponentName with your actual component and update all the props and stories accordingly.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Content to display inside the component',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual variant of the component',
      table: {
        type: { summary: 'primary | secondary | outline' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the component is in loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when component is clicked',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required: Default story showing the component in its most basic state
export const Default: Story = {
  args: {
    children: 'Default Component',
  },
};

// Variant stories - show each visual variant
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Variant',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Variant',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Variant',
  },
};

// Size stories - show each size option
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Size',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Size',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Size',
  },
};

// State stories - show different component states
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled State',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading State',
  },
};

// Composition story - show multiple variants together
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-2">
        <ComponentName variant="primary">Primary</ComponentName>
        <ComponentName variant="secondary">Secondary</ComponentName>
        <ComponentName variant="outline">Outline</ComponentName>
      </div>
      <div className="space-x-2">
        <ComponentName size="sm">Small</ComponentName>
        <ComponentName size="md">Medium</ComponentName>
        <ComponentName size="lg">Large</ComponentName>
      </div>
      <div className="space-x-2">
        <ComponentName disabled>Disabled</ComponentName>
        <ComponentName isLoading>Loading</ComponentName>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison showing all component variants, sizes, and states.',
      },
    },
  },
};

// Interactive story - demonstrate component behavior
export const Interactive: Story = {
  render: function InteractiveRender() {
    const [clickCount, setClickCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = () => {
      setIsLoading(true);
      // Simulate async operation
      setTimeout(() => {
        setClickCount(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <div className="space-y-4 text-center">
        <p>Clicked {clickCount} times</p>
        <ComponentName onClick={handleClick} isLoading={isLoading}>
          {isLoading ? 'Processing...' : 'Click Me'}
        </ComponentName>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example demonstrating component behavior and state management.',
      },
    },
  },
};

// Accessibility story - demonstrate accessibility features
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Accessible component example',
    children: 'Accessible Component',
  },
  render: args => (
    <div>
      <label htmlFor="component-demo" className="block mb-2">
        Component with proper labeling:
      </label>
      <ComponentName {...args} />
      <p className="mt-2 text-sm text-gray-600">
        This component includes proper ARIA labels and can be navigated with keyboard. Try using Tab to focus and
        Enter/Space to activate.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates proper accessibility attributes and keyboard navigation support.',
      },
    },
  },
};

// Responsive story - show how component behaves at different screen sizes
export const ResponsiveDemo: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <ComponentName className="w-full">Full Width</ComponentName>
      <ComponentName className="w-1/2">Half Width</ComponentName>
      <ComponentName className="w-1/4">Quarter Width</ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component adapts to different container widths.',
      },
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
};

// Dark mode story - test component in dark theme
export const DarkMode: Story = {
  args: {
    children: 'Dark Mode Component',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Component appearance in dark mode theme.',
      },
    },
  },
};

// Error state story - show component with error
export const WithError: Story = {
  args: {
    children: 'Component with Error',
    // Add error-related props here
    className: 'border-red-500 text-red-600',
  },
  render: args => (
    <div>
      <ComponentName {...args} />
      <p className="mt-1 text-sm text-red-600">Error message would appear here</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component in error state with error message.',
      },
    },
  },
};

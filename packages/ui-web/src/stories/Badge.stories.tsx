import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small badge component for displaying status, labels, or counts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    asChild: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// With different content
export const WithNumber: Story = {
  args: {
    children: '42',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="mr-1">🔥</span>
        Hot
      </>
    ),
  },
};

export const WithDot: Story = {
  args: {
    children: (
      <>
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Online
      </>
    ),
  },
};

// Status badges
export const Success: Story = {
  args: {
    variant: 'outline',
    className: 'border-green-500 text-green-700',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'outline',
    className: 'border-yellow-500 text-yellow-700',
    children: 'Warning',
  },
};

export const Info: Story = {
  args: {
    variant: 'outline',
    className: 'border-blue-500 text-blue-700',
    children: 'Info',
  },
};

// Sizes (using custom classes)
export const Small: Story = {
  args: {
    className: 'text-xs px-1.5 py-0.5',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    className: 'text-sm px-3 py-1',
    children: 'Large',
  },
};

// Interactive badge
export const Clickable: Story = {
  args: {
    asChild: true,
    children: (
      <button onClick={() => alert('Badge clicked!')}>
        Clickable
      </button>
    ),
  },
};

// Badge with close button
export const WithCloseButton: Story = {
  args: {
    children: (
      <>
        Tag Name
        <button 
          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
          onClick={() => alert('Remove tag')}
        >
          ×
        </button>
      </>
    ),
  },
};

// Visual regression test: All badge variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      
      <Badge>123</Badge>
      <Badge variant="secondary">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
        Online
      </Badge>
      <Badge variant="outline">
        🔥 Hot
      </Badge>
      
      <Badge className="border-green-500 text-green-700" variant="outline">
        Success
      </Badge>
      <Badge className="border-yellow-500 text-yellow-700" variant="outline">
        Warning
      </Badge>
      <Badge className="border-blue-500 text-blue-700" variant="outline">
        Info
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual regression test showing all badge variants and styles.',
      },
    },
  },
};

// Badge groups
export const BadgeGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">TypeScript</Badge>
        <Badge variant="outline">Tailwind</Badge>
        <Badge variant="outline">Storybook</Badge>
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Badge>New</Badge>
        <Badge variant="secondary">Updated</Badge>
        <Badge variant="destructive">Deprecated</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span>Status:</span>
        <Badge className="border-green-500 text-green-700" variant="outline">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Active
        </Badge>
      </div>
    </div>
  ),
};

// In different contexts
export const InCard: Story = {
  render: () => (
    <div className="border rounded-lg p-4 w-80">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Project Name</h3>
        <Badge>Active</Badge>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        This is a sample project description.
      </p>
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className="text-xs">React</Badge>
        <Badge variant="outline" className="text-xs">TypeScript</Badge>
        <Badge variant="outline" className="text-xs">Tailwind</Badge>
      </div>
    </div>
  ),
};

// Dark mode test
export const DarkMode: Story = {
  args: {
    children: 'Dark Badge',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Responsive test
export const ResponsiveTest: Story = {
  render: () => (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge>Responsive</Badge>
        <Badge variant="secondary">Badge</Badge>
        <Badge variant="outline">Layout</Badge>
        <Badge variant="destructive">Test</Badge>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
};
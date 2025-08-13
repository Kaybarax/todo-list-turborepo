import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from '../components/Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with support for icons, validation states, and accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    asChild: {
      control: { type: 'boolean' },
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// Input types
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// With value
export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
    placeholder: 'Enter text...',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input...',
    value: 'Cannot edit this',
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'Enter valid email...',
    value: 'invalid-email',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <span>🔍</span>,
    placeholder: 'Search...',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <span>✉️</span>,
    placeholder: 'Enter email...',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <span>👤</span>,
    rightIcon: <span>✓</span>,
    placeholder: 'Username...',
    value: 'john_doe',
  },
};

// With helper text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your name...',
    helperText: 'This will be displayed publicly',
  },
};

export const WithErrorHelperText: Story = {
  args: {
    error: true,
    placeholder: 'Enter valid email...',
    value: 'invalid-email',
    helperText: 'Please enter a valid email address',
  },
};

// With label
export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name...',
  },
};

export const CompleteInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email...',
    helperText: 'We will never share your email',
    leftIcon: <span>✉️</span>,
  },
};

export const CompleteInputWithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email...',
    value: 'invalid-email',
    error: true,
    helperText: 'Please enter a valid email address',
    leftIcon: <span>✉️</span>,
  },
};

// Visual regression test: All input variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Default input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input disabled placeholder="Disabled input" />
      <Input error placeholder="Error input" />
      <Input leftIcon={<span>🔍</span>} placeholder="With left icon" />
      <Input rightIcon={<span>✓</span>} placeholder="With right icon" />
      <Input leftIcon={<span>👤</span>} rightIcon={<span>✓</span>} placeholder="With both icons" />
      <div>
        <Input label="Complete Input" placeholder="With label and helper" helperText="This is helper text" />
      </div>
      <div>
        <Input label="Error Input" error placeholder="With error state" helperText="This is an error message" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual regression test showing all input variants and states.',
      },
    },
  },
};

// Form context
export const InFormContext: Story = {
  render: () => (
    <form className="space-y-4 w-80">
      <div>
        <Input label="First Name" placeholder="Enter first name..." required />
      </div>
      <div>
        <Input label="Last Name" placeholder="Enter last name..." required />
      </div>
      <div>
        <Input label="Email" type="email" placeholder="Enter email..." leftIcon={<span>✉️</span>} required />
      </div>
      <div>
        <Input label="Phone" type="tel" placeholder="Enter phone number..." helperText="Include country code" />
      </div>
    </form>
  ),
};

// Dark mode test
export const DarkMode: Story = {
  args: {
    placeholder: 'Dark mode input...',
    label: 'Dark Mode Input',
    helperText: 'Input in dark theme',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Responsive test
export const ResponsiveTest: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <Input placeholder="Full width input" className="w-full" />
      <Input placeholder="75% width input" className="w-3/4" />
      <Input placeholder="50% width input" className="w-1/2" />
      <Input placeholder="25% width input" className="w-1/4" />
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

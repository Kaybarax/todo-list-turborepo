import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from '@storybook/test';

import { TodoForm } from '../components/todo/TodoForm/TodoForm';

const meta: Meta<typeof TodoForm> = {
  title: 'Todo/TodoForm',
  component: TodoForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A reusable form component for creating and editing todos with customizable validation and styling.

## Features
- **Multiple Variants**: Default, compact, and inline layouts
- **Form Validation**: Client-side validation with error messages
- **Tag Management**: Add and remove tags with keyboard support
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Built-in loading and disabled states

## Usage Examples

### Basic Usage
\`\`\`tsx
<TodoForm onSubmit={(data) => console.log(data)} />
\`\`\`

### With Initial Data (Edit Mode)
\`\`\`tsx
<TodoForm 
  onSubmit={(data) => console.log(data)}
  initialData={{
    title: "Existing Todo",
    priority: "high",
    tags: ["work", "urgent"]
  }}
/>
\`\`\`

### Inline Variant
\`\`\`tsx
<TodoForm 
  variant="inline"
  onSubmit={(data) => console.log(data)}
  onCancel={() => console.log("cancelled")}
/>
\`\`\`

## Accessibility
- All form fields have proper labels and ARIA attributes
- Error messages are announced to screen readers
- Full keyboard navigation support
- Focus management for tag removal buttons
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline'],
      description: 'The visual layout variant of the form',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the form elements',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the form is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the form is in a loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onSubmit: {
      action: 'submitted',
      description: 'Function called when the form is submitted with valid data',
      table: {
        type: { summary: '(data: TodoFormData) => void' },
      },
    },
    onCancel: {
      action: 'cancelled',
      description: 'Optional function called when the form is cancelled',
      table: {
        type: { summary: '() => void' },
      },
    },
    initialData: {
      control: 'object',
      description: 'Initial data to populate the form (for editing existing todos)',
      table: {
        type: { summary: 'Partial<TodoFormData>' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoForm>;

// Basic Variants
export const Default: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default form layout with all fields visible and proper spacing.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'compact',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'A compact layout with reduced spacing and simplified fields, ideal for space-constrained interfaces.',
      },
    },
  },
};

export const Inline: Story = {
  args: {
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    variant: 'inline',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'An inline layout with horizontal arrangement, perfect for quick todo entry.',
      },
    },
  },
};

// Size Variants
export const Small: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant with reduced text and element sizes.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant with increased text and element sizes for better accessibility.',
      },
    },
  },
};

// Data States
export const WithInitialData: Story = {
  args: {
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    variant: 'default',
    size: 'md',
    initialData: {
      title: 'Complete project documentation',
      description:
        'Write comprehensive documentation for the new feature including API docs, user guides, and examples.',
      priority: 'high',
      dueDate: '2024-12-31',
      tags: ['documentation', 'high-priority', 'project'],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Form populated with initial data for editing an existing todo. Notice how the submit button text changes to "Update Todo".',
      },
    },
  },
};

export const EmptyForm: Story = {
  args: {
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty form for creating a new todo with cancel option.',
      },
    },
  },
};

// Interactive States
export const Loading: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    loading: true,
    initialData: {
      title: 'Saving todo...',
      priority: 'medium',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Form in loading state with disabled inputs and loading spinner on submit button.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    disabled: true,
    initialData: {
      title: 'Read-only todo',
      description: 'This todo cannot be edited',
      priority: 'low',
      tags: ['readonly'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled form state where all inputs are non-interactive.',
      },
    },
  },
};

// Priority Variants
export const HighPriorityTodo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    initialData: {
      title: 'Critical bug fix',
      description: 'Fix the authentication issue in production',
      priority: 'high',
      dueDate: '2024-01-15',
      tags: ['urgent', 'bug', 'production'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a high-priority todo with urgent tags and near due date.',
      },
    },
  },
};

export const LowPriorityTodo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    initialData: {
      title: 'Organize desk',
      description: 'Clean and organize the workspace',
      priority: 'low',
      tags: ['personal', 'cleanup'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a low-priority todo with personal tags.',
      },
    },
  },
};

// Validation Stories
export const ValidationDemo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try submitting without a title to see validation in action. The form validates required fields and shows error messages.',
      },
    },
  },
};

export const TagManagementDemo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
    initialData: {
      title: 'Learn React',
      tags: ['learning', 'react'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates tag management functionality. Try adding new tags or removing existing ones.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Add a new tag
    const tagInput = canvas.getByPlaceholderText('Add a tag');
    await userEvent.type(tagInput, 'javascript');
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));

    // Verify tag was added
    await expect(canvas.getByText('javascript')).toBeInTheDocument();
  },
};

// Accessibility Stories
export const AccessibilityDemo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features. Try navigating with Tab key and using screen reader. All form elements have proper labels and ARIA attributes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check accessibility attributes
    const titleInput = canvas.getByLabelText('Title *');
    await expect(titleInput).toHaveAttribute('required');
    await expect(titleInput).toHaveAttribute('aria-label', 'Todo title');

    const descriptionTextarea = canvas.getByLabelText('Description');
    await expect(descriptionTextarea).toBeInTheDocument();

    const prioritySelect = canvas.getByLabelText('Priority');
    await expect(prioritySelect).toBeInTheDocument();
  },
};

// Error States
export const WithValidationErrors: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows various validation error states that can occur during form submission.',
      },
    },
  },
};

// Responsive Design
export const ResponsiveDemo: Story = {
  args: {
    onSubmit: action('onSubmit'),
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The form adapts to different screen sizes. On smaller screens, the priority and due date fields stack vertically.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

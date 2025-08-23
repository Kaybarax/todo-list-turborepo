import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoForm } from '../../../../lib/components/todo/TodoForm/TodoForm';

const meta: Meta<typeof TodoForm> = {
  title: 'Todo/TodoForm',
  component: TodoForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive form component for creating and editing todos with validation, tag management, and multiple layout variants. Supports inline, compact, and default layouts with full accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline'],
      description:
        'Form layout variant - default for full form, compact for reduced spacing, inline for single-row layout',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size and spacing scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all form inputs',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state with spinner',
    },
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof TodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample initial data for editing scenarios
const sampleTodoData: Partial<TodoFormData> = {
  title: 'Complete project documentation',
  description: 'Write comprehensive documentation for the new feature including API docs and user guides.',
  priority: 'high',
  dueDate: '2024-12-31',
  tags: ['documentation', 'urgent', 'project'],
};

const simpleTodoData: Partial<TodoFormData> = {
  title: 'Simple todo item',
  priority: 'medium',
  tags: ['work'],
};

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default form layout with all fields visible and full functionality.',
      },
    },
  },
};

export const WithInitialData: Story = {
  args: {
    initialData: sampleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form pre-populated with existing todo data for editing scenarios.',
      },
    },
  },
};

export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    initialData: simpleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout with reduced spacing and simplified fields, ideal for modal dialogs or tight spaces.',
      },
    },
  },
};

export const InlineVariant: Story = {
  args: {
    variant: 'inline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline layout for quick todo creation with minimal form fields in a single row.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    initialData: sampleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form in loading state showing spinner and disabled inputs during submission.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    initialData: sampleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with all inputs disabled, useful for read-only or permission-restricted scenarios.',
      },
    },
  },
};

export const WithoutCancel: Story = {
  args: {
    initialData: sampleTodoData,
    // onCancel not provided
  },
  parameters: {
    docs: {
      description: {
        story: 'Form without cancel button when onCancel callback is not provided.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    initialData: simpleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with small text size and reduced spacing.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    initialData: sampleTodoData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with large text size and increased spacing for better visibility.',
      },
    },
  },
};

export const WithManyTags: Story = {
  args: {
    initialData: {
      title: 'Todo with many tags',
      description: 'This todo demonstrates the tag management functionality with multiple tags.',
      priority: 'medium',
      tags: ['frontend', 'backend', 'testing', 'documentation', 'urgent', 'feature', 'bug-fix', 'review'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with multiple tags to demonstrate tag management and removal functionality.',
      },
    },
  },
};

export const AllPriorities: Story = {
  render: args => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Low Priority</h3>
        <TodoForm
          {...args}
          onSubmit={fn()}
          initialData={{ ...sampleTodoData, priority: 'low', title: 'Low priority task' }}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Priority</h3>
        <TodoForm
          {...args}
          onSubmit={fn()}
          initialData={{ ...sampleTodoData, priority: 'medium', title: 'Medium priority task' }}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">High Priority</h3>
        <TodoForm
          {...args}
          onSubmit={fn()}
          initialData={{ ...sampleTodoData, priority: 'high', title: 'High priority task' }}
        />
      </div>
    </div>
  ),
  args: {
    onSubmit: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of forms with different priority levels selected.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: args => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <TodoForm {...args} onSubmit={fn()} variant="default" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Variant</h3>
        <TodoForm {...args} onSubmit={fn()} variant="compact" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Inline Variant</h3>
        <TodoForm {...args} onSubmit={fn()} variant="inline" />
      </div>
    </div>
  ),
  args: {
    onSubmit: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all available form variants.',
      },
    },
  },
};

export const ValidationDemo: Story = {
  render: args => {
    const handleSubmit = (data: TodoFormData) => {
      console.log('Form submitted:', data);
      // Simulate validation by showing alert
      alert(`Todo "${data.title}" created with priority: ${data.priority}`);
    };

    return (
      <div className="space-y-4">
        <div className="alert alert-info">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">
            Try submitting with empty title or very long content to see validation in action.
          </span>
        </div>
        <TodoForm {...args} onSubmit={handleSubmit} />
      </div>
    );
  },
  args: {
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive form demonstrating validation behavior. Try submitting with invalid data to see error messages.',
      },
    },
  },
};

export const InteractiveTagManagement: Story = {
  render: args => {
    return (
      <div className="space-y-4">
        <div className="alert alert-info">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">
            Type in the tags field and press Enter or click Add to add tags. Click × on tags to remove them.
          </span>
        </div>
        <TodoForm
          {...args}
          onSubmit={fn()}
          initialData={{
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the new features',
            priority: 'medium',
            tags: ['documentation', 'project'],
          }}
        />
      </div>
    );
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of tag management functionality. Add and remove tags to see the behavior.',
      },
    },
  },
};

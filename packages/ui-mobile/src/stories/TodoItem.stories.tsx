import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

// Web-compatible TodoItem component for Storybook
export type TodoItemPriority = 'low' | 'medium' | 'high';

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onPress?: (id: string) => void;
  priority?: TodoItemPriority;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, description, completed, onToggle, onPress, priority }) => {
  // Theme colors matching the React Native theme
  const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    dark: '#1C1C1E',
    medium: '#8E8E93',
    light: '#F2F2F7',
    white: '#FFFFFF',
    black: '#000000',
    background: '#F9F9F9',
    card: '#FFFFFF',
    text: '#000000',
    border: '#CECED2',
  };

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const borderRadius = {
    sm: 8,
    md: 12,
    round: 9999,
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.medium;
    }
  };

  const handleToggle = () => {
    onToggle(id);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.18)',
    marginBottom: spacing.xs,
    cursor: onPress ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${colors.border}`,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '400px',
    width: '100%',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    marginRight: spacing.md,
    cursor: 'pointer',
  };

  const checkboxStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    border: `2px solid ${colors.primary}`,
    backgroundColor: completed ? colors.primary : 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease-in-out',
  };

  const checkmarkStyle: React.CSSProperties = {
    width: 12,
    height: 6,
    borderLeft: `2px solid ${colors.white}`,
    borderBottom: `2px solid ${colors.white}`,
    transform: 'rotate(-45deg)',
    opacity: completed ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
  };

  const contentContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: fontSizes.md,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out',
    margin: 0,
    padding: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.medium,
    marginTop: spacing.xs,
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out',
    margin: 0,
    padding: 0,
    lineHeight: 1.4,
  };

  const priorityIndicatorStyle: React.CSSProperties = {
    width: 12,
    height: 12,
    borderRadius: borderRadius.round,
    backgroundColor: getPriorityColor(),
    marginLeft: spacing.sm,
    flexShrink: 0,
  };

  return (
    <div style={containerStyle} onClick={handlePress}>
      <div
        style={checkboxContainerStyle}
        onClick={e => {
          e.stopPropagation();
          handleToggle();
        }}
      >
        <div style={checkboxStyle}>
          <div style={checkmarkStyle} />
        </div>
      </div>

      <div style={contentContainerStyle}>
        <div style={titleRowStyle}>
          <p style={titleStyle}>{title}</p>
          {priority && <div style={priorityIndicatorStyle} />}
        </div>

        {description && <p style={descriptionStyle}>{description}</p>}
      </div>
    </div>
  );
};

const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A todo item component with checkbox, title, description, priority indicator, and interactive states for mobile interfaces (web preview)',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Unique identifier for the todo item',
    },
    title: {
      control: { type: 'text' },
      description: 'Title text of the todo item',
    },
    description: {
      control: { type: 'text' },
      description: 'Optional description text for the todo item',
    },
    completed: {
      control: { type: 'boolean' },
      description: 'Whether the todo item is completed',
    },
    priority: {
      control: { type: 'select' },
      options: [undefined, 'low', 'medium', 'high'],
      description: 'Priority level of the todo item',
    },
    onToggle: { action: 'toggled' },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    id: '1',
    title: 'Sample Todo Item',
    completed: false,
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

// State stories
export const Incomplete: Story = {
  args: {
    id: '1',
    title: 'Buy groceries',
    description: 'Get milk, bread, and eggs from the store',
    completed: false,
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const Complete: Story = {
  args: {
    id: '2',
    title: 'Finish project documentation',
    description: 'Write comprehensive docs for the new feature',
    completed: true,
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const WithoutDescription: Story = {
  args: {
    id: '3',
    title: 'Call dentist',
    completed: false,
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const LongTitle: Story = {
  args: {
    id: '4',
    title: 'This is a very long todo item title that should be truncated properly to fit within the container',
    description: 'This is also a long description that demonstrates how the component handles longer text content',
    completed: false,
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

// Priority stories
export const LowPriority: Story = {
  args: {
    id: '5',
    title: 'Organize desk',
    description: 'Clean up and organize workspace',
    completed: false,
    priority: 'low',
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const MediumPriority: Story = {
  args: {
    id: '6',
    title: 'Review pull request',
    description: 'Check the new feature implementation',
    completed: false,
    priority: 'medium',
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const HighPriority: Story = {
  args: {
    id: '7',
    title: 'Fix critical bug',
    description: 'Address the production issue immediately',
    completed: false,
    priority: 'high',
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

export const CompletedHighPriority: Story = {
  args: {
    id: '8',
    title: 'Deploy hotfix',
    description: 'Emergency deployment completed successfully',
    completed: true,
    priority: 'high',
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
};

// Interactive examples
export const InteractiveToggle: Story = {
  render: () => {
    const [completed, setCompleted] = React.useState(false);

    const handleToggle = () => {
      setCompleted(!completed);
    };

    return (
      <TodoItem
        id="interactive-1"
        title="Interactive Todo Item"
        description="Click the checkbox to toggle completion state"
        completed={completed}
        priority="medium"
        onToggle={handleToggle}
        onPress={id => console.log('Pressed todo:', id)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing toggle functionality',
      },
    },
  },
};

export const EditingState: Story = {
  render: () => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState('Click to edit this todo');
    const [tempTitle, setTempTitle] = React.useState(title);

    const handlePress = () => {
      if (!isEditing) {
        setIsEditing(true);
        setTempTitle(title);
      }
    };

    const handleSave = () => {
      setTitle(tempTitle);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempTitle(title);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <input
            type="text"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #007AFF',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              outline: 'none',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#34C759',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8E8E93',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <TodoItem
        id="editing-1"
        title={title}
        description="Click on this todo to edit it"
        completed={false}
        priority="low"
        onToggle={id => console.log('Toggled todo:', id)}
        onPress={handlePress}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing editing functionality with mobile-friendly input',
      },
    },
  },
};

// Mobile-specific interaction examples
export const MobileGestureExample: Story = {
  render: () => {
    const [todos, setTodos] = React.useState([
      {
        id: '1',
        title: 'Swipe gestures demo',
        description: 'This simulates mobile swipe interactions',
        completed: false,
        priority: 'medium' as TodoItemPriority,
      },
      {
        id: '2',
        title: 'Long press actions',
        description: 'Hold to see context menu (simulated)',
        completed: true,
        priority: 'low' as TodoItemPriority,
      },
      {
        id: '3',
        title: 'Touch feedback',
        description: 'Visual feedback on touch interactions',
        completed: false,
        priority: 'high' as TodoItemPriority,
      },
    ]);

    const [longPressTimer, setLongPressTimer] = React.useState<NodeJS.Timeout | null>(null);
    const [showContextMenu, setShowContextMenu] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
      setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    };

    const handleMouseDown = (id: string) => {
      const timer = setTimeout(() => {
        setShowContextMenu(id);
      }, 500); // Simulate long press
      setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    };

    const handleContextAction = (action: string, id: string) => {
      console.log(`${action} todo:`, id);
      setShowContextMenu(null);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', width: '100%' }}>
        <div
          style={{
            fontSize: '14px',
            color: '#8E8E93',
            marginBottom: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Mobile Interactions Demo:
          <br />• Tap checkbox to toggle
          <br />• Tap item to select
          <br />• Hold item for context menu
        </div>

        {todos.map(todo => (
          <div key={todo.id} style={{ position: 'relative' }}>
            <div
              onMouseDown={() => handleMouseDown(todo.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: showContextMenu === todo.id ? 'scale(0.98)' : 'scale(1)',
                transition: 'transform 0.1s ease-in-out',
              }}
            >
              <TodoItem
                id={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                priority={todo.priority}
                onToggle={handleToggle}
                onPress={id => console.log('Selected todo:', id)}
              />
            </div>

            {showContextMenu === todo.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #CECED2',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                  padding: '8px',
                  display: 'flex',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                <button
                  onClick={() => handleContextAction('Edit', todo.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleContextAction('Delete', todo.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#FF3B30',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowContextMenu(null)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#8E8E93',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile-specific interactions including long press context menu and touch feedback',
      },
    },
  },
};

// Priority comparison
export const AllPriorities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', width: '100%' }}>
      <TodoItem
        id="priority-1"
        title="Low priority task"
        description="This can be done when you have time"
        completed={false}
        priority="low"
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
      <TodoItem
        id="priority-2"
        title="Medium priority task"
        description="Should be done soon"
        completed={false}
        priority="medium"
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
      <TodoItem
        id="priority-3"
        title="High priority task"
        description="Needs immediate attention"
        completed={false}
        priority="high"
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
      <TodoItem
        id="priority-4"
        title="No priority task"
        description="Standard priority level"
        completed={false}
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all priority levels with visual indicators',
      },
    },
  },
};

// Completion states
export const CompletionStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', width: '100%' }}>
      <TodoItem
        id="state-1"
        title="Incomplete task"
        description="This task is not yet completed"
        completed={false}
        priority="medium"
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
      <TodoItem
        id="state-2"
        title="Completed task"
        description="This task has been finished"
        completed={true}
        priority="medium"
        onToggle={id => console.log('Toggled:', id)}
        onPress={id => console.log('Pressed:', id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of completed vs incomplete states showing visual differences',
      },
    },
  },
};

// Real-world todo list example
export const TodoList: Story = {
  render: () => {
    const [todos, setTodos] = React.useState([
      {
        id: '1',
        title: 'Review code changes',
        description: 'Check the new authentication module',
        completed: false,
        priority: 'high' as TodoItemPriority,
      },
      {
        id: '2',
        title: 'Update documentation',
        description: 'Add examples for the new API endpoints',
        completed: false,
        priority: 'medium' as TodoItemPriority,
      },
      {
        id: '3',
        title: 'Fix responsive layout',
        description: 'Mobile view needs adjustment',
        completed: true,
        priority: 'low' as TodoItemPriority,
      },
      {
        id: '4',
        title: 'Team standup meeting',
        description: 'Daily sync at 9:00 AM',
        completed: true,
        priority: 'medium' as TodoItemPriority,
      },
      {
        id: '5',
        title: 'Grocery shopping',
        description: 'Buy ingredients for dinner',
        completed: false,
        priority: 'low' as TodoItemPriority,
      },
    ]);

    const handleToggle = (id: string) => {
      setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    };

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    return (
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#F2F2F7',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#000000' }}>My Todo List</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#8E8E93' }}>
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              description={todo.description}
              completed={todo.completed}
              priority={todo.priority}
              onToggle={handleToggle}
              onPress={id => console.log('Selected todo:', id)}
            />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing a complete todo list with various states and priorities',
      },
    },
  },
};

// Accessibility example
export const AccessibilityExample: Story = {
  args: {
    id: 'accessible-todo',
    title: 'Accessible todo item',
    description: 'This todo demonstrates proper accessibility features',
    completed: false,
    priority: 'medium',
    onToggle: (id: string) => console.log('Toggled todo:', id),
    onPress: (id: string) => console.log('Pressed todo:', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Todo item with proper accessibility considerations for screen readers and keyboard navigation',
      },
    },
  },
};

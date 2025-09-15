import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import { Badge } from '../../lib/components/Badge/Badge';
import { ListItem } from '../../lib/components/ListItem/ListItem';
import { Switch } from '../../lib/components/Switch/Switch';

// Native-composed TodoItem using existing primitives

type Priority = 'low' | 'medium' | 'high';

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: Priority;

  onToggle: (id: string) => void;
}

const priorityBadgeProps = (priority?: Priority) => {
  if (!priority) return null;
  switch (priority) {
    case 'high':
      return { variant: 'danger' as const, text: 'HIGH' };
    case 'medium':
      return { variant: 'warning' as const, text: 'MED' };
    case 'low':
      return { variant: 'success' as const, text: 'LOW' };
  }
};

const NativeTodoItem: React.FC<TodoItemProps> = ({ id, title, description, completed, priority, onToggle }) => {
  return (
    <ListItem
      title={title}
      description={description}
      leading={<Switch value={completed} onValueChange={() => onToggle(id)} status={completed ? 'success' : 'basic'} />}
      trailing={priority ? <Badge size="small" {...priorityBadgeProps(priority)!} /> : undefined}
      onPress={() => onToggle(id)}
      accessibilityLabel={`${title}${completed ? ' (completed)' : ''}`}
    />
  );
};

const meta: Meta<typeof NativeTodoItem> = {
  title: 'Components/TodoItem',
  component: NativeTodoItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Native TodoItem composition using ListItem, Switch, and Badge components.' } },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    completed: { control: 'boolean' },
    priority: { control: { type: 'select' }, options: ['low', 'medium', 'high'] },
    onToggle: { action: 'toggled' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: '1', title: 'Sample Todo Item', description: 'Try toggling me', completed: false, priority: 'medium' },
};

export const Incomplete: Story = {
  args: { id: '2', title: 'Buy groceries', description: 'Milk, bread, eggs', completed: false, priority: 'low' },
};
export const Complete: Story = {
  args: { id: '3', title: 'Finish docs', description: 'Write API section', completed: true, priority: 'high' },
};
export const WithoutDescription: Story = { args: { id: '4', title: 'Call dentist', completed: false } };
export const LongTitle: Story = {
  args: {
    id: '5',
    title: 'Very long title that will truncate inside the list item layout as expected',
    description: 'Optional supporting text for the todo item component',
    completed: false,
    priority: 'medium',
  },
};
export const LowPriority: Story = {
  args: { id: '6', title: 'Organize desk', description: 'Workspace cleanup', completed: false, priority: 'low' },
};
export const MediumPriority: Story = {
  args: { id: '7', title: 'Review PR', description: 'Check new feature', completed: false, priority: 'medium' },
};
export const HighPriority: Story = {
  args: { id: '8', title: 'Fix critical bug', description: 'Production issue', completed: false, priority: 'high' },
};
export const CompletedHighPriority: Story = {
  args: { id: '9', title: 'Deploy hotfix', description: 'Emergency done', completed: true, priority: 'high' },
};

const InteractiveToggleComponent: React.FC = () => {
  const [completed, setCompleted] = React.useState(false);
  return (
    <NativeTodoItem
      id="interactive-1"
      title="Interactive Todo"
      description="Toggle me"
      completed={completed}
      priority="medium"
      onToggle={() => setCompleted(c => !c)}
    />
  );
};
export const InteractiveToggle: Story = { render: () => <InteractiveToggleComponent /> };

export const AllPriorities: Story = {
  render: () => (
    <React.Fragment>
      <NativeTodoItem
        id="p1"
        title="Low priority task"
        description="Can be done later"
        completed={false}
        priority="low"
        onToggle={() => {}}
      />
      <NativeTodoItem
        id="p2"
        title="Medium priority task"
        description="Do this soon"
        completed={false}
        priority="medium"
        onToggle={() => {}}
      />
      <NativeTodoItem
        id="p3"
        title="High priority task"
        description="Needs attention"
        completed={false}
        priority="high"
        onToggle={() => {}}
      />
    </React.Fragment>
  ),
};

export const CompletionStates: Story = {
  render: () => (
    <React.Fragment>
      <NativeTodoItem
        id="c1"
        title="Incomplete task"
        description="Not done yet"
        completed={false}
        priority="medium"
        onToggle={() => {}}
      />
      <NativeTodoItem
        id="c2"
        title="Completed task"
        description="Finished work"
        completed={true}
        priority="medium"
        onToggle={() => {}}
      />
    </React.Fragment>
  ),
};

export const AccessibilityExample: Story = {
  args: {
    id: 'a11y',
    title: 'Accessible todo item',
    description: 'Demonstrates accessibility label',
    completed: false,
    priority: 'medium',
  },
};

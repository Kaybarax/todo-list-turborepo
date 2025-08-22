import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const todoItemVariants = cva('card bg-base-100 shadow-sm', {
  variants: {
    variant: {
      default: 'card-normal',
      compact: 'card-compact',
      detailed: 'card-normal p-4',
    },
    priority: {
      low: 'border-l-4 border-l-success',
      medium: 'border-l-4 border-l-warning',
      high: 'border-l-4 border-l-error',
    },
    completed: {
      true: 'opacity-60',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    priority: 'medium',
    completed: false,
  },
});

export interface TodoData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blockchainNetwork?: string;
  transactionHash?: string;
  blockchainAddress?: string;
}

export interface TodoItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof todoItemVariants> {
  todo: TodoData;
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoData) => void;
  onDelete: (todoId: string) => void;
  onBlockchainSync?: (todoId: string, network: string) => void;
  showActions?: boolean;
  showBlockchainInfo?: boolean;
}

const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  (
    {
      className,
      variant = 'default',
      todo,
      onToggle,
      onEdit,
      onDelete,
      onBlockchainSync,
      showActions = true,
      showBlockchainInfo = true,
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    return (
      <div
        ref={ref}
        className={cn(
          todoItemVariants({
            variant,
            priority: todo.priority,
            completed: todo.completed,
          }),
          className,
        )}
        {...props}
      >
        <div className="card-body">
          <div className="placeholder-content p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            TodoItem component - Implementation pending migration
            <br />
            Todo: {todo.title}
          </div>
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';

export { TodoItem, todoItemVariants };

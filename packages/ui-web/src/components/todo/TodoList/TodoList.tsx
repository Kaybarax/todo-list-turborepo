import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';
import { TodoData } from '../TodoItem';

const todoListVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'space-y-4',
      compact: 'space-y-2',
      grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface TodoListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof todoListVariants> {
  todos: TodoData[];
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoData) => void;
  onDelete: (todoId: string) => void;
  onBlockchainSync?: (todoId: string, network: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  showStats?: boolean;
  showFilters?: boolean;
}

const TodoList = React.forwardRef<HTMLDivElement, TodoListProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      todos,
      onToggle,
      onEdit,
      onDelete,
      onBlockchainSync,
      loading = false,
      emptyState,
      showStats = true,
      showFilters = true,
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    return (
      <div ref={ref} className={cn(todoListVariants({ variant, size }), className)} {...props}>
        <div className="placeholder-content p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          TodoList component - Implementation pending migration
          <br />
          {todos.length} todos to display
        </div>
      </div>
    );
  },
);

TodoList.displayName = 'TodoList';

export { TodoList, todoListVariants };

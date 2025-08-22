import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const todoFormVariants = cva('form-control w-full', {
  variants: {
    variant: {
      default: 'space-y-4',
      compact: 'space-y-2',
      inline: 'flex flex-row space-x-2 space-y-0',
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

export interface TodoFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
}

export interface TodoFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    VariantProps<typeof todoFormVariants> {
  onSubmit: (todoData: TodoFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
  disabled?: boolean;
  loading?: boolean;
}

const TodoForm = React.forwardRef<HTMLFormElement, TodoFormProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      onSubmit,
      onCancel,
      initialData,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    return (
      <form
        ref={ref}
        className={cn(todoFormVariants({ variant, size }), className)}
        onSubmit={e => {
          e.preventDefault();
          // Form submission logic will be implemented during migration
          onSubmit({
            title: '',
            priority: 'medium',
            tags: [],
          });
        }}
        {...props}
      >
        <div className="placeholder-content p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          TodoForm component - Implementation pending migration
        </div>
      </form>
    );
  },
);

TodoForm.displayName = 'TodoForm';

export { TodoForm, todoFormVariants };

'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '../../../utils';
import { Badge } from '../../Badge';
import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox';
import { IconButton } from '../../IconButton';

const todoItemVariants = cva('card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow', {
  variants: {
    variant: {
      default: 'card-normal',
      compact: 'card-compact',
      detailed: 'card-normal',
    },
    completed: {
      true: 'opacity-75',
      false: '',
    },
    overdue: {
      true: 'border-error',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    completed: false,
    overdue: false,
  },
});

// Import blockchain types from services package
import { BlockchainNetwork } from '@todo/services';

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
  blockchainNetwork?: BlockchainNetwork;
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
  onBlockchainSync?: (todoId: string, network: BlockchainNetwork) => void;
  showActions?: boolean;
  showBlockchainInfo?: boolean;
  TransactionStatusComponent?: React.ComponentType<{
    transactionHash: string;
    network: BlockchainNetwork;
  }>;
  getNetworkDisplayInfo?: (network: BlockchainNetwork) => { displayName: string };
  supportedNetworks?: BlockchainNetwork[];
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
      TransactionStatusComponent,
      getNetworkDisplayInfo,
      supportedNetworks = [
        BlockchainNetwork.SOLANA,
        BlockchainNetwork.POLKADOT,
        BlockchainNetwork.POLYGON,
        BlockchainNetwork.MOONBEAM,
        BlockchainNetwork.BASE,
      ],
      ...props
    },
    ref,
  ) => {
    const [showActionsState, setShowActionsState] = useState(false);

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    const getNetworkDisplayName = (network: BlockchainNetwork) => {
      if (getNetworkDisplayInfo) {
        return getNetworkDisplayInfo(network).displayName;
      }
      // Fallback: capitalize first letter
      return network.charAt(0).toUpperCase() + network.slice(1);
    };

    const getPriorityVariant = (priority: string) => {
      switch (priority) {
        case 'high':
          return 'destructive';
        case 'medium':
          return 'default';
        case 'low':
          return 'secondary';
        default:
          return 'default';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          todoItemVariants({
            variant,
            completed: todo.completed,
            overdue: isOverdue,
          }),
          className,
        )}
        onMouseEnter={() => setShowActionsState(true)}
        onMouseLeave={() => setShowActionsState(false)}
        {...props}
      >
        <div className={variant === 'compact' ? 'card-body p-3' : 'card-body p-4'}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-sm font-medium ${
                    todo.completed ? 'line-through text-base-content/50' : 'text-base-content'
                  }`}
                >
                  {todo.title}
                </h3>

                {showActions && (showActionsState || variant === 'detailed') && (
                  <div className="flex items-center space-x-2">
                    <IconButton onClick={() => onEdit(todo)} variant="ghost" size="sm" title="Edit todo">
                      <Edit className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(todo.id)}
                      variant="ghost"
                      size="sm"
                      title="Delete todo"
                      className="hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                )}
              </div>

              {todo.description && variant !== 'compact' && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-base-content/40' : 'text-base-content/70'}`}>
                  {todo.description}
                </p>
              )}

              <div className="mt-2 flex items-center space-x-2 flex-wrap gap-1">
                <Badge variant={getPriorityVariant(todo.priority)}>{todo.priority}</Badge>

                {todo.dueDate && (
                  <Badge variant={isOverdue ? 'destructive' : 'outline'}>Due: {formatDate(todo.dueDate)}</Badge>
                )}

                {showBlockchainInfo && todo.blockchainNetwork && (
                  <Badge variant="secondary">{getNetworkDisplayName(todo.blockchainNetwork)}</Badge>
                )}

                {variant !== 'compact' &&
                  todo.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
              </div>

              {showBlockchainInfo && todo.transactionHash && todo.blockchainNetwork && TransactionStatusComponent && (
                <div className="mt-2">
                  <TransactionStatusComponent transactionHash={todo.transactionHash} network={todo.blockchainNetwork} />
                </div>
              )}

              {onBlockchainSync && !todo.blockchainNetwork && variant !== 'compact' && (
                <div className="mt-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary hover:text-primary-focus">
                      Sync to blockchain
                    </summary>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {supportedNetworks.map(network => (
                        <Button
                          key={network}
                          onClick={() => onBlockchainSync(todo.id, network)}
                          variant="outline"
                          size="sm"
                        >
                          {getNetworkDisplayName(network)}
                        </Button>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';

export { TodoItem, todoItemVariants };

'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Edit, Trash2 } from 'lucide-react';
import { cn, Badge, Button, Checkbox, IconButton } from '@todo/ui-web';
import { BlockchainNetwork } from '@todo/services';

const todoItemVariants = cva('card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow', {
  variants: {
    variant: {
      default: 'card-normal',
      compact: 'card-compact',
      detailed: 'card-normal',
    },
    completed: {
      true: 'opacity-60',
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
  supportedNetworks?: string[];
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
      supportedNetworks = [],
      ...props
    },
    ref,
  ) => {
    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    const getNetworkDisplayName = (network: BlockchainNetwork) => {
      return getNetworkDisplayInfo
        ? getNetworkDisplayInfo(network).displayName
        : network.charAt(0).toUpperCase() + network.slice(1);
    };

    const getPriorityVariant = (priority: string) => {
      switch (priority) {
        case 'high':
          return 'error';
        case 'medium':
          return 'warning';
        case 'low':
          return 'info';
        default:
          return 'success';
      }
    };

    const renderSyncButton = () => {
      if (!onBlockchainSync) return null;

      if (!supportedNetworks || supportedNetworks.length <= 1) {
        const network = (supportedNetworks?.[0] ?? 'solana') as BlockchainNetwork;
        return (
          <Button variant="outline" size="sm" onClick={() => onBlockchainSync(todo.id, network)}>
            Sync
          </Button>
        );
      }

      return (
        <div className="dropdown dropdown-top dropdown-end">
          <Button variant="outline" size="sm" tabIndex={0} role="button">
            Sync
          </Button>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
            {supportedNetworks.map(network => (
              <li key={network}>
                <a onClick={() => onBlockchainSync(todo.id, network as BlockchainNetwork)}>
                  {getNetworkDisplayName(network as BlockchainNetwork)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(todoItemVariants({ variant, completed: todo.completed, overdue: isOverdue, className }))}
        {...props}
      >
        <div className="card-body">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
            />
            <div className="flex-1">
              <h2 className={cn('card-title', { 'line-through': todo.completed })}>{todo.title}</h2>
              {todo.description && <p className="text-sm text-base-content/70 mt-1">{todo.description}</p>}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-base-content/70">
                <Badge variant={getPriorityVariant(todo.priority)} size="sm">
                  {todo.priority}
                </Badge>
                {todo.dueDate && <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
              </div>

              {todo.tags && todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {todo.tags.map(tag => (
                    <Badge key={tag} variant="outline" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {showBlockchainInfo && todo.blockchainNetwork && todo.transactionHash && TransactionStatusComponent && (
                <div className="mt-3">
                  <TransactionStatusComponent transactionHash={todo.transactionHash} network={todo.blockchainNetwork} />
                </div>
              )}
            </div>
          </div>

          {showActions && (
            <div className="card-actions justify-end mt-4">
              {renderSyncButton()}
              <IconButton variant="ghost" size="sm" onClick={() => onEdit(todo)}>
                <Edit className="h-4 w-4" />
              </IconButton>
              <IconButton variant="ghost" size="sm" onClick={() => onDelete(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';

export { TodoItem, todoItemVariants };

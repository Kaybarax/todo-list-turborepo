'use client';

import { useState } from 'react';
import { Badge, Button, Checkbox, IconButton } from '@todo/ui-web';
import { Edit, Trash2 } from 'lucide-react';
import { TransactionStatus } from './TransactionStatus';
import { BlockchainNetwork, getNetworkDisplayInfo } from '@todo/services';

export interface Todo {
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

interface TodoItemProps {
  todo: Todo;
  // eslint-disable-next-line no-unused-vars
  onToggle: (todoId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (todoData: Todo) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (todoId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onBlockchainSync?: (todoId: string, network: BlockchainNetwork) => void;
}

export const TodoItem = ({ todo, onToggle, onEdit, onDelete, onBlockchainSync }: TodoItemProps) => {
  const [showActions, setShowActions] = useState(false);

  // Priority colors are handled by Badge variant prop

  // Network colors are handled by getNetworkColor from services

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
        todo.completed ? 'opacity-75' : ''
      } ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>

            {showActions && (
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

          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
          )}

          <div className="mt-2 flex items-center space-x-2 flex-wrap gap-1">
            <Badge
              variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}
            >
              {todo.priority}
            </Badge>

            {todo.dueDate && (
              <Badge variant={isOverdue ? 'destructive' : 'outline'}>Due: {formatDate(todo.dueDate)}</Badge>
            )}

            {todo.blockchainNetwork && (
              <Badge variant="secondary">{getNetworkDisplayInfo(todo.blockchainNetwork).displayName}</Badge>
            )}

            {todo.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {todo.transactionHash && todo.blockchainNetwork && (
            <div className="mt-2">
              <TransactionStatus transactionHash={todo.transactionHash} network={todo.blockchainNetwork} />
            </div>
          )}

          {onBlockchainSync && !todo.blockchainNetwork && (
            <div className="mt-2">
              <details className="text-xs">
                <summary className="cursor-pointer text-primary-600 hover:text-primary-800">Sync to blockchain</summary>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button
                    onClick={() => onBlockchainSync(todo.id, BlockchainNetwork.SOLANA)}
                    variant="outline"
                    size="sm"
                  >
                    Solana
                  </Button>
                  <Button
                    onClick={() => onBlockchainSync(todo.id, BlockchainNetwork.POLKADOT)}
                    variant="outline"
                    size="sm"
                  >
                    Polkadot
                  </Button>
                  <Button
                    onClick={() => onBlockchainSync(todo.id, BlockchainNetwork.POLYGON)}
                    variant="outline"
                    size="sm"
                  >
                    Polygon
                  </Button>
                  <Button
                    onClick={() => onBlockchainSync(todo.id, BlockchainNetwork.MOONBEAM)}
                    variant="outline"
                    size="sm"
                  >
                    Moonbeam
                  </Button>
                  <Button onClick={() => onBlockchainSync(todo.id, BlockchainNetwork.BASE)} variant="outline" size="sm">
                    Base
                  </Button>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

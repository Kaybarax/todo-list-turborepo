'use client';

import { useState } from 'react';

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
  blockchainNetwork?: 'solana' | 'polkadot' | 'polygon';
  transactionHash?: string;
  blockchainAddress?: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onBlockchainSync?: (id: string, network: 'solana' | 'polkadot' | 'polygon') => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, onBlockchainSync }: TodoItemProps) {
  const [showActions, setShowActions] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const networkColors = {
    solana: 'bg-purple-100 text-purple-800',
    polkadot: 'bg-pink-100 text-pink-800',
    polygon: 'bg-indigo-100 text-indigo-800',
  };

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
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              className={`text-sm font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(todo)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Edit todo"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete todo"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex items-center space-x-2 flex-wrap gap-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[todo.priority]
              }`}
            >
              {todo.priority}
            </span>

            {todo.dueDate && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isOverdue
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Due: {formatDate(todo.dueDate)}
              </span>
            )}

            {todo.blockchainNetwork && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  networkColors[todo.blockchainNetwork]
                }`}
              >
                {todo.blockchainNetwork}
              </span>
            )}

            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {todo.transactionHash && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Tx:</span>{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                {todo.transactionHash.slice(0, 8)}...{todo.transactionHash.slice(-8)}
              </code>
            </div>
          )}

          {onBlockchainSync && !todo.blockchainNetwork && (
            <div className="mt-2">
              <details className="text-xs">
                <summary className="cursor-pointer text-primary-600 hover:text-primary-800">
                  Sync to blockchain
                </summary>
                <div className="mt-1 flex space-x-2">
                  <button
                    onClick={() => onBlockchainSync(todo.id, 'solana')}
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                  >
                    Solana
                  </button>
                  <button
                    onClick={() => onBlockchainSync(todo.id, 'polkadot')}
                    className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded hover:bg-pink-200"
                  >
                    Polkadot
                  </button>
                  <button
                    onClick={() => onBlockchainSync(todo.id, 'polygon')}
                    className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                  >
                    Polygon
                  </button>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
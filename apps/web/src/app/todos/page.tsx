'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, BlockchainStats } from '@todo/ui-web';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';
import { useTodoStore } from '@/store/todoStore';
import { useWallet } from '@/components/WalletProvider';
import type { BlockchainNetwork } from '@todo/services';
import type { TodoData as Todo } from '@/components/todo/TodoItem';

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { todos, isLoading, error, addTodo, updateTodo, deleteTodo, toggleTodo, syncToBlockchain, fetchTodos } =
    useTodoStore();

  const { isConnected } = useWallet();

  const blockchainStats = useMemo(() => {
    const total = todos.length;
    const onChain = todos.filter(todo => todo.blockchainNetwork).length;
    const offChain = total - onChain;

    const networkBreakdown = todos.reduce(
      (acc, todo) => {
        if (todo.blockchainNetwork) {
          acc[todo.blockchainNetwork] = (acc[todo.blockchainNetwork] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const pendingTransactions = todos.filter(todo => todo.transactionHash && !todo.blockchainAddress).length;

    return {
      total,
      onChain,
      offChain,
      networkBreakdown,
      pendingTransactions,
      syncPercentage: total > 0 ? Math.round((onChain / total) * 100) : 0,
    };
  }, [todos]);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = (todoData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags: string[];
  }) => {
    const fullTodoData = {
      ...todoData,
      completed: editingTodo?.completed || false,
      dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined,
    };

    if (editingTodo) {
      updateTodo(editingTodo.id, fullTodoData);
      setEditingTodo(null);
    } else {
      addTodo(fullTodoData);
    }
    setShowForm(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(id);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo Management</h1>
          <p className="mt-1 text-sm text-gray-600">Create, manage, and sync your todos to blockchain networks.</p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="default">
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Todo
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{editingTodo ? 'Edit Todo' : 'Create New Todo'}</h2>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={
              editingTodo
                ? {
                    title: editingTodo.title,
                    description: editingTodo.description,
                    priority: editingTodo.priority,
                    dueDate: editingTodo.dueDate ? editingTodo.dueDate.toISOString().split('T')[0] : undefined,
                    tags: editingTodo.tags,
                  }
                : undefined
            }
          />
        </div>
      )}

      {!isConnected && todos.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Wallet Not Connected</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Connect your wallet to sync todos to blockchain networks.{' '}
                  <a href="/wallet" className="font-medium underline hover:text-yellow-600">
                    Go to wallet page
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {blockchainStats.total > 0 && <BlockchainStats data={blockchainStats} />}

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBlockchainSync={
          isConnected ? (todoId, network) => void syncToBlockchain(todoId, network as BlockchainNetwork) : undefined
        }
      />
    </div>
  );
};

export default TodosPage;

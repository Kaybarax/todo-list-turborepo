'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, BlockchainStats } from '@todo/ui-web';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';
import { TodoFilters, type PriorityFilter, type StatusFilter } from '@/components/todo/TodoFilters';
import { TodoBulkActions } from '@/components/todo/TodoBulkActions';
import { useTodoStore } from '@/store/todoStore';
import { useWallet } from '@/components/WalletProvider';
import type { BlockchainNetwork } from '@todo/services';
import type { TodoData as Todo } from '@/components/todo/TodoItem';

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<PriorityFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    markAllDone,
    clearCompleted,
    undo,
    canUndo,
    syncToBlockchain,
    fetchTodos,
  } = useTodoStore();

  const { isConnected } = useWallet();

  const filteredTodos = useMemo(() => {
    const term = search.trim().toLowerCase();

    return todos.filter(todo => {
      if (status === 'open' && todo.completed) return false;
      if (status === 'completed' && !todo.completed) return false;

      if (priority !== 'all' && todo.priority !== priority) return false;

      if (term.length > 0) {
        const inTitle = todo.title.toLowerCase().includes(term);
        const inDescription = (todo.description ?? '').toLowerCase().includes(term);
        const inTags = (todo.tags ?? []).some(tag => {
          const lower = tag.toLowerCase();
          return lower.includes(term) || `#${lower}`.includes(term);
        });

        if (!inTitle && !inDescription && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [todos, search, priority, status]);

  const blockchainStats = useMemo(() => {
    const total = filteredTodos.length;
    const onChain = filteredTodos.filter(todo => todo.blockchainNetwork).length;
    const offChain = total - onChain;

    const networkBreakdown = filteredTodos.reduce(
      (acc, todo) => {
        if (todo.blockchainNetwork) {
          acc[todo.blockchainNetwork] = (acc[todo.blockchainNetwork] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const pendingTransactions = filteredTodos.filter(todo => todo.transactionHash && !todo.blockchainAddress).length;

    return {
      total,
      onChain,
      offChain,
      networkBreakdown,
      pendingTransactions,
      syncPercentage: total > 0 ? Math.round((onChain / total) * 100) : 0,
    };
  }, [filteredTodos]);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (!bulkStatus) return;
    const timeout = window.setTimeout(() => setBulkStatus(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [bulkStatus]);

  const handleClearFilters = () => {
    setSearch('');
    setPriority('all');
    setStatus('all');
    setBulkStatus(null);
  };

  const handleRefresh = () => {
    void fetchTodos();
    setBulkStatus(null);
  };

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
      setBulkStatus(null);
    }
  };

  const handleMarkAllDone = () => {
    const hasOpenTodos = todos.some(todo => !todo.completed);
    if (!hasOpenTodos) {
      setBulkStatus('All todos are already marked as done.');
      return;
    }
    markAllDone();
    setBulkStatus('Marked all todos as done.');
  };

  const handleClearCompleted = () => {
    const hasCompletedTodos = todos.some(todo => todo.completed);
    if (!hasCompletedTodos) {
      setBulkStatus('No completed todos to clear.');
      return;
    }
    clearCompleted();
    setBulkStatus('Cleared completed todos.');
  };

  const handleUndo = () => {
    if (!canUndo) return;
    undo();
    setBulkStatus('Reverted last bulk action.');
  };

  const filteredHasTodos = filteredTodos.length > 0;
  const filteredHasCompleted = filteredTodos.some(todo => todo.completed);

  const emptyState =
    !isLoading && filteredTodos.length === 0 ? (
      todos.length === 0 ? (
        <div className="rounded-lg border border-base-300 bg-base-100 p-6 text-center">
          <h3 className="text-base font-semibold text-base-content">You have no todos yet</h3>
          <p className="mt-2 text-sm text-base-content/70">Create your first todo to get started.</p>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-base-300 bg-base-100 p-6 text-center">
          <h3 className="text-base font-semibold text-base-content">No results match your filters</h3>
          <p className="mt-2 text-sm text-base-content/70">Try adjusting or clearing your filters.</p>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      )
    ) : undefined;

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

      <TodoFilters
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        onClear={handleClearFilters}
      />

      <TodoBulkActions
        onMarkAllDone={handleMarkAllDone}
        onClearCompleted={handleClearCompleted}
        onUndo={canUndo ? handleUndo : undefined}
        hasTodos={filteredHasTodos && !isLoading}
        hasCompleted={filteredHasCompleted && !isLoading}
        canUndo={canUndo}
        statusMessage={bulkStatus}
      />

      {blockchainStats.total > 0 && <BlockchainStats data={blockchainStats} />}

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBlockchainSync={
          isConnected ? (todoId, network) => void syncToBlockchain(todoId, network as BlockchainNetwork) : undefined
        }
        loading={isLoading}
        showFilters={false}
        emptyState={emptyState}
        onRefresh={handleRefresh}
        refreshing={isLoading}
      />
    </div>
  );
};

export default TodosPage;

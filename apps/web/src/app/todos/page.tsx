'use client';

import { useState, useEffect } from 'react';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { useTodoStore } from '@/store/todoStore';
import type { Todo } from '@/components/TodoItem';

export default function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    syncToBlockchain,
    fetchTodos,
  } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = (todoData: Parameters<typeof addTodo>[0]) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } else {
      addTodo(todoData);
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

  const handleBlockchainSync = async (id: string, network: 'solana' | 'polkadot' | 'polygon') => {
    try {
      await syncToBlockchain(id, network);
    } catch (error) {
      console.error('Failed to sync to blockchain:', error);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, manage, and sync your todos to blockchain networks.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Todo
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTodo ? 'Edit Todo' : 'Create New Todo'}
          </h2>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingTodo ? {
              title: editingTodo.title,
              description: editingTodo.description,
              priority: editingTodo.priority,
              dueDate: editingTodo.dueDate ? editingTodo.dueDate.toISOString().split('T')[0] : undefined,
              tags: editingTodo.tags,
            } : undefined}
          />
        </div>
      )}

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
        onBlockchainSync={handleBlockchainSync}
      />
    </div>
  );
}
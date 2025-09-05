/* eslint-disable no-unused-vars */
/* eslint-disable promise/always-return */
// Mobile todo store: state management with async operations
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlockchainNetwork } from '@todo/services';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  createMobileBlockchainService,
  todoToBlockchainTodo,
  type TransactionResult,
} from '../services/blockchainService';

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

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addTodo: (_todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateTodo: (_id: string, _updates: Partial<Todo>) => void;
  deleteTodo: (_id: string) => void;
  toggleTodo: (_id: string) => void;
  syncToBlockchain: (_id: string, _network: BlockchainNetwork) => Promise<void>;

  // API actions (will be implemented when API is ready)
  fetchTodos: () => Promise<void>;
  saveTodo: (_todo: Todo) => Promise<void>;
}

// Mock user ID for now
const MOCK_USER_ID = 'mobile-user-1';

// Generate a simple ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      isLoading: false,
      error: null,

      addTodo: todoData => {
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: MOCK_USER_ID,
        };

        set(state => ({
          todos: [newTodo, ...state.todos],
        }));
      },

      updateTodo: (id, updates) => {
        set(state => ({
          todos: state.todos.map(todo => (todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo)),
        }));
      },

      deleteTodo: id => {
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
        }));
      },

      toggleTodo: id => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo,
          ),
        }));
      },

      syncToBlockchain: async (id, network) => {
        set({ isLoading: true, error: null });

        try {
          const state = get();
          const todo = state.todos.find(t => t.id === id);

          if (!todo) {
            throw new Error('Todo not found');
          }

          // Create mobile blockchain service for the selected network
          const blockchainService = createMobileBlockchainService(network);

          // Convert todo to blockchain format
          const blockchainTodo = todoToBlockchainTodo(todo);

          // Create todo on blockchain
          const result: TransactionResult = await blockchainService.createTodo(blockchainTodo);

          // Update todo with blockchain information
          set(state => ({
            todos: state.todos.map(todo =>
              todo.id === id
                ? {
                    ...todo,
                    blockchainNetwork: network,
                    transactionHash: result.hash,
                    blockchainAddress: `${network}-${id}`,
                    updatedAt: new Date(),
                  }
                : todo,
            ),
            isLoading: false,
          }));

          // Wait for transaction confirmation in the background
          blockchainService
            .waitForTransaction(result.hash)
            .then(() => {
              set(state => ({
                todos: state.todos.map(todo =>
                  todo.id === id && todo.transactionHash === result.hash
                    ? {
                        ...todo,
                        // Could add more blockchain metadata here
                        updatedAt: new Date(),
                      }
                    : todo,
                ),
              }));
            })
            .catch(error => {
              console.error('Transaction confirmation failed:', error);
            });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to sync to blockchain',
            isLoading: false,
          });
        }
      },

      fetchTodos: async () => {
        set({ isLoading: true, error: null });

        try {
          // Mock API call - will be replaced with actual API integration
          await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

          // Initialize with sample data if no todos exist
          const currentTodos = get().todos;
          if (currentTodos.length === 0) {
            const sampleTodos: Todo[] = [
              {
                id: '1',
                title: 'Setup mobile wallet',
                description: 'Connect mobile wallet for blockchain functionality',
                completed: false,
                priority: 'high',
                dueDate: new Date('2024-01-15'),
                tags: ['blockchain', 'mobile'],
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-10'),
                userId: MOCK_USER_ID,
              },
              {
                id: '2',
                title: 'Test mobile app',
                description: 'Test all mobile app functionality',
                completed: true,
                priority: 'medium',
                tags: ['testing', 'mobile'],
                createdAt: new Date('2024-01-08'),
                updatedAt: new Date('2024-01-12'),
                userId: MOCK_USER_ID,
                blockchainNetwork: BlockchainNetwork.SOLANA,
                transactionHash: 'solana-1234567890abcdef',
                blockchainAddress: 'solana-2',
              },
              {
                id: '3',
                title: 'Review mobile UI',
                description: 'Review and improve mobile user interface',
                completed: false,
                priority: 'low',
                tags: ['ui', 'design'],
                createdAt: new Date('2024-01-09'),
                updatedAt: new Date('2024-01-09'),
                userId: MOCK_USER_ID,
              },
            ];
            set({ todos: sampleTodos });
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch todos',
            isLoading: false,
          });
        }
      },

      saveTodo: async _todo => {
        set({ isLoading: true, error: null });

        try {
          // Mock API call - will be replaced with actual API integration
          await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save todo',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'mobile-todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ todos: state.todos }),
    },
  ),
);

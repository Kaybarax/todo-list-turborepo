import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Todo } from '@/components/TodoItem';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  syncToBlockchain: (id: string, network: 'solana' | 'polkadot' | 'polygon') => Promise<void>;
  
  // API actions (will be implemented when API is ready)
  fetchTodos: () => Promise<void>;
  saveTodo: (todo: Todo) => Promise<void>;
}

// Mock user ID for now
const MOCK_USER_ID = 'user-1';

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

      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: MOCK_USER_ID,
        };

        set((state) => ({
          todos: [newTodo, ...state.todos],
        }));
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          ),
        }));
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }));
      },

      syncToBlockchain: async (id, network) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock blockchain sync - will be replaced with actual implementation
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    blockchainNetwork: network,
                    transactionHash: mockTransactionHash,
                    blockchainAddress: `${network}-address-${id}`,
                    updatedAt: new Date(),
                  }
                : todo
            ),
            isLoading: false,
          }));
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
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Initialize with sample data if no todos exist
          const currentTodos = get().todos;
          if (currentTodos.length === 0) {
            const { sampleTodos } = await import('@/lib/sampleData');
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

      saveTodo: async (todo) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call - will be replaced with actual API integration
          await new Promise((resolve) => setTimeout(resolve, 500));
          
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
      name: 'todo-storage',
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoApiClient, type BlockchainNetwork } from '@todo/services';

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
};

type NewTodo = {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO date
  tags?: string[];
};

export const useTodoStore = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydratedRef = useRef(false);
  const STORAGE_KEY = '@todo/mobile/todos';

  const api = useMemo(() => new TodoApiClient({ baseUrl: 'http://localhost:3001/api/v1' }), []);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getTodos();
      if (res.success && res.data) {
        const data = (res.data as any[]).map(item => ({
          id: String(item.id),
          title: item.title,
          description: item.description,
          completed: !!item.completed,
        })) as Todo[];
        setTodos(data);
      } else {
        setError(res.error ?? 'Failed to load todos');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Array<Omit<Todo, 'dueDate'> & { dueDate?: string }>;
          const restored: Todo[] = parsed.map(t => ({
            ...t,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          }));
          setTodos(restored);
        }
      } catch {
        // ignore corrupted cache
      } finally {
        hydratedRef.current = true;
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to AsyncStorage when todos change (after hydration)
  useEffect(() => {
    if (!hydratedRef.current) return;
    const save = async () => {
      try {
        const serializable = todos.map(t => ({
          ...t,
          dueDate: t.dueDate ? t.dueDate.toISOString() : undefined,
        }));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
      } catch {
        // best-effort persistence
      }
    };
    void save();
  }, [todos]);

  const addTodo = useCallback((input: NewTodo) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).slice(2),
      title: input.title,
      description: input.description,
      completed: false,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      tags: input.tags,
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const updateTodo = useCallback((id: string, input: NewTodo) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title: input.title,
              description: input.description,
              priority: input.priority,
              dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
              tags: input.tags,
            }
          : t,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const syncToBlockchain = useCallback(async (_id: string, _network: BlockchainNetwork) => {
    // Placeholder: in real app, call a service
    await new Promise<void>(resolve => setTimeout(resolve, 300));
  }, []);

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    syncToBlockchain,
    fetchTodos,
  } as const;
};

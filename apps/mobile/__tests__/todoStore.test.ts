import { renderHook, act } from '@testing-library/react-native';
import { useTodoStore } from '../src/store/todoStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('useTodoStore', () => {
  it('adds, updates, toggles, deletes todos', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'A', description: 'd1', priority: 'high', tags: ['x'] });
    });

    expect(result.current.todos.length).toBe(1);
    const id = result.current.todos[0].id;

    act(() => {
      result.current.updateTodo(id, { title: 'A2', description: 'd2' });
    });
    expect(result.current.todos[0].title).toBe('A2');

    act(() => {
      result.current.toggleTodo(id);
    });
    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.deleteTodo(id);
    });
    expect(result.current.todos.length).toBe(0);
  });

  it('supports bulk actions with undo', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'A' });
      result.current.addTodo({ title: 'B' });
    });
    expect(result.current.todos.length).toBe(2);

    act(() => {
      result.current.markAllDone();
    });
    expect(result.current.todos.every(t => t.completed)).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.todos.every(t => t.completed)).toBe(false);

    act(() => {
      result.current.clearCompleted();
    });
    // none completed -> no-op length remains 2
    expect(result.current.todos.length).toBe(2);
  });
});

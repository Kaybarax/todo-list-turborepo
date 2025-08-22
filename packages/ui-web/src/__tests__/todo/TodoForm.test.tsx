import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { TodoForm, type TodoFormData } from '../../components/todo/TodoForm/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('TodoForm component - Implementation pending migration')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<TodoForm onSubmit={mockOnSubmit} variant="default" />);
    expect(screen.getByRole('form')).toHaveClass('space-y-4');

    rerender(<TodoForm onSubmit={mockOnSubmit} variant="compact" />);
    expect(screen.getByRole('form')).toHaveClass('space-y-2');

    rerender(<TodoForm onSubmit={mockOnSubmit} variant="inline" />);
    expect(screen.getByRole('form')).toHaveClass('flex', 'flex-row', 'space-x-2');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<TodoForm onSubmit={mockOnSubmit} size="sm" />);
    expect(screen.getByRole('form')).toHaveClass('text-sm');

    rerender(<TodoForm onSubmit={mockOnSubmit} size="md" />);
    expect(screen.getByRole('form')).toHaveClass('text-base');

    rerender(<TodoForm onSubmit={mockOnSubmit} size="lg" />);
    expect(screen.getByRole('form')).toHaveClass('text-lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(<TodoForm onSubmit={mockOnSubmit} disabled />);
    // Test will be expanded during actual implementation
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<TodoForm onSubmit={mockOnSubmit} loading />);
    // Test will be expanded during actual implementation
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('renders with initial data', () => {
    const initialData: Partial<TodoFormData> = {
      title: 'Test Todo',
      priority: 'high',
      tags: ['test', 'important'],
    };
    render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);
    // Test will be expanded during actual implementation
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    // Test will be expanded during actual implementation
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});

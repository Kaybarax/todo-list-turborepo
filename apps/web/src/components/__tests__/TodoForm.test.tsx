import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { vi } from 'vitest';

// Mock the UI components
vi.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled, isLoading }: any) => (
    <button onClick={onClick} disabled={disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Input: ({ value, onChange, placeholder, required }: any) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  ),
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create form correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByPlaceholderText('Enter todo title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description (optional)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByText('Create Todo')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders edit form with initial values', () => {
    const initialTodo = {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high' as const,
      dueDate: '2024-12-31',
      tags: ['test', 'work'],
      completed: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user1',
    };

    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        initialTodo={initialTodo}
      />
    );
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test, work')).toBeInTheDocument();
    expect(screen.getByText('Update Todo')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'New Todo' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter description (optional)'), {
      target: { value: 'New Description' }
    });
    fireEvent.change(screen.getByDisplayValue('medium'), {
      target: { value: 'high' }
    });
    fireEvent.change(screen.getByPlaceholderText('YYYY-MM-DD'), {
      target: { value: '2024-12-31' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter tags separated by commas'), {
      target: { value: 'work, urgent' }
    });

    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: ['work', 'urgent'],
      });
    });
  });

  it('validates required title field', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('handles cancel button click', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TodoForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'Test Todo' }
    });
    fireEvent.click(screen.getByText('Create Todo'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('handles tags parsing correctly', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'Test Todo' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter tags separated by commas'), {
      target: { value: '  work  ,  urgent  ,  ,  important  ' }
    });

    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: ['work', 'urgent', 'important'],
      });
    });
  });

  it('handles empty tags correctly', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'Test Todo' }
    });

    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: [],
      });
    });
  });

  it('resets form after successful submission', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'Test Todo' }
    });
    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter todo title')).toHaveValue('');
    });
  });
});
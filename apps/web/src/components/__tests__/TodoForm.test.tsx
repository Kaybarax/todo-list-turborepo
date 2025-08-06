import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from '../TodoForm';

// Mock the UI components
jest.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled, type, variant }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} data-variant={variant}>
      {children}
    </button>
  ),
  Input: ({ placeholder, value, onChange, type, id, className }: any) => (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      className={className}
    />
  ),
  Badge: ({ children, variant, className }: any) => (
    <span data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

describe('TodoForm', () => {
  it('should render form fields', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByPlaceholderText('Enter todo title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter todo description')).toBeInTheDocument();
    
    // Check that the priority select has the correct default value
    const prioritySelect = screen.getByLabelText('Priority');
    expect(prioritySelect).toHaveValue('medium');
    
    expect(screen.getByText('Create Todo')).toBeInTheDocument();
    // Cancel button only appears when onCancel is provided
  });

  it('should render form with initial data', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    const initialData = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high' as const,
      dueDate: '2024-12-31',
      tags: ['test', 'work'],
    };

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    
    // Check that the priority select has the correct value
    const prioritySelect = screen.getByLabelText('Priority');
    expect(prioritySelect).toHaveValue('high');
    
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('Update Todo')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter todo title'), {
      target: { value: 'New Todo' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter todo description'), {
      target: { value: 'New Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        priority: 'medium',
        dueDate: undefined,
        tags: [],
      });
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should prevent submission with empty title', async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Try to submit without title
    fireEvent.click(screen.getByText('Create Todo'));

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const mockOnSubmit = jest.fn();

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
      />
    );

    // Fill and submit form
    const titleInput = screen.getByPlaceholderText('Enter todo title');
    fireEvent.change(titleInput, {
      target: { value: 'Test Todo' },
    });
    fireEvent.click(screen.getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset (only for new todos, not when editing)
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });
});
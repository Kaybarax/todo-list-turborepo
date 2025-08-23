import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { TodoForm, type TodoFormData } from '../lib/components/todo/TodoForm/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields in default variant', () => {
      render(<TodoForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Todo' })).toBeInTheDocument();
    });

    it('renders compact variant without description and due date', () => {
      render(<TodoForm onSubmit={mockOnSubmit} variant="compact" />);

      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.queryByLabelText('Due Date')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Tags')).not.toBeInTheDocument();
    });

    it('renders inline variant with simplified layout', () => {
      render(<TodoForm onSubmit={mockOnSubmit} variant="inline" onCancel={mockOnCancel} />);

      expect(screen.getByPlaceholderText('Enter todo title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders cancel button when onCancel is provided', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('does not render cancel button when onCancel is not provided', () => {
      render(<TodoForm onSubmit={mockOnSubmit} />);

      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with correct data when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), 'Test Todo');
      await user.type(screen.getByLabelText('Description'), 'Test Description');
      await user.selectOptions(screen.getByLabelText('Priority'), 'high');
      await user.type(screen.getByLabelText('Due Date'), '2024-12-31');

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    it('does not call onSubmit when title is empty', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('trims whitespace from title and description', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), '  Test Todo  ');
      await user.type(screen.getByLabelText('Description'), '  Test Description  ');

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'medium',
        dueDate: undefined,
        tags: [],
      });
    });

    it('excludes empty description from submission data', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), 'Test Todo');

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: undefined,
        priority: 'medium',
        dueDate: undefined,
        tags: [],
      });
    });

    it('resets form after successful submission when no initial data', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), 'Test Todo');
      await user.type(screen.getByLabelText('Description'), 'Test Description');

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(screen.getByLabelText('Title *')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
    });

    it('does not reset form when editing (has initial data)', async () => {
      const user = userEvent.setup();
      const initialData = { title: 'Initial Todo', priority: 'high' as const, tags: [] };
      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      await user.type(screen.getByLabelText('Title *'), ' Updated');
      await user.click(screen.getByRole('button', { name: 'Update Todo' }));

      expect(screen.getByLabelText('Title *')).toHaveValue('Initial Todo Updated');
    });
  });

  describe('Form Validation', () => {
    it('prevents submission when title is empty', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      // Form should not submit without title
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates title length', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      const longTitle = 'a'.repeat(101);
      await user.type(screen.getByLabelText('Title *'), longTitle);
      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates description length', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), 'Valid Title');
      const longDescription = 'a'.repeat(501);
      await user.type(screen.getByLabelText('Description'), longDescription);
      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Tag Management', () => {
    it('adds tags when Add button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Tags'), 'test-tag');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.getByText('test-tag')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toHaveValue('');
    });

    it('adds tags when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      const tagInput = screen.getByLabelText('Tags');
      await user.type(tagInput, 'test-tag');
      await user.keyboard('{Enter}');

      expect(screen.getByText('test-tag')).toBeInTheDocument();
      expect(tagInput).toHaveValue('');
    });

    it('does not add duplicate tags', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Tags'), 'duplicate');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.type(screen.getByLabelText('Tags'), 'duplicate');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.getAllByText('duplicate')).toHaveLength(1);
    });

    it('removes tags when remove button is clicked', async () => {
      const user = userEvent.setup();
      const initialData = { title: 'Test', priority: 'medium' as const, tags: ['removeme'] };
      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      expect(screen.getByText('removeme')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Remove removeme tag' }));

      expect(screen.queryByText('removeme')).not.toBeInTheDocument();
    });

    it('prevents adding more than 10 tags', async () => {
      const user = userEvent.setup();
      const initialData = {
        title: 'Test',
        priority: 'medium' as const,
        tags: Array.from({ length: 10 }, (_, i) => `tag${i}`),
      };
      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      await user.type(screen.getByLabelText('Tags'), 'extra-tag');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.queryByText('extra-tag')).not.toBeInTheDocument();
    });

    it('includes tags in form submission', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Title *'), 'Test Todo');
      await user.type(screen.getByLabelText('Tags'), 'tag1');
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.type(screen.getByLabelText('Tags'), 'tag2');
      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByRole('button', { name: 'Create Todo' }));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['tag1', 'tag2'],
        }),
      );
    });
  });

  describe('Initial Data', () => {
    it('populates form with initial data', () => {
      const initialData: Partial<TodoFormData> = {
        title: 'Initial Todo',
        description: 'Initial Description',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: ['initial', 'test'],
      };

      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      expect(screen.getByDisplayValue('Initial Todo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
      expect(screen.getByText('initial')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();

      // Check priority select value
      const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement;
      expect(prioritySelect.value).toBe('high');
    });

    it('changes submit button text to "Update Todo" when initial data is provided', () => {
      const initialData = { title: 'Test', priority: 'medium' as const, tags: [] };
      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      expect(screen.getByRole('button', { name: 'Update Todo' })).toBeInTheDocument();
    });
  });

  describe('Interactive States', () => {
    it('disables all inputs when disabled prop is true', () => {
      render(<TodoForm onSubmit={mockOnSubmit} disabled />);

      expect(screen.getByLabelText('Title *')).toBeDisabled();
      expect(screen.getByLabelText('Description')).toBeDisabled();
      expect(screen.getByLabelText('Priority')).toBeDisabled();
      expect(screen.getByLabelText('Due Date')).toBeDisabled();
      expect(screen.getByLabelText('Tags')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Create Todo' })).toBeDisabled();
    });

    it('disables all inputs when loading prop is true', () => {
      render(<TodoForm onSubmit={mockOnSubmit} loading />);

      expect(screen.getByLabelText('Title *')).toBeDisabled();
      expect(screen.getByLabelText('Description')).toBeDisabled();
      expect(screen.getByLabelText('Priority')).toBeDisabled();
      expect(screen.getByLabelText('Due Date')).toBeDisabled();
      expect(screen.getByLabelText('Tags')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();

      // Check that submit button is disabled and has loading state
      const submitButton = screen.getByRole('button', { name: '' });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });

    it('shows loading state on submit button when loading', () => {
      render(<TodoForm onSubmit={mockOnSubmit} loading />);

      const submitButton = screen.getByRole('button', { name: '' });
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('does not submit form when disabled', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} disabled />);

      // Try to submit via keyboard
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('does not submit form when loading', async () => {
      const user = userEvent.setup();
      render(<TodoForm onSubmit={mockOnSubmit} loading />);

      // Try to submit via keyboard
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Variant Classes', () => {
    it('applies default variant classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} variant="default" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-4');
    });

    it('applies compact variant classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} variant="compact" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-2');
    });

    it('applies inline variant classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} variant="inline" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('flex', 'flex-row', 'space-x-2', 'space-y-0', 'items-end');
    });
  });

  describe('Size Classes', () => {
    it('applies small size classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} size="sm" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('text-sm');
    });

    it('applies medium size classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} size="md" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('text-base');
    });

    it('applies large size classes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} size="lg" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<TodoForm onSubmit={mockOnSubmit} />);

      // Check that form has proper role
      expect(screen.getByRole('form')).toBeInTheDocument();

      // Check that all inputs have labels
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toBeInTheDocument();
    });

    it('has proper ARIA attributes for form fields', () => {
      render(<TodoForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText('Title *');
      expect(titleInput).toHaveAttribute('required');

      const descriptionTextarea = screen.getByLabelText('Description');
      expect(descriptionTextarea).toBeInTheDocument();

      const prioritySelect = screen.getByLabelText('Priority');
      expect(prioritySelect).toBeInTheDocument();
    });

    it('supports keyboard navigation for tag removal', async () => {
      const user = userEvent.setup();
      const initialData = { title: 'Test', priority: 'medium' as const, tags: ['removeme'] };
      render(<TodoForm onSubmit={mockOnSubmit} initialData={initialData} />);

      const removeButton = screen.getByRole('button', { name: 'Remove removeme tag' });
      expect(removeButton).toHaveAttribute('aria-label', 'Remove removeme tag');

      await user.click(removeButton);
      expect(screen.queryByText('removeme')).not.toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('forwards data-testid prop', () => {
      render(<TodoForm onSubmit={mockOnSubmit} data-testid="custom-todo-form" />);

      expect(screen.getByTestId('custom-todo-form')).toBeInTheDocument();
    });

    it('forwards custom className', () => {
      render(<TodoForm onSubmit={mockOnSubmit} className="custom-class" />);

      const form = screen.getByRole('form');
      expect(form).toHaveClass('custom-class');
    });

    it('forwards other HTML form attributes', () => {
      render(<TodoForm onSubmit={mockOnSubmit} id="custom-form" />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('id', 'custom-form');
    });
  });
});

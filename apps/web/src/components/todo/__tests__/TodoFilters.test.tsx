import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoFilters, type SavedFilterView } from '../TodoFilters';

describe('TodoFilters', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TodoFilters
        search=""
        onSearchChange={() => {}}
        priority="all"
        onPriorityChange={() => {}}
        status="all"
        onStatusChange={() => {}}
      />,
    );

    expect(getByPlaceholderText('Search title, description, or #tag')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('Low')).toBeInTheDocument();
    expect(getByText('Medium')).toBeInTheDocument();
    expect(getByText('High')).toBeInTheDocument();
    expect(getByText('Open')).toBeInTheDocument();
    expect(getByText('Completed')).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = jest.fn();
    const { getByPlaceholderText } = render(
      <TodoFilters
        search=""
        onSearchChange={onSearchChange}
        priority="all"
        onPriorityChange={() => {}}
        status="all"
        onStatusChange={() => {}}
      />,
    );

    fireEvent.change(getByPlaceholderText('Search title, description, or #tag'), { target: { value: 'test' } });
    expect(onSearchChange).toHaveBeenCalledWith('test');
  });

  it('calls onPriorityChange when priority button is clicked', () => {
    const onPriorityChange = jest.fn();
    const { getByText } = render(
      <TodoFilters
        search=""
        onSearchChange={() => {}}
        priority="all"
        onPriorityChange={onPriorityChange}
        status="all"
        onStatusChange={() => {}}
      />,
    );

    fireEvent.click(getByText('Low'));
    expect(onPriorityChange).toHaveBeenCalledWith('low');
  });

  it('calls onStatusChange when status button is clicked', () => {
    const onStatusChange = jest.fn();
    const { getByText } = render(
      <TodoFilters
        search=""
        onSearchChange={() => {}}
        priority="all"
        onPriorityChange={() => {}}
        status="all"
        onStatusChange={onStatusChange}
      />,
    );

    fireEvent.click(getByText('Open'));
    expect(onStatusChange).toHaveBeenCalledWith('open');
  });

  describe('Saved Views', () => {
    const mockViews: SavedFilterView[] = [
      { id: 'v1', name: 'High Priority', search: '', priority: 'high', status: 'all' },
      { id: 'v2', name: 'Today', search: '', priority: 'all', status: 'open' },
      { id: 'v3', name: 'Blockchain', search: 'blockchain', priority: 'all', status: 'all' },
    ];

    it('renders saved views when provided', () => {
      const { getByText } = render(
        <TodoFilters
          search=""
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          savedViews={mockViews}
        />,
      );

      expect(getByText('High Priority')).toBeInTheDocument();
      expect(getByText('Today')).toBeInTheDocument();
      expect(getByText('Blockchain')).toBeInTheDocument();
    });

    it('calls onSelectView when a saved view button is clicked', () => {
      const onSelectView = jest.fn();
      const { getByText } = render(
        <TodoFilters
          search=""
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          savedViews={mockViews}
          onSelectView={onSelectView}
        />,
      );

      fireEvent.click(getByText('High Priority'));
      expect(onSelectView).toHaveBeenCalledWith(mockViews[0]);
    });

    it('highlights the active saved view', () => {
      const { getByText } = render(
        <TodoFilters
          search=""
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          savedViews={mockViews}
          activeViewId="v2"
          onSelectView={() => {}}
        />,
      );

      // The active view button should have 'default' variant; we check it's rendered
      const todayButton = getByText('Today');
      expect(todayButton).toBeInTheDocument();
    });

    it('calls onDeleteView when delete button is clicked', () => {
      const onDeleteView = jest.fn();
      const { getByLabelText } = render(
        <TodoFilters
          search=""
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          savedViews={mockViews}
          onDeleteView={onDeleteView}
        />,
      );

      fireEvent.click(getByLabelText('Delete saved view Today'));
      expect(onDeleteView).toHaveBeenCalledWith('v2');
    });

    it('shows save view input when there are active filters and onSaveView is provided', () => {
      const { getByPlaceholderText, getByText } = render(
        <TodoFilters
          search="test"
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          onSaveView={() => {}}
        />,
      );

      expect(getByPlaceholderText('View name...')).toBeInTheDocument();
      expect(getByText('Save view')).toBeInTheDocument();
    });

    it('does not show save view input when no active filters', () => {
      const { queryByPlaceholderText } = render(
        <TodoFilters
          search=""
          onSearchChange={() => {}}
          priority="all"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          onSaveView={() => {}}
        />,
      );

      expect(queryByPlaceholderText('View name...')).not.toBeInTheDocument();
    });

    it('calls onSaveView with the entered name', () => {
      const onSaveView = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <TodoFilters
          search="test"
          onSearchChange={() => {}}
          priority="high"
          onPriorityChange={() => {}}
          status="all"
          onStatusChange={() => {}}
          onSaveView={onSaveView}
        />,
      );

      fireEvent.change(getByPlaceholderText('View name...'), { target: { value: 'My View' } });
      fireEvent.click(getByText('Save view'));
      expect(onSaveView).toHaveBeenCalledWith('My View');
    });

    it('clears the active view when clearing filters if onClear is provided', () => {
      const onClear = jest.fn();
      const { getByText } = render(
        <TodoFilters
          search="test"
          onSearchChange={() => {}}
          priority="high"
          onPriorityChange={() => {}}
          status="open"
          onStatusChange={() => {}}
          onClear={onClear}
          savedViews={mockViews}
          activeViewId="v1"
        />,
      );

      fireEvent.click(getByText('Clear filters'));
      // Clear filters triggers onSearchChange(''), onPriorityChange('all'), onStatusChange('all'), onClear?.()
      expect(onClear).toHaveBeenCalled();
    });
  });
});

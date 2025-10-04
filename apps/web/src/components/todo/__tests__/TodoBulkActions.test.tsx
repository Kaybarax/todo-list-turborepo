import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoBulkActions } from '../TodoBulkActions';

describe('TodoBulkActions', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <TodoBulkActions onMarkAllDone={() => {}} onClearCompleted={() => {}} hasTodos={true} hasCompleted={true} />,
    );

    expect(getByText('Mark all done')).toBeInTheDocument();
    expect(getByText('Clear completed')).toBeInTheDocument();
  });

  it('disables buttons when there are no todos', () => {
    const { getByText } = render(
      <TodoBulkActions onMarkAllDone={() => {}} onClearCompleted={() => {}} hasTodos={false} hasCompleted={false} />,
    );

    expect(getByText('Mark all done')).toBeDisabled();
    expect(getByText('Clear completed')).toBeDisabled();
  });

  it('calls onMarkAllDone when mark all done button is clicked', () => {
    const onMarkAllDone = jest.fn();
    const { getByText } = render(
      <TodoBulkActions onMarkAllDone={onMarkAllDone} onClearCompleted={() => {}} hasTodos={true} hasCompleted={true} />,
    );

    fireEvent.click(getByText('Mark all done'));
    expect(onMarkAllDone).toHaveBeenCalled();
  });

  it('calls onClearCompleted when clear completed button is clicked', () => {
    const onClearCompleted = jest.fn();
    const { getByText } = render(
      <TodoBulkActions
        onMarkAllDone={() => {}}
        onClearCompleted={onClearCompleted}
        hasTodos={true}
        hasCompleted={true}
      />,
    );

    fireEvent.click(getByText('Clear completed'));
    expect(onClearCompleted).toHaveBeenCalled();
  });

  it('calls onUndo when undo button is clicked', () => {
    const onUndo = jest.fn();
    const { getByText } = render(
      <TodoBulkActions
        onMarkAllDone={() => {}}
        onClearCompleted={() => {}}
        onUndo={onUndo}
        hasTodos={true}
        hasCompleted={true}
        canUndo={true}
      />,
    );

    fireEvent.click(getByText('Undo'));
    expect(onUndo).toHaveBeenCalled();
  });
});

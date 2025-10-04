import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoFilters } from '../TodoFilters';

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
});

'use client';

import React from 'react';
import { Button, ButtonGroup, Input } from '@todo/ui-web';

export type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
export type StatusFilter = 'all' | 'open' | 'completed';
export type SortType = 'created' | 'priority' | 'dueDate' | 'title';

export interface SavedFilterView {
  id: string;
  name: string;
  search: string;
  priority: PriorityFilter;
  status: StatusFilter;
  sort?: SortType;
}

export interface TodoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priority: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onClear?: () => void;
  savedViews?: SavedFilterView[];
  activeViewId?: string;
  onSelectView?: (view: SavedFilterView) => void;
  onSaveView?: (name: string) => void;
  onDeleteView?: (id: string) => void;
}

const PRIORITY_OPTIONS = ['all', 'low', 'medium', 'high'] as const;
const STATUS_OPTIONS = ['all', 'open', 'completed'] as const;

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  onClear,
  savedViews,
  activeViewId,
  onSelectView,
  onSaveView,
  onDeleteView,
}) => {
  const [newViewName, setNewViewName] = React.useState('');
  const hasActiveFilters = search.trim().length > 0 || priority !== 'all' || status !== 'all';

  const handleSaveView = () => {
    const name = newViewName.trim() || `View ${(savedViews?.length ?? 0) + 1}`;
    onSaveView?.(name);
    setNewViewName('');
  };

  return (
    <div className="space-y-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
      {/* Saved Views */}
      {savedViews && savedViews.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-base-content">Saved Views</div>
          <div className="flex flex-wrap gap-2">
            {savedViews.map(view => (
              <div key={view.id} className="flex items-center gap-1">
                <Button
                  type="button"
                  size="xs"
                  variant={activeViewId === view.id ? 'default' : 'outline'}
                  onClick={() => onSelectView?.(view)}
                >
                  {view.name}
                </Button>
                {onDeleteView && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-base-content/50 hover:text-error"
                    aria-label={`Delete saved view ${view.name}`}
                    onClick={() => onDeleteView(view.id)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save current view */}
      {hasActiveFilters && onSaveView && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newViewName}
            onChange={e => setNewViewName(e.target.value)}
            placeholder="View name..."
            className="flex-1"
          />
          <Button type="button" size="sm" variant="outline" onClick={handleSaveView}>
            Save view
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="todo-filter-search" className="text-sm font-medium text-base-content">
          Search
        </label>
        <Input
          id="todo-filter-search"
          type="search"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search title, description, or #tag"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-base-content">Priority</div>
        <ButtonGroup value={priority} onValueChange={p => onPriorityChange(p as PriorityFilter)}>
          {PRIORITY_OPTIONS.map(option => (
            <Button key={option} value={option} size="sm">
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-base-content">Status</div>
        <ButtonGroup value={status} onValueChange={s => onStatusChange(s as StatusFilter)}>
          {STATUS_OPTIONS.map(option => (
            <Button key={option} value={option} size="sm">
              {option === 'all' ? 'Any' : option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!hasActiveFilters}
          onClick={() => {
            onSearchChange('');
            onPriorityChange('all');
            onStatusChange('all');
            onClear?.();
          }}
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
};

export default TodoFilters;

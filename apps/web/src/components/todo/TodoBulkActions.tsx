'use client';

import React from 'react';
import { Button } from '@todo/ui-web';

export interface TodoBulkActionsProps {
  onMarkAllDone: () => void;
  onClearCompleted: () => void;
  onUndo?: () => void;
  hasTodos: boolean;
  hasCompleted: boolean;
  canUndo?: boolean;
  statusMessage?: string | null;
}

export const TodoBulkActions: React.FC<TodoBulkActionsProps> = ({
  onMarkAllDone,
  onClearCompleted,
  onUndo,
  hasTodos,
  hasCompleted,
  canUndo = false,
  statusMessage,
}) => {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onMarkAllDone}
            disabled={!hasTodos}
            aria-label="Mark all todos as done"
            className="focus:ring-2 focus:ring-primary"
          >
            Mark all done
          </Button>
          <Button
            type="button"
            size="sm"
            variant="error"
            onClick={onClearCompleted}
            disabled={!hasCompleted}
            aria-label="Clear all completed todos"
            className="focus:ring-2 focus:ring-primary"
          >
            Clear completed
          </Button>
        </div>

        {onUndo ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last action"
            className="focus:ring-2 focus:ring-primary"
          >
            Undo
          </Button>
        ) : null}
      </div>

      {statusMessage ? <div className="mt-3 text-sm text-base-content/70">{statusMessage}</div> : null}
    </div>
  );
};

export default TodoBulkActions;

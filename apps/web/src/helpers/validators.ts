/**
 * Application-level validation helpers used across the web app.
 *
 * These are intentionally simple so they can be consumed by both
 * components and test suites without heavy dependencies.
 */

/** Acceptable priority values for a todo item. */
export type TodoPriority = 'low' | 'medium' | 'high';

/** Shape of a minimal validated todo. */
export interface ValidatedTodo {
  id: string;
  title: string;
  priority: TodoPriority;
  completed: boolean;
}

/**
 * Returns true when `value` is a non-empty string.
 */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Returns true when `value` is a recognised todo priority.
 */
export function isValidPriority(value: unknown): value is TodoPriority {
  return typeof value === 'string' && ['low', 'medium', 'high'].includes(value);
}

/**
 * Validates a plain object as a bare-minimum Todo.
 * Returns an array of field-level error messages (empty = valid).
 */
export function validateTodoShape(raw: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (!isNonEmpty(raw.id)) errors.push('id: must be a non-empty string');
  if (!isNonEmpty(raw.title)) errors.push('title: must be a non-empty string');
  if (typeof raw.completed !== 'boolean')
    errors.push('completed: must be a boolean');
  if (!isValidPriority(raw.priority))
    errors.push('priority: must be one of "low", "medium", "high"');

  return errors;
}

/**
 * Coerces a validated plain object into a ValidatedTodo.
 * Throws when the shape is invalid.
 */
export function toValidatedTodo(raw: Record<string, unknown>): ValidatedTodo {
  const errors = validateTodoShape(raw);
  if (errors.length > 0) {
    throw new Error(`Invalid todo shape: ${errors.join('; ')}`);
  }
  return {
    id: String(raw.id),
    title: String(raw.title),
    priority: raw.priority as TodoPriority,
    completed: Boolean(raw.completed),
  };
}

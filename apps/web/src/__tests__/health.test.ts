/**
 * Health-check test suite for the @todo/web Jest surface.
 *
 * These tests validate that the core validation utilities work correctly.
 * They do *not* depend on React, Next.js, or any external service.
 */

import {
  isNonEmpty,
  isValidPriority,
  validateTodoShape,
  toValidatedTodo,
} from '@/helpers/validators';

// ---------------------------------------------------------------------------
// isNonEmpty
// ---------------------------------------------------------------------------
describe('isNonEmpty', () => {
  it('returns false for empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('returns false for non-string values', () => {
    expect(isNonEmpty(undefined)).toBe(false);
    expect(isNonEmpty(null)).toBe(false);
    expect(isNonEmpty(42)).toBe(false);
    expect(isNonEmpty({})).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidPriority
// ---------------------------------------------------------------------------
describe('isValidPriority', () => {
  it('accepts low, medium, high', () => {
    expect(isValidPriority('low')).toBe(true);
    expect(isValidPriority('medium')).toBe(true);
    expect(isValidPriority('high')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('')).toBe(false);
    expect(isValidPriority(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateTodoShape
// ---------------------------------------------------------------------------
describe('validateTodoShape', () => {
  it('returns no errors for a valid todo', () => {
    const errors = validateTodoShape({
      id: 'abc-123',
      title: 'Test',
      completed: false,
      priority: 'medium',
    });
    expect(errors).toEqual([]);
  });

  it('returns errors when fields are missing', () => {
    const errors = validateTodoShape({});
    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('id'),
        expect.stringContaining('title'),
        expect.stringContaining('priority'),
      ]),
    );
  });

  it('detects invalid priority', () => {
    const errors = validateTodoShape({
      id: 'x',
      title: 'x',
      completed: false,
      priority: 'critical',
    });
    expect(errors).toEqual(
      expect.arrayContaining([expect.stringContaining('priority')]),
    );
  });
});

// ---------------------------------------------------------------------------
// toValidatedTodo
// ---------------------------------------------------------------------------
describe('toValidatedTodo', () => {
  it('returns a ValidatedTodo when input is valid', () => {
    const todo = toValidatedTodo({
      id: '1',
      title: 'Health check',
      completed: true,
      priority: 'high',
    });
    expect(todo).toEqual({
      id: '1',
      title: 'Health check',
      completed: true,
      priority: 'high',
    });
  });

  it('throws when input is invalid', () => {
    expect(() =>
      toValidatedTodo({ id: '', title: '', completed: false, priority: 'urgent' }),
    ).toThrow('Invalid todo shape');
  });
});

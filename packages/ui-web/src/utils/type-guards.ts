export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function assertNever(x: never, message = 'Unexpected value'): never {
  throw new Error(`${message}: ${String(x)}`);
}

export function invariant(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

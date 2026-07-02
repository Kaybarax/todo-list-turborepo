/**
 * Health-check utilities for the web application.
 *
 * Provides deterministic, testable functions that verify the app is
 * configured and operating correctly.  Use {@link runHealthChecks} to
 * aggregate all checks into a single result.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HealthCheckResult {
  /** Human-readable name of the check. */
  name: string;
  /** Whether the check passed. */
  ok: boolean;
  /** Optional error or warning message. */
  message?: string;
}

export interface HealthSummary {
  /** Aggregate pass/fail. */
  healthy: boolean;
  /** Individual check results. */
  checks: HealthCheckResult[];
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

/**
 * Verify that every variable in `required` is set to a non-empty string in
 * `process.env`.  Returns one result per variable.
 */
export function checkEnvVars(required: string[]): HealthCheckResult[] {
  return required.map((name) => {
    const value = process.env[name];
    const ok = typeof value === "string" && value.length > 0;
    return {
      name: `env:${name}`,
      ok,
      message: ok ? undefined : `${name} is missing or empty`,
    };
  });
}

/**
 * Validate that a value has the shape of a Todo item used within the web app.
 * Returns a single result with a detailed message listing any problems.
 */
export function checkTodoShape(value: unknown): HealthCheckResult {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return { name: "todo-shape", ok: false, message: "value is null or undefined" };
  }

  if (typeof value !== "object") {
    return { name: "todo-shape", ok: false, message: "value is not an object" };
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.id !== "string") errors.push("id must be a string");
  if (typeof obj.title !== "string") errors.push("title must be a string");
  if (typeof obj.completed !== "boolean") errors.push("completed must be a boolean");
  if (typeof obj.priority !== "string") errors.push("priority must be a string");

  return {
    name: "todo-shape",
    ok: errors.length === 0,
    message: errors.length > 0 ? errors.join("; ") : undefined,
  };
}

// ---------------------------------------------------------------------------
// Aggregate runner
// ---------------------------------------------------------------------------

/**
 * Run all built-in health checks and return a summary.
 *
 * @param requiredEnvVars - Environment variables to check (defaults to the
 *   set expected by this app).
 */
export function runHealthChecks(
  requiredEnvVars?: string[],
): HealthSummary {
  const defaults: string[] = [
    "NEXT_PUBLIC_API_GATEWAY_URL",
    "NEXT_PUBLIC_API_URL",
  ];

  const checks: HealthCheckResult[] = [
    ...checkEnvVars(requiredEnvVars ?? defaults),
  ];

  const healthy = checks.every((c) => c.ok);
  return { healthy, checks };
}

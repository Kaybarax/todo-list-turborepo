import {
  checkEnvVars,
  checkTodoShape,
  runHealthChecks,
  type HealthCheckResult,
  type HealthSummary,
} from "@/lib/health";

describe("checkEnvVars", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    // Start each test with a clean copy of the real env so we don't pollute
    // across tests.
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns ok for every variable that is present and non-empty", () => {
    process.env.HEALTH_TEST_VAR = "present";
    const results = checkEnvVars(["HEALTH_TEST_VAR"]);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject<Partial<HealthCheckResult>>({
      name: "env:HEALTH_TEST_VAR",
      ok: true,
    });
  });

  it("returns fail for a variable that is missing", () => {
    delete process.env.HEALTH_TEST_MISSING;
    const results = checkEnvVars(["HEALTH_TEST_MISSING"]);
    expect(results[0].ok).toBe(false);
    expect(results[0].message).toMatch(/missing or empty/i);
  });

  it("returns fail for a variable set to an empty string", () => {
    process.env.HEALTH_TEST_EMPTY = "";
    const results = checkEnvVars(["HEALTH_TEST_EMPTY"]);
    expect(results[0].ok).toBe(false);
  });

  it("handles multiple variables in one call", () => {
    process.env.A = "1";
    delete process.env.B;
    const results = checkEnvVars(["A", "B"]);
    expect(results).toHaveLength(2);
    expect(results[0].ok).toBe(true);
    expect(results[1].ok).toBe(false);
  });
});

describe("checkTodoShape", () => {
  it("passes for a valid todo object", () => {
    const todo = { id: "1", title: "Test", completed: false, priority: "medium" };
    const result = checkTodoShape(todo);
    expect(result.ok).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("rejects null", () => {
    const result = checkTodoShape(null);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/null or undefined/i);
  });

  it("rejects undefined", () => {
    const result = checkTodoShape(undefined);
    expect(result.ok).toBe(false);
  });

  it("rejects a string", () => {
    const result = checkTodoShape("not-an-object");
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/not an object/i);
  });

  it("reports each missing or wrong-typed field", () => {
    const result = checkTodoShape({ id: 1, title: true, completed: "no", priority: null });
    expect(result.ok).toBe(false);
    expect(result.message).toContain("id must be a string");
    expect(result.message).toContain("title must be a string");
    expect(result.message).toContain("completed must be a boolean");
    expect(result.message).toContain("priority must be a string");
  });
});

describe("runHealthChecks", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns healthy=true when required env vars are set", () => {
    process.env.NEXT_PUBLIC_API_GATEWAY_URL = "http://localhost:3003";
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3003";
    const summary = runHealthChecks();
    expect(summary.healthy).toBe(true);
    expect(summary.checks.length).toBeGreaterThan(0);
    summary.checks.forEach((c) => expect(c.ok).toBe(true));
  });

  it("returns healthy=false when a required env var is missing", () => {
    delete process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3003";
    const summary = runHealthChecks();
    expect(summary.healthy).toBe(false);
    const failed = summary.checks.filter((c) => !c.ok);
    expect(failed.length).toBeGreaterThan(0);
  });

  it("accepts a custom list of required env vars", () => {
    process.env.CUSTOM_KEY = "set";
    const summary = runHealthChecks(["CUSTOM_KEY", "MISSING_KEY"]);
    expect(summary.healthy).toBe(false);
    expect(summary.checks).toHaveLength(2);
    expect(summary.checks[0].ok).toBe(true);
    expect(summary.checks[1].ok).toBe(false);
  });
});

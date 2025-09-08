# Performance Profiles

This directory stores JSON snapshots produced by the profiling harness (`profile-components.mjs`).

## Generate Latest

Run (after building the package):

```bash
pnpm --filter @todo/ui-mobile build
pnpm --filter @todo/ui-mobile profile:components:json
```

Outputs file: `perf/profile-latest.json`.

## Comparing Runs

1. Save baseline: `cp perf/profile-latest.json perf/profile-baseline-YYYYMMDD.json`
2. Make optimization changes (e.g., memoization, prop restructuring).
3. Re-run profiling with identical iteration count: `pnpm --filter @todo/ui-mobile profile:components 800 --json --out perf/profile-after.json`
4. Diff files (example):
   `diff -u perf/profile-baseline-YYYYMMDD.json perf/profile-after.json`

Key metrics to watch:

- `medianMs` (primary focus for typical renders)
- `p95Ms` (tail latency; spikes suggest occasional expensive paths)
- `avgMs` (sanity check; can be influenced by outliers)

Guideline (initial heuristic): median > 1ms or p95 > 3ms are candidates for memoization or prop churn investigation.

## Including Sample Timings

Add `--samples` if you need raw per-iteration timing arrays (increases file size):

```bash
pnpm --filter @todo/ui-mobile profile:components 800 --json --samples --out perf/profile-samples.json
```

## Stable Benchmarks

To reduce variance:

- Close other intensive processes.
- Use a consistent Node version.
- Run twice and compare to ensure stability (<10% variance in median).

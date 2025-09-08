#!/usr/bin/env node
/**
 * Phase 5 – P5-1 Profiling Harness (Simplified / Stable)
 * -----------------------------------------------------
 * The original render-based harness became unstable due to React Native / Flow
 * syntax in indirect imports. For P5-1 we only need to determine whether
 * mapping logic (variant/size/status/category) is expensive enough to justify
 * additional memoization beyond what already exists (simple object lookups &
 * existing useMemo in components like Avatar / Badge).
 *
 * This script micro-benchmarks the pure mapping + lightweight derivation work
 * that happens during a typical render for Button, Badge, Avatar & Text. If
 * median cost stays well below the guidance thresholds (1ms median / 3ms p95),
 * we conclude no further memoization is necessary.
 *
 * Usage:
 *   pnpm --filter @todo/ui-mobile profile:components [iterations]
 *   pnpm --filter @todo/ui-mobile profile:components 1000 --json --out perf/profile-ci.json --quiet-table
 *
 * Flags:
 *   --json, --out <file>, --quiet-table, --samples (same as previous harness)
 */

import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import {
  mapButtonAppearance,
  mapButtonStatus,
  mapButtonSize,
  mapTextCategory,
} from '../lib/utils/componentMappings.ts';

// Local light replicas for Avatar & Badge mapping logic (avoid RN / theme deps)
const avatarSizeToCategory = size => {
  switch (size) {
    case 'tiny':
      return 'c2';
    case 'small':
      return 'c1';
    case 'large':
      return 'h6';
    case 'giant':
      return 'h5';
    case 'medium':
    default:
      return 'p2';
  }
};

const badgeVariantColors = {
  default: { bg: '#EEE', fg: '#111' },
  primary: { bg: '#3366FF', fg: '#FFF' },
  secondary: { bg: '#8898AA', fg: '#FFF' },
  success: { bg: '#22C55E', fg: '#FFF' },
  warning: { bg: '#FACC15', fg: '#111' },
  danger: { bg: '#EF4444', fg: '#FFF' },
};

/** A synthetic render cost function returning a small object (avoids React). */
function simulateButton(i) {
  const variant = i % 2 ? 'primary' : 'secondary';
  const size = i % 3 === 0 ? 'lg' : 'md';
  return {
    appearance: mapButtonAppearance(variant),
    status: mapButtonStatus(variant),
    size: mapButtonSize(size),
    label: `Label ${i % 5}`,
  };
}

function simulateBadge(i) {
  const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
  const variant = variants[i % variants.length];
  const mapping = badgeVariantColors[variant] || badgeVariantColors.default;
  // pretend text measurement cost
  const text = String(i % 4);
  return { variant, ...mapping, textLength: text.length };
}

function simulateAvatar(i) {
  const sizes = ['tiny', 'small', 'medium', 'large', 'giant'];
  const size = sizes[i % sizes.length];
  const category = avatarSizeToCategory(size);
  const initials = `U${i % 10}`;
  return { size, category, initials };
}

function simulateText(i) {
  const variant = i % 2 ? 'body1' : 'caption';
  return { variant, category: mapTextCategory(variant), value: `Text ${i}` };
}

const targets = [
  { name: 'Button(primary)', fn: simulateButton },
  { name: 'Badge(status)', fn: simulateBadge },
  { name: 'Avatar(initials)', fn: simulateAvatar },
  { name: 'Text(variant)', fn: simulateText },
];

// -------------------------
// CLI ARG PARSING
// -------------------------
// Supported forms:
//   profile-components.mjs 800              -> 800 iterations (table output)
//   profile-components.mjs --json           -> JSON to stdout + table
//   profile-components.mjs --json --out perf/run.json  -> JSON file + table
//   profile-components.mjs --json --quiet-table        -> JSON only
//   profile-components.mjs 1000 --json --samples       -> include per-sample timings
// Flags:
//   --json            Emit JSON summary
//   --out <file>      Write JSON to file (implies --json)
//   --quiet-table     Suppress formatted table
//   --samples         Include raw samples array (can be large)

const argList = process.argv.slice(2);
let iterations = 500;
let emitJson = false;
let outPath = null;
let quietTable = false;
let includeSamples = false;
for (let i = 0; i < argList.length; i++) {
  const a = argList[i];
  if (!isNaN(Number(a))) {
    iterations = parseInt(a, 10);
    continue;
  }
  switch (a) {
    case '--json':
      emitJson = true;
      break;
    case '--out':
      outPath = argList[++i];
      emitJson = true;
      break;
    case '--quiet-table':
      quietTable = true;
      break;
    case '--samples':
      includeSamples = true;
      break;
    default:
      if (a.startsWith('--')) {
        console.warn(`Unknown flag: ${a}`);
      }
  }
}

// Execute benchmark
(function run() {
  const results = {};
  for (const t of targets) {
    const samples = [];
    let total = 0;
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      // Simulate the render-time mapping/derivation work
      t.fn(i);
      const dur = performance.now() - start;
      samples.push(dur);
      total += dur;
    }
    results[t.name] = { samples, total };
  }

  const derived = {};
  for (const [name, stat] of Object.entries(results)) {
    const sorted = [...stat.samples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    const avg = stat.total / (sorted.length || 1);
    derived[name] = {
      medianMs: median,
      avgMs: avg,
      p95Ms: p95,
      totalMs: stat.total,
      renders: sorted.length,
      ...(includeSamples ? { samples: stat.samples } : {}),
    };
  }

  const guidance = 'Median >1ms or P95 >3ms suggests investigating memoization or style object churn.';
  const fmt = n => n.toFixed(3);

  if (!quietTable) {
    console.log(`\nMapping Profiling (iterations=${iterations})`);
    console.log('--------------------------------------------------------------------------');
    console.log('Target                   Median(ms)  Avg(ms)  P95(ms)  Total(ms)  Renders');
    console.log('--------------------------------------------------------------------------');
    for (const [name, stats] of Object.entries(derived)) {
      console.log(
        `${name.padEnd(24)} ${fmt(stats.medianMs).padStart(9)} ${fmt(stats.avgMs).padStart(8)} ${fmt(stats.p95Ms).padStart(8)} ${fmt(stats.totalMs).padStart(10)} ${String(stats.renders).padStart(8)}`,
      );
    }
    console.log('--------------------------------------------------------------------------');
    console.log(`Guidance: ${guidance}`);
  }

  if (emitJson) {
    const payload = {
      timestamp: new Date().toISOString(),
      iterations,
      guidance,
      includeSamples,
      results: derived,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    if (outPath) {
      const dir = path.dirname(outPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(outPath, jsonStr, 'utf8');
      if (!quietTable) console.log(`\nJSON written to ${outPath}`);
    } else {
      console.log('\nJSON Output:');
      console.log(jsonStr);
    }
  }
})();

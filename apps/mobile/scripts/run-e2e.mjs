#!/usr/bin/env node
import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PORT = process.env.PORT || '8083';
const URL = `http://localhost:${PORT}`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(__dirname, '..');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForServer(url, timeoutMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      if (res.status >= 200 && res.status < 500) {
        const text = await res.text();
        if (text && text.includes('<title')) return true;
      }
    } catch {}
    await wait(2000);
  }
  return false;
}

async function main() {
  console.log(`[e2e] Starting Expo Web at ${URL}...`);
  const expo = spawn('pnpm', ['run', 'web'], {
    cwd,
    env: {
      ...process.env,
      BROWSER: 'none',
      EXPO_NO_TELEMETRY: '1',
      EXPO_NO_INTERACTIVE: '1',
      CI: '1',
      PORT,
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  const ready = await waitForServer(URL);
  if (!ready) {
    console.error('[e2e] Expo Web did not become ready in time.');
    expo.kill('SIGINT');
    process.exit(1);
  }
  console.log('[e2e] Expo Web is ready. Running Playwright...');

  const pw = spawn('pnpm', ['exec', 'playwright', 'test', '--reporter=list'], {
    cwd,
    env: { ...process.env, SKIP_WEBSERVER: '1' },
    stdio: 'inherit',
  });

  pw.on('exit', async (code, signal) => {
    console.log('[e2e] Playwright finished, shutting down Expo...');
    expo.kill('SIGINT');
    // give expo a moment to exit cleanly
    await wait(2000);
    try {
      expo.kill('SIGKILL');
    } catch {}
    process.exit(code ?? (signal ? 1 : 0));
  });
}

main().catch(err => {
  console.error('[e2e] Fatal error:', err);
  process.exit(1);
});

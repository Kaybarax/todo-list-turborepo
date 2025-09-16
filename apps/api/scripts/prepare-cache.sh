#!/usr/bin/env bash
set -euo pipefail

# This script does NOT write cache values or source files.
# It only verifies that, if Redis is configured for runtime, it is reachable.

REQUIRE_REDIS_FOR_BUILD="${REQUIRE_REDIS_FOR_BUILD:-false}"

echo "[prepare-cache] Verifying cache backend readiness (non-destructive)..."

if [[ -z "${REDIS_URI:-}" ]]; then
  echo "[prepare-cache] REDIS_URI not set. Build remains independent of Redis. Runtime will use in-memory cache unless configured."
  if [[ "$REQUIRE_REDIS_FOR_BUILD" == "true" ]]; then
    echo "[prepare-cache] ERROR: REQUIRE_REDIS_FOR_BUILD=true but REDIS_URI is not set." >&2
    exit 1
  fi
  exit 0
fi

node -e "(async () => {try {const {createClient} = require('redis'); const c = createClient({ url: process.env.REDIS_URI }); c.on('error', ()=>{}); await c.connect(); await c.ping(); await c.quit(); console.log('[prepare-cache] Redis reachable.'); process.exit(0);} catch(e) { console.error('[prepare-cache] WARNING: Redis not reachable:', e && e.message ? e.message : e); process.exit(2); } })();"

status=$?
if [[ $status -ne 0 ]]; then
  if [[ "$REQUIRE_REDIS_FOR_BUILD" == "true" ]]; then
    echo "[prepare-cache] ERROR: Redis is required for build but is not reachable." >&2
    exit 1
  else
    echo "[prepare-cache] Proceeding without Redis (will fallback to in-memory at runtime)."
    exit 0
  fi
fi

echo "[prepare-cache] Cache backend check complete."

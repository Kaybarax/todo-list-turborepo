#!/usr/bin/env bash
#
# repo-clean.sh — Verify that no generated/build artifacts are committed in git.
#
# Intended as a repeatable CI/local check.  Exits 0 when the working tree
# contains no tracked generated artifacts, or 1 (with a list) when it does.
#
# Usage:
#   scripts/repo-clean.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

GENERATED_PATTERNS=(
  '.turbo'
  '.next'
  'dist/'
  'build/'
  'coverage/'
  'test-results/'
  'playwright-report/'
  'storybook-static/'
  '.DS_Store'
)

violations=0

for pattern in "${GENERATED_PATTERNS[@]}"; do
  while IFS= read -r file; do
    # Skip node_modules paths (should never be tracked, but be safe)
    if [[ "$file" == node_modules/* ]]; then
      continue
    fi
    echo "ERROR: Committed generated artifact: $file"
    violations=$((violations + 1))
  done < <(git ls-files --cached -- "$pattern" 2>/dev/null || true)
done

if [[ $violations -eq 0 ]]; then
  echo "OK — no generated artifacts are tracked by git."
  exit 0
else
  echo ""
  echo "Found $violations generated artifact(s) tracked in git."
  echo "Remove them with:  git rm --cached <file>  and add the path to .gitignore"
  exit 1
fi

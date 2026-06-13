#!/usr/bin/env bash
#
# repo-clean.sh — verify no generated/build artifacts are committed in git
#
# Checks that none of the following patterns exist in git's tracked files:
#   .DS_Store, .turbo, .next, dist, coverage, test-results, playwright-report
#
# Usage:
#   scripts/repo-clean.sh          # check; exits 0 if clean, 1 if dirty
#   scripts/repo-clean.sh --list   # list offending files only (no exit code)
#
# Exit codes:
#   0 — no committed artifacts found
#   1 — committed artifacts found (and --list was not passed)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LIST_ONLY=0
if [[ "${1:-}" == "--list" ]]; then
  LIST_ONLY=1
fi

# Patterns that should never be committed
PATTERNS=(
  '.DS_Store'
  '.turbo'
  '.next'
  'dist'
  'coverage'
  'test-results'
  'playwright-report'
)

# Build a combined `git ls-files` check
OFFENDING=$(
  {
    for pattern in "${PATTERNS[@]}"; do
      git ls-files -- "$pattern" 2>/dev/null || true
    done
  } | sort -u | grep -v '^$' || true
)

if [[ -z "$OFFENDING" ]]; then
  if [[ $LIST_ONLY -eq 0 ]]; then
    echo "✓ repo-clean: no committed generated artifacts found."
  fi
  exit 0
fi

if [[ $LIST_ONLY -eq 1 ]]; then
  echo "$OFFENDING"
  exit 0
fi

echo "✗ repo-clean: committed generated artifacts detected!"
echo ""
echo "$OFFENDING"
echo ""
echo "Run the following to investigate:"
echo "  git rm --cached <file>   # stop tracking an artifact"
echo "  git update-index --assume-unchanged <file>  # (not recommended)"
echo ""
echo "After removing artifacts, update .gitignore if needed."
exit 1

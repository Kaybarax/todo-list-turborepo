#!/usr/bin/env bash
#
# repo-clean-check.sh
#
# Verify that no generated/build artifacts are committed in the repository.
# Fails (exit 1) if any tracked file matches patterns for common artifacts
# that should only live in .gitignore, not in the working tree.
#
# Usage:
#   scripts/repo-clean-check.sh
#
# Exit codes:
#   0 – all clean
#   1 – one or more artifact patterns matched tracked files

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

status=0

# Match a path segment (or the whole path) against a pattern.
# Returns 0 if the pattern appears as a complete path component.
path_segment_matches() {
  local file="$1"
  local pattern="$2"

  # Exact match (entire path is the pattern)
  [ "$file" = "$pattern" ] && return 0

  # Starts with pattern/
  case "$file" in
    "$pattern/"*) return 0 ;;
  esac

  # Contains /pattern/ or ends with /pattern
  case "$file" in
    */"$pattern"/*) return 0 ;;
    */"$pattern") return 0 ;;
  esac

  return 1
}

# Patterns that identify generated / build artifacts that must never be tracked.
patterns=(
  '.DS_Store'
  '.turbo'
  '.next'
  'dist'
  'coverage'
  'test-results'
  'playwright-report'
)

# Collect all tracked files once, then check each against every pattern.
mapfile -t tracked_files < <(git ls-files --cached 2>/dev/null || true)

for pattern in "${patterns[@]}"; do
  for file in "${tracked_files[@]}"; do
    if path_segment_matches "$file" "$pattern"; then
      echo -e "${RED}[FAIL]${NC} Tracked artifact: $file"
      status=1
    fi
  done
done

if [ "$status" -eq 0 ]; then
  echo -e "${GREEN}[PASS]${NC} No generated/build artifacts are tracked in git."
fi

exit "$status"

#!/usr/bin/env bash
# repo-clean.sh — Verify repository cleanliness by scanning for generated
# artifacts, ignored runtime folders, and stale validation/test output.
#
# Usage:
#   scripts/repo-clean.sh           # Check and report (exit 1 if dirty)
#   scripts/repo-clean.sh --quiet   # Suppress output, exit code only
#   scripts/repo-clean.sh --list    # Only list known artifact patterns
#
# Exit codes:
#   0 — repository is clean
#   1 — artifacts or leftover files found

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

QUIET=0
LIST_ONLY=0
EXIT_CODE=0

usage() {
    cat <<EOF
repo-clean.sh — Verify repository cleanliness

Scans the working tree for generated build artifacts, ignored runtime
folders, and leftover validation/test output that should not be
tracked or left behind in a clean state.

USAGE:
  $0                  Check repository cleanliness (exit 1 if dirty)
  $0 --quiet          Suppress output, report exit code only
  $0 --list           Print known artifact patterns and exit
  $0 --help           Show this message

EXIT CODES:
  0   Repository is clean
  1   Artifacts or leftover files found

EXAMPLES:
  scripts/repo-clean.sh
  scripts/repo-clean.sh --quiet && echo "Repo is clean"
EOF
}

# ---- Pattern lists ------------------------------------------------

BUILD_ARTIFACT_DIRS=(
    ".turbo" "dist" "build" ".build" ".dist" ".next"
    "out" "storybook-static" "chromatic-output"
    "coverage" ".nyc_output" "playwright-report" "test-results"
    "artifacts" "typechain" "typechain-types" "target"
    ".expo" "web-build" ".docusaurus"
)

RUNTIME_DIRS=(
    "node_modules" ".pnp" ".pnp.js"
    "logs" ".cache" "cache"
    ".terraform" ".terragrunt-cache"
)

STALE_FILE_PATTERNS=(
    "*.tsbuildinfo" "*.log" "npm-debug.log*" "yarn-debug.log*"
    "yarn-error.log*" "pnpm-debug.log*" "lerna-debug.log*"
    ".eslintcache" "chromatic-diagnostics.json"
    "crash.log" "crash.*.log"
)

SPECIFIC_IGNORED_FILES=(
    ".env" ".env.local" ".env.development.local"
    ".env.test.local" ".env.production.local"
)

# ---- Helpers ------------------------------------------------------

list_patterns() {
    echo "=== Build artifact directories ==="
    printf "  %s\n" "${BUILD_ARTIFACT_DIRS[@]}"
    echo "=== Runtime / ignored directories ==="
    printf "  %s\n" "${RUNTIME_DIRS[@]}"
    echo "=== Stale / leftover file patterns ==="
    printf "  %s\n" "${STALE_FILE_PATTERNS[@]}"
    exit 0
}

found_any=false

report() {
    local severity="$1"  # WARN or ERROR
    local path="$2"
    local label="$3"
    found_any=true
    EXIT_CODE=1
    if [[ $QUIET -eq 0 ]]; then
        printf "  [%s] %s  (%s)\n" "$severity" "$path" "$label"
    fi
}

# ---- Scan functions -----------------------------------------------

check_build_artifacts() {
    local dir
    for dir in "${BUILD_ARTIFACT_DIRS[@]}"; do
        while IFS= read -r -d '' found; do
            local rel="${found#./}"
            report "WARN" "$rel" "build artifact"
        done < <(find . -path "./.git" -prune -o -path "*/node_modules/*" -prune -o -type d -name "$dir" -print0 2>/dev/null || true)
    done
}

check_runtime_dirs() {
    local dir
    for dir in "${RUNTIME_DIRS[@]}"; do
        local find_exclude
        find_exclude=""
        # skip */src/cache — those are intentional tracked dirs (see .gitignore exceptions)
        if [[ "$dir" == "cache" ]]; then
            find_exclude="-path \"*/src/cache\" -prune -o"
        fi
        while IFS= read -r -d '' found; do
            local rel="${found#./}"
            report "ERROR" "$rel" "runtime / ignored folder"
        done < <(eval find . -path \"./.git\" -prune -o "$find_exclude" -type d -name "$dir" -print0 2>/dev/null || true)
    done
}

check_stale_files() {
    local pat
    for pat in "${STALE_FILE_PATTERNS[@]}"; do
        # Convert glob to find-compatible -name pattern
        while IFS= read -r -d '' found; do
            local rel="${found#./}"
            report "WARN" "$rel" "stale / leftover file"
        done < <(find . -path "./.git" -prune -o -path "*/node_modules/*" -prune -o -type f -name "$pat" -print0 2>/dev/null || true)
    done
}

check_specific_ignored() {
    local f
    for f in "${SPECIFIC_IGNORED_FILES[@]}"; do
        if [[ -f "$f" ]]; then
            report "ERROR" "$f" "ignored file present"
        fi
    done
}

# ---- Main ---------------------------------------------------------

while [[ $# -gt 0 ]]; do
    case "$1" in
        --quiet|-q) QUIET=1; shift ;;
        --list|-l)  LIST_ONLY=1; shift ;;
        --help|-h)  usage; exit 0 ;;
        *) echo "Unknown option: $1"; usage; exit 2 ;;
    esac
done

if [[ $LIST_ONLY -eq 1 ]]; then
    list_patterns
fi

if [[ $QUIET -eq 0 ]]; then
    echo "--- repo-clean: scanning for artifacts & leftover files ---"
fi

check_build_artifacts
check_runtime_dirs
check_stale_files
check_specific_ignored

if [[ $QUIET -eq 0 ]]; then
    if $found_any; then
        echo "--- repo-clean: DIRTY — found items above ---"
    else
        echo "--- repo-clean: CLEAN ---"
    fi
fi

exit "$EXIT_CODE"

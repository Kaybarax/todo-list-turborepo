#!/usr/bin/env bash
# =============================================================================
# repo-clean-verify.sh — Verify repository cleanliness
#
# Scans for leftover generated artifacts, ignored runtime folders, and
# validation output that should have been removed by cleanup runs.
# Exits with 0 if clean, 1 if any detritus is found.
#
# Usage:
#   ./scripts/repo-clean-verify.sh                    # default scan
#   ./scripts/repo-clean-verify.sh --strict           # also flag optional caches
#   ./scripts/repo-clean-verify.sh --list             # print known patterns
#   ./scripts/repo-clean-verify.sh --help             # this message
#
# Exit codes:
#   0 — clean (no artefacts found)
#   1 — detritus found
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

STRICT=0
LIST=0
FOUND=0

usage() {
    cat <<'EOF'
repo-clean-verify.sh — Verify repository cleanliness

Scans the workspace for generated build artefacts, ignored runtime folders,
and validation/diagnostic output that should not persist in a clean tree.

Options:
    --strict     Also flag optional cache dirs (.cache, etc.)
    --list       Print known dirty patterns and exit
    --help       Show this message

Exit codes:
    0   Repository is clean
    1   Detritus found — run scripts/cleanup.sh or remove listed paths
EOF
}

# Patterns that are always suspect in a clean tree.
ALWAYS_DIRS=(
    ".turbo" "dist" "build" ".next" "out"
    "storybook-static" "chromatic-output"
    "coverage" "playwright-report" "test-results"
    "logs"
    "artifacts" "typechain" "typechain-types" "target"
    ".expo" "web-build"
)

ALWAYS_FILES=(
    ".eslintcache" "tsconfig.tsbuildinfo"
    "chromatic-diagnostics.json"
)

# Patterns flagged only under --strict.
STRICT_DIRS=(
    ".cache" "cache"
)

report() {
    local kind="$1" path="$2"
    echo "  [${kind}] ${path}"
    FOUND=1
}

scan() {
    # Dirs that are always suspicious.
    for name in "${ALWAYS_DIRS[@]}"; do
        while IFS= read -r -d $'\0' d; do
            report "dir" "$d"
        done < <(find . -path "./.git" -prune -o -path "*/node_modules/*" -prune -o -type d -name "$name" -print0 2>/dev/null || true)
    done

    # Files that are always suspicious.
    for name in "${ALWAYS_FILES[@]}"; do
        while IFS= read -r -d $'\0' f; do
            report "file" "$f"
        done < <(find . -path "./.git" -prune -o -path "*/node_modules/*" -prune -o -type f -name "$name" -print0 2>/dev/null || true)
    done

    # Strict-mode extras.
    if [[ $STRICT -eq 1 ]]; then
        for name in "${STRICT_DIRS[@]}"; do
            while IFS= read -r -d $'\0' d; do
                report "dir (strict)" "$d"
            done < <(find . -path "./.git" -prune -o -path "*/node_modules/*" -prune -o -type d -name "$name" -print0 2>/dev/null || true)
        done
    fi
}

# --- main ---

while [[ $# -gt 0 ]]; do
    case "$1" in
        --strict) STRICT=1;;
        --list)
            LIST=1
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
    shift
done

if [[ $LIST -eq 1 ]]; then
    echo "=== Always-flagged directories ==="
    printf '  %s\n' "${ALWAYS_DIRS[@]}"
    echo ""
    echo "=== Always-flagged files ==="
    printf '  %s\n' "${ALWAYS_FILES[@]}"
    echo ""
    echo "=== Strict-only directories ==="
    printf '  %s\n' "${STRICT_DIRS[@]}"
    echo ""
    echo "Add --strict to also flag optional caches."
    exit 0
fi

echo "Scanning repository for leftover artefacts ..."
scan

if [[ $FOUND -eq 0 ]]; then
    echo "✓ Repository is clean."
    exit 0
else
    echo ""
    echo "✗ Detritus found. Run 'scripts/cleanup.sh' or remove the paths above."
    exit 1
fi

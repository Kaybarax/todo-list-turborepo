#!/bin/bash
# ==============================================================================
# pnpm doctor repository-health — Inspect package scripts, workspace
# package discovery, and key repository hygiene in this turborepo.
#
# Usage:
#   ./scripts/doctor-repository-health.sh
#   pnpm doctor:repository-health
#
# Exit codes:
#   0  – all checks passed
#   1  – one or more checks failed
# ==============================================================================

set -euo pipefail

# -------------------------------------------------------------------
# Colours & helpers
# -------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[PASS]${NC}  $1"; ((PASS++)) || true; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; ((WARN++)) || true; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; ((FAIL++)) || true; }
heading() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

# -------------------------------------------------------------------
# 1.  Package scripts inspection
# -------------------------------------------------------------------
heading "Package Scripts"

ROOT_PKG="package.json"

# Core scripts every turborepo should define
REQUIRED_SCRIPTS=("dev" "build" "test" "lint" "clean")

missing=()
for script in "${REQUIRED_SCRIPTS[@]}"; do
  if ! jq -e ".scripts[\"$script\"]" "$ROOT_PKG" >/dev/null 2>&1; then
    missing+=("$script")
  fi
done

if [[ ${#missing[@]} -eq 0 ]]; then
  ok "All required scripts (${REQUIRED_SCRIPTS[*]}) are defined in $ROOT_PKG"
else
  fail "Missing required scripts in $ROOT_PKG: ${missing[*]}"
fi

# Warn about empty/unset scripts
while IFS=$'\t' read -r name cmd; do
  if [[ -z "$cmd" || "$cmd" == "echo"* ]]; then
    warn "Script '$name' in $ROOT_PKG appears to be a placeholder"
  fi
done < <(jq -r '.scripts | to_entries[] | [.key, .value] | @tsv' "$ROOT_PKG")

# Check for pnpm version alignment
PNG_VERSION=$(jq -r '.packageManager // ""' "$ROOT_PKG" | sed 's/^pnpm@//')
if [[ -n "$PNG_VERSION" ]]; then
  ok "packageManager field is present (pnpm@$PNG_VERSION)"
else
  warn "packageManager field is missing in $ROOT_PKG"
fi

# -------------------------------------------------------------------
# 2.  Workspace package discovery
# -------------------------------------------------------------------
heading "Workspace Package Discovery"

WS_FILE="pnpm-workspace.yaml"
if [[ ! -f "$WS_FILE" ]]; then
  fail "$WS_FILE not found — cannot validate workspace layout"
else
  ok "$WS_FILE exists"

  # Extract glob patterns from workspace yaml (simple yq-free parsing)
  # Uses [[:space:]] for macOS/BSD sed compatibility
  GLOBS=$(grep -E "^[[:space:]]+-[[:space:]]+['\"]?" "$WS_FILE" \
    | sed -E "s/^[[:space:]]+-[[:space:]]+['\"]?([^'\"]+)['\"]?/\1/" \
    | head -20)

  if [[ -z "$GLOBS" ]]; then
    warn "No package globs found in $WS_FILE"
  else
    while IFS= read -r glob; do
      # Convert glob to a find-compatible pattern
      dir="${glob//\*/_placeholder_}"
      base="${dir%/*}"
      [[ "$base" == "$dir" ]] && base="."

      matches=0
      while IFS= read -r -d '' pkg_json; do
        pkg_dir=$(dirname "$pkg_json")
        if [[ -f "$pkg_dir/package.json" ]]; then
          name=$(jq -r '.name // "unknown"' "$pkg_dir/package.json" 2>/dev/null)
          if [[ "$name" != "null" && "$name" != "unknown" ]]; then
            ok "  Discovered package '$name' at $pkg_dir"
            ((matches++)) || true
          else
            warn "  $pkg_dir/package.json is missing a 'name' field"
          fi
        fi
      done < <(find . -path "./$glob/package.json" -not -path "*/node_modules/*" -print0 2>/dev/null || true)

      if [[ $matches -eq 0 ]]; then
        warn "Glob '$glob' did not match any packages"
      fi
    done <<< "$GLOBS"
  fi
fi

# -------------------------------------------------------------------
# 3.  Repository hygiene
# -------------------------------------------------------------------
heading "Repository Hygiene"

# 3a. Essential config files
CONFIG_FILES=(
  ".editorconfig"
  ".env.example"
  ".gitignore"
  ".npmrc"
  ".prettierrc"
  "tsconfig.json"
  "turbo.json"
)

for f in "${CONFIG_FILES[@]}"; do
  if [[ -f "$f" ]]; then
    ok "$f is present"
  else
    warn "$f is missing"
  fi
done

# 3b. Check for .env committed directly
ENV_FILES=$(find . -maxdepth 1 -name ".env" -not -name ".env.*" 2>/dev/null)
if [[ -n "$ENV_FILES" ]]; then
  fail "Raw .env file committed — should be .env.example only"
fi

# 3c. Ensure .gitignore covers node_modules, dist, .turbo
for pattern in "node_modules" "dist" ".turbo" ".next" ".expo"; do
  if grep -qE "^/?${pattern}(/|\$)" .gitignore 2>/dev/null; then
    ok ".gitignore covers '$pattern'"
  else
    warn ".gitignore does not cover '$pattern'"
  fi
done

# 3d. No empty or unlinked package.json files in workspaces
find . -name "package.json" -not -path "*/node_modules/*" -print0 2>/dev/null |
  while IFS= read -r -d '' pj; do
    pkg_name=$(jq -r '.name // empty' "$pj" 2>/dev/null)
    pkg_ver=$(jq -r '.version // empty' "$pj" 2>/dev/null)
    if [[ -z "$pkg_name" ]]; then
      warn "$pj is missing a 'name' field"
    fi
    if [[ -z "$pkg_ver" ]]; then
      warn "$pj is missing a 'version' field"
    fi
  done

# 3e. Lockfile freshness
if [[ -f "pnpm-lock.yaml" ]]; then
  ok "pnpm-lock.yaml exists"
else
  fail "pnpm-lock.yaml is missing — run 'pnpm install'"
fi

# 3f. Prettier check (if configured)
if command -v prettier &>/dev/null; then
  if prettier --check "package.json" >/dev/null 2>&1; then
    ok "Root package.json is prettier-formatted"
  else
    warn "Root package.json is not prettier-formatted"
  fi
fi

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------
heading "Summary"
echo -e "  ${GREEN}PASS${NC}: $PASS   ${RED}FAIL${NC}: $FAIL   ${YELLOW}WARN${NC}: $WARN"

if [[ $FAIL -gt 0 ]]; then
  echo -e "\n${RED}❌  Some health checks failed. Address the FAIL items above.${NC}"
  exit 1
elif [[ $WARN -gt 0 ]]; then
  echo -e "\n${YELLOW}⚠️   All required checks passed, but review the warnings.${NC}"
  exit 0
else
  echo -e "\n${GREEN}✅  Repository is healthy.${NC}"
  exit 0
fi

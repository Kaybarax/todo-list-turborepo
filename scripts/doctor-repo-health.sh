#!/bin/bash
# pnpm doctor repository-health — Inspects package scripts, workspace
# package discovery, and general repository hygiene.
#
# Usage:
#   pnpm doctor:repo
#   ./scripts/doctor-repo-health.sh
#
# Exit codes:
#   0 — All checks passed
#   1 — One or more checks failed

set -euo pipefail

# ── Colours and helpers ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=1
errors=0

info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[PASS]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; errors=$((errors + 1)); }

# ── Workspace package discovery ──────────────────────────────────────
check_workspace_discovery() {
  info "Checking workspace package discovery…"

  # 1. pnpm-workspace.yaml must exist at root
  if [[ ! -f "pnpm-workspace.yaml" ]]; then
    fail "pnpm-workspace.yaml not found at repository root"
    return
  fi
  ok "pnpm-workspace.yaml present"

  # 2. Every glob in the workspace file should resolve to at least one
  #    directory containing a package.json.
  local globs
  globs=$(grep -E "^\s+-\s+" pnpm-workspace.yaml | sed 's/^\s*-\s*//' | sed 's/[ \t]*$//' | tr -d "'\"")
  while IFS= read -r glob; do
    [[ -z "$glob" ]] && continue
    # Expand glob; use shopt to handle nullglob properly
    local match=0
    # shellcheck disable=SC2086
    for dir in $glob; do
      if [[ -f "$dir/package.json" ]]; then
        ok "Glob '$glob' → $dir"
        match=1
      fi
    done
    if [[ $match -eq 0 ]]; then
      warn "Glob '$glob' does not match any directory with package.json"
    fi
  done <<< "$globs"
}

# ── Package scripts hygiene ───────────────────────────────────────────
check_package_scripts() {
  info "Checking package script consistency…"

  # Collect all package.json files (excluding node_modules)
  local pkg_files
  pkg_files=$(find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*")
  local prebuild_missing_count=0
  local test_present_count=0
  local build_present_count=0
  local total_count=0

  for pkg in $pkg_files; do
    # Skip the root package.json for some counts
    local is_root=false
    [[ "$(realpath "$pkg")" == "$(realpath package.json)" ]] && is_root=true

    total_count=$((total_count + 1))

    # Every workspace package should have a 'build' script (root excluded)
    if [[ "$is_root" == false ]]; then
      if grep -q '"build"' "$pkg" 2>/dev/null; then
        build_present_count=$((build_present_count + 1))
      else
        local pkg_name
        pkg_name=$(grep '"name"' "$pkg" | head -1 | sed 's/.*"name": *"\(.*\)".*/\1/')
        warn "Package $pkg_name ($pkg) is missing a 'build' script"
      fi
    fi

    # Check for 'test' script (skipping root)
    if [[ "$is_root" == false ]]; then
      if grep -q '"test"' "$pkg" 2>/dev/null; then
        test_present_count=$((test_present_count + 1))
      fi
    fi

    # 'prebuild' should not exist unless it references a valid package script
    if grep -q '"prebuild"' "$pkg" 2>/dev/null; then
      local prebuild_cmd
      prebuild_cmd=$(grep -A1 '"prebuild"' "$pkg" | tail -1 | sed 's/.*"prebuild": *"\(.*\)".*/\1/')
      if [[ "$prebuild_cmd" == *"tokens:build"* ]]; then
        # Reference script — check it exists in the same package
        if ! grep -q '"tokens:build"' "$pkg" 2>/dev/null; then
          prebuild_missing_count=$((prebuild_missing_count + 1))
          warn "prebuild in $pkg references tokens:build but no such script is defined"
        fi
      fi
    fi
  done

  ok "Scanned $total_count package.json files"
  ok "$build_present_count packages have a 'build' script"
  ok "$test_present_count packages have a 'test' script"

  if [[ $prebuild_missing_count -gt 0 ]]; then
    fail "$prebuild_missing_count package(s) have orphan prebuild references"
  fi
}

# ── Repository hygiene ────────────────────────────────────────────────
check_repo_hygiene() {
  info "Checking repository hygiene…"

  # 1. .gitignore should exist and contain key entries
  if [[ -f ".gitignore" ]]; then
    ok ".gitignore present"
    for entry in "node_modules" ".env" "dist" "build" ".next" "coverage"; do
      if grep -qFx "$entry" .gitignore 2>/dev/null; then
        ok ".gitignore covers '$entry'"
      else
        warn ".gitignore does not contain '$entry'"
      fi
    done
  else
    fail ".gitignore is missing"
  fi

  # 2. Root package.json should define engines.node and engines.pnpm
  local node_engine
  node_engine=$(grep -A2 '"engines"' package.json 2>/dev/null | grep '"node"' | sed 's/.*"node": *"\(.*\)".*/\1/')
  local pnpm_engine
  pnpm_engine=$(grep -A2 '"engines"' package.json 2>/dev/null | grep '"pnpm"' | sed 's/.*"pnpm": *"\(.*\)".*/\1/')

  if [[ -n "$node_engine" ]]; then
    ok "engines.node defined as '$node_engine'"
  else
    fail "engines.node not defined in root package.json"
  fi

  if [[ -n "$pnpm_engine" ]]; then
    ok "engines.pnpm defined as '$pnpm_engine'"
  else
    fail "engines.pnpm not defined in root package.json"
  fi

  # 3. pnpm-lock.yaml must exist
  if [[ -f "pnpm-lock.yaml" ]]; then
    ok "pnpm-lock.yaml present"
  else
    fail "pnpm-lock.yaml missing — run 'pnpm install'"
  fi

  # 4. Check for stale node_modules at root
  if [[ -d "node_modules" ]]; then
    ok "node_modules directory present"
  else
    warn "node_modules directory missing — run 'pnpm install'"
  fi

  # 5. .npmrc should exist
  if [[ -f ".npmrc" ]]; then
    ok ".npmrc present"
  else
    warn ".npmrc missing"
  fi

  # 6. turbo.json should exist (monorepo task runner config)
  if [[ -f "turbo.json" ]]; then
    ok "turbo.json present"
  else
    warn "turbo.json missing — pipeline tasks may not run"
  fi
}

# ── Main ──────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "╔══════════════════════════════════════════════════════╗"
  echo "║   pnpm doctor — repository-health                    ║"
  echo "╚══════════════════════════════════════════════════════╝"
  echo ""

  check_workspace_discovery
  echo ""
  check_package_scripts
  echo ""
  check_repo_hygiene
  echo ""

  # ── Summary ────────────────────────────────────────────────────────
  if [[ $errors -eq 0 ]]; then
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║   ✅ All repository health checks passed            ║"
    echo "╚══════════════════════════════════════════════════════╝"
    exit 0
  else
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║   ❌  $errors check(s) failed — see details above    ║"
    echo "╚══════════════════════════════════════════════════════╝"
    exit 1
  fi
}

main "$@"

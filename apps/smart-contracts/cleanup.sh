#!/usr/bin/env bash
set -euo pipefail
YES=0; DRY_RUN=0; VERBOSE=0
usage(){ echo "Usage: apps/smart-contracts/cleanup.sh [--yes] [--dry-run] [--verbose]"; }
while [[ $# -gt 0 ]]; do case "$1" in --yes|-y) YES=1;; --dry-run) DRY_RUN=1;; --verbose|-v) VERBOSE=1;; -h|--help) usage; exit 0;; *) echo "Unknown option: $1"; usage; exit 1;; esac; shift; done
confirm(){ [[ $YES -eq 1 ]] && return 0; read -r -p "$1 (y/N) " r || true; echo; [[ $r =~ ^[Yy]$ ]]; }
run_cmd(){ local c="$1"; [[ $DRY_RUN -eq 1 ]] && echo "DRY-RUN: $c" || eval "$c"; }
cd "$(cd "$(dirname "$0")" && pwd)"
echo "Cleaning Smart Contracts artifacts..."
dirs=(artifacts cache typechain typechain-types target dist build .turbo .cache)
files=(.eslintcache tsconfig.tsbuildinfo)
for d in "${dirs[@]}"; do [[ -d $d ]] && run_cmd "rm -rf $d"; done
for f in "${files[@]}"; do [[ -f $f ]] && run_cmd "rm -f $f"; done

# Also clean nested networks if any (e.g., subfolders per chain)
for sub in */ ; do
  [[ -d "$sub" ]] || continue
  pushd "$sub" >/dev/null || continue
  for d in artifacts cache typechain typechain-types target dist build .turbo .cache; do
    [[ -d $d ]] && run_cmd "rm -rf $d"
  done
  for f in .eslintcache tsconfig.tsbuildinfo; do
    [[ -f $f ]] && run_cmd "rm -f $f"
  done
  popd >/dev/null || true
done

if confirm "Remove node_modules in apps/smart-contracts and subfolders?"; then
  if [[ $DRY_RUN -eq 1 ]]; then find . -type d -name node_modules -print; else find . -type d -name node_modules -prune -print0 | xargs -0 rm -rf; fi
fi
echo "Smart contracts cleanup done."

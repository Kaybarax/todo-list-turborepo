#!/usr/bin/env bash
set -euo pipefail
YES=0; DRY_RUN=0; VERBOSE=0
usage(){ echo "Usage: packages/ui-web/cleanup.sh [--yes] [--dry-run] [--verbose]"; }
while [[ $# -gt 0 ]]; do case "$1" in --yes|-y) YES=1;; --dry-run) DRY_RUN=1;; --verbose|-v) VERBOSE=1;; -h|--help) usage; exit 0;; *) echo "Unknown option: $1"; usage; exit 1;; esac; shift; done
confirm(){ [[ $YES -eq 1 ]] && return 0; read -r -p "$1 (y/N) " r || true; echo; [[ $r =~ ^[Yy]$ ]]; }
run_cmd(){ local c="$1"; [[ $DRY_RUN -eq 1 ]] && echo "DRY-RUN: $c" || eval "$c"; }
cd "$(cd "$(dirname "$0")" && pwd)"
echo "Cleaning packages/ui-web artifacts..."
dirs=(dist build coverage logs .turbo .cache storybook-static chromatic-output)
files=(.eslintcache tsconfig.tsbuildinfo chromatic-diagnostics.json)
for d in "${dirs[@]}"; do [[ -d $d ]] && run_cmd "rm -rf $d"; done
for f in "${files[@]}"; do [[ -f $f ]] && run_cmd "rm -f $f"; done
if [[ -d showcase ]]; then
  echo "Cleaning packages/ui-web/showcase artifacts..."
  pushd showcase >/dev/null
  for d in dist build coverage logs .turbo .cache storybook-static; do [[ -d $d ]] && run_cmd "rm -rf $d"; done
  for f in .eslintcache tsconfig.tsbuildinfo; do [[ -f $f ]] && run_cmd "rm -f $f"; done
  popd >/dev/null
fi
if confirm "Remove node_modules in packages/ui-web (and showcase)?"; then
  run_cmd "rm -rf node_modules"
  [[ -d showcase/node_modules ]] && run_cmd "rm -rf showcase/node_modules"
fi
echo "packages/ui-web cleanup done."

#!/usr/bin/env bash
set -euo pipefail
YES=0; DRY_RUN=0; VERBOSE=0
usage(){ echo "Usage: apps/mobile/cleanup.sh [--yes] [--dry-run] [--verbose]"; }
while [[ $# -gt 0 ]]; do case "$1" in --yes|-y) YES=1;; --dry-run) DRY_RUN=1;; --verbose|-v) VERBOSE=1;; -h|--help) usage; exit 0;; *) echo "Unknown option: $1"; usage; exit 1;; esac; shift; done
confirm(){ [[ $YES -eq 1 ]] && return 0; read -r -p "$1 (y/N) " r || true; echo; [[ $r =~ ^[Yy]$ ]]; }
run_cmd(){ local c="$1"; [[ $DRY_RUN -eq 1 ]] && echo "DRY-RUN: $c" || eval "$c"; }
cd "$(cd "$(dirname "$0")" && pwd)"
echo "Cleaning Mobile (Expo) build artifacts..."
dirs=(dist build coverage logs .turbo .cache .expo web-build)
files=(.eslintcache tsconfig.tsbuildinfo)
for d in "${dirs[@]}"; do [[ -d $d ]] && run_cmd "rm -rf $d"; done
for f in "${files[@]}"; do [[ -f $f ]] && run_cmd "rm -f $f"; done
if confirm "Remove node_modules in apps/mobile?"; then run_cmd "rm -rf node_modules"; fi
echo "Mobile cleanup done."

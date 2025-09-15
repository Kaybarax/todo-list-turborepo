#!/usr/bin/env bash

# Monorepo cleanup utility
# - Cleans Docker compose resources and prunes images/volumes (optional)
# - Cleans Kubernetes resources defined under infra/kubernetes (optional)
# - Removes build artifacts across apps/* and packages/* (dist, build, .next, coverage, .turbo, etc.)
# - Removes node_modules by default (can be disabled)
# Usage:
#   scripts/cleanup.sh [--all] [--docker] [--k8s] [--artifacts] [--no-node] [--prune-docker] [--dry-run] [--yes] [--verbose]

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DOCKER=1
K8S=1
ARTIFACTS=1
NODE_MODULES=1
PRUNE_DOCKER=0
DRY_RUN=0
YES=0
VERBOSE=0

log() { echo -e "${1}"; }
debug() { [[ $VERBOSE -eq 1 ]] && echo "[debug] $1" || true; }

confirm() {
    local prompt="$1"
    if [[ $YES -eq 1 ]]; then return 0; fi
    read -r -p "$prompt (y/N) " reply || true
    echo
    [[ "$reply" =~ ^[Yy]$ ]]
}

usage() {
    cat <<EOF
Monorepo Cleanup

Options:
    --all             Run all cleanup steps (default behavior)
    --docker          Clean Docker compose resources (down -v) in available compose files
    --prune-docker    Prune Docker images/volumes/networks (dangling) after compose down
    --k8s             Clean Kubernetes resources from infra/kubernetes (if kubectl available)
    --artifacts       Remove build/test artifacts across repo
    --no-node         Do not remove node_modules (by default node_modules are removed)
    --dry-run         Show what would be removed without deleting
    --yes             Auto-approve prompts
    --verbose         Extra logging
    -h, --help        Show this help

Examples:
    scripts/cleanup.sh --dry-run
    scripts/cleanup.sh --yes --prune-docker
    scripts/cleanup.sh --docker --k8s --artifacts --no-node --yes
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --all) DOCKER=1; K8S=1; ARTIFACTS=1; NODE_MODULES=1;;
        --docker) DOCKER=1;;
        --prune-docker) PRUNE_DOCKER=1;;
        --k8s) K8S=1;;
        --artifacts) ARTIFACTS=1;;
        --no-node) NODE_MODULES=0;;
        --dry-run) DRY_RUN=1;;
        --yes|-y) YES=1;;
        --verbose|-v) VERBOSE=1;;
        -h|--help) usage; exit 0;;
        *) echo "Unknown option: $1"; usage; exit 1;;
    esac
    shift
done

run_cmd() {
    local cmd="$1"
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "DRY-RUN: $cmd"
    else
        eval "$cmd"
    fi
}

# Compose Down and Docker prune
clean_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        log "Docker is not installed or not on PATH. Skipping Docker cleanup."
        return 0
    fi

    local compose_files=(
        "docker-compose.dev.yml"
        "docker-compose.test.yml"
        "docker-compose.yml"
    )

    for f in "${compose_files[@]}"; do
        if [[ -f "$f" ]]; then
            log "Bringing down $f (with volumes, removing orphans)..."
            run_cmd "docker compose -f $f down -v --remove-orphans || docker-compose -f $f down -v --remove-orphans"
        fi
    done

    if [[ $PRUNE_DOCKER -eq 1 ]]; then
        if confirm "Prune dangling Docker images/volumes/networks?"; then
            run_cmd "docker image prune -f"
            run_cmd "docker volume prune -f"
            run_cmd "docker network prune -f"
            # Optional: prune build cache
            run_cmd "docker builder prune -f"
        fi
    fi
}

# Kubernetes cleanup (preserves older behavior)
clean_k8s() {
    if ! command -v kubectl >/dev/null 2>&1; then
        log "kubectl is not installed. Skipping Kubernetes cleanup."
        return 0
    fi

    # Ensure a reachable cluster/context
    if ! kubectl cluster-info >/dev/null 2>&1; then
        log "kubectl is present but no reachable cluster/context detected. Skipping Kubernetes cleanup."
        return 0
    fi

    # Default namespace file; resources are listed explicitly below
    local ns_file="infra/kubernetes/namespace.yaml"
    local has_ns_file=0
    [[ -f "$ns_file" ]] && has_ns_file=1

    log "Kubernetes cleanup selected. This will delete resources defined under infra/kubernetes/*.yaml."
    if ! confirm "Proceed with Kubernetes cleanup?"; then
        log "Skipping Kubernetes cleanup."
        return 0
    fi

    local files=(
        "infra/kubernetes/ingress.yaml"
        "infra/kubernetes/web-deployment.yaml"
        "infra/kubernetes/web-service.yaml"
        "infra/kubernetes/api-deployment.yaml"
        "infra/kubernetes/api-service.yaml"
        "infra/kubernetes/mongodb-secret.yaml"
    )

    for f in "${files[@]}"; do
        if [[ -f "$f" ]]; then
            log "Deleting $f ..."
                run_cmd "kubectl delete -f $f --ignore-not-found || true"
        else
            debug "Missing manifest: $f"
        fi
    done

    if [[ $has_ns_file -eq 1 ]]; then
        if confirm "Delete the namespace defined in $ns_file as well?"; then
                run_cmd "kubectl delete -f $ns_file --ignore-not-found || true"
        fi
    fi
}

# Artifact cleanup
clean_artifacts_repo() {
    log "Scanning for build/test artifacts to remove..."

    # Directory patterns to remove repo-wide
    local -a dir_patterns=(
        ".turbo" "dist" "build" ".next" "out" "storybook-static" "chromatic-output"
        "coverage" "playwright-report" "test-results" "logs" ".cache" "cache"
        "artifacts" "typechain" "typechain-types" "target" ".expo" "web-build"
    )

    # File patterns to remove repo-wide
    local -a file_patterns=(
        ".eslintcache" "tsconfig.tsbuildinfo" "chromatic-diagnostics.json"
    )

    # Remove directories by name everywhere (excluding .git)
    for name in "${dir_patterns[@]}"; do
        # find dirs named $name, prune node_modules if NODE_MODULES=0 to speed up
        if [[ $DRY_RUN -eq 1 ]]; then
            find . -path "./.git" -prune -o -type d -name "$name" -print
        else
            find . -path "./.git" -prune -o -type d -name "$name" -print0 | xargs -0 rm -rf
        fi
    done

    # Remove files by name everywhere
    for name in "${file_patterns[@]}"; do
        if [[ $DRY_RUN -eq 1 ]]; then
            find . -path "./.git" -prune -o -type f -name "$name" -print
        else
            find . -path "./.git" -prune -o -type f -name "$name" -print0 | xargs -0 rm -f
        fi
    done

    # Per-app special cases (if any future additions needed)
}

clean_node_modules_repo() {
    if [[ $NODE_MODULES -eq 0 ]]; then
        debug "Skipping node_modules removal by user request."
        return 0
    fi
    if ! confirm "Remove ALL node_modules across the repository?"; then
        log "Skipping node_modules removal."
        return 0
    fi
    if [[ $DRY_RUN -eq 1 ]]; then
        find . -path "./.git" -prune -o -type d -name node_modules -print
    else
        find . -path "./.git" -prune -o -type d -name node_modules -print0 | xargs -0 rm -rf
    fi
}

run_per_service_cleanups() {
    # Auto-discover and run any per-service cleanup scripts under apps/*
    while IFS= read -r -d '' s; do
        if [[ -x "$s" ]]; then
            log "Running per-service cleanup: $s"
            if [[ $DRY_RUN -eq 1 ]]; then
                echo "DRY-RUN: $s --yes"
            else
                "$s" --yes || true
            fi
        fi
    done < <(find apps -maxdepth 2 -type f -name cleanup.sh -print0 2>/dev/null)

    # Auto-discover and run package cleanups under packages/*
    while IFS= read -r -d '' s; do
        if [[ -x "$s" ]]; then
            log "Running package cleanup: $s"
            if [[ $DRY_RUN -eq 1 ]]; then
                echo "DRY-RUN: $s --yes"
            else
                "$s" --yes || true
            fi
        fi
    done < <(find packages -maxdepth 2 -type f -name cleanup.sh -print0 2>/dev/null)
}

main() {
    log "Starting monorepo cleanup (dry-run=$DRY_RUN)"

    if [[ $DOCKER -eq 1 ]]; then
        clean_docker
    fi
    if [[ $K8S -eq 1 ]]; then
        clean_k8s
    fi

    run_per_service_cleanups

    if [[ $ARTIFACTS -eq 1 ]]; then
        clean_artifacts_repo
    fi
    clean_node_modules_repo

    log "Cleanup completed."
}

main "$@"

#!/bin/bash

# Doctor script - Repository health diagnostic
# Checks development environment for required and optional tools

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version strings (semver)
version_gte() {
    local version="$1"
    local required="$2"
    printf '%s\n' "$required" "$version" | sort -V | head -n1 | grep -q "^$required$"
}

# Track overall status
HAS_ERRORS=false

print_status "Running repository health diagnostics..."
echo ""

# ---- Required checks ----

# Node.js version
print_status "Checking Node.js..."
if command_exists node; then
    node_version=$(node --version | sed 's/^v//')
    if version_gte "$node_version" "22.18.0"; then
        print_success "Node.js $node_version (>= 22.18.0)"
    else
        print_error "Node.js $node_version (< 22.18.0 required)"
        HAS_ERRORS=true
    fi
else
    print_error "Node.js not found (>= 22.18.0 required)"
    HAS_ERRORS=true
fi

# pnpm version
print_status "Checking pnpm..."
if command_exists pnpm; then
    pnpm_version=$(pnpm --version)
    if version_gte "$pnpm_version" "9.0.0"; then
        print_success "pnpm $pnpm_version (>= 9.0.0)"
    else
        print_error "pnpm $pnpm_version (< 9.0.0 required)"
        HAS_ERRORS=true
    fi
else
    print_error "pnpm not found (>= 9.0.0 required)"
    HAS_ERRORS=true
fi

echo ""

# ---- Optional checks ----

# Bun
print_status "Checking Bun..."
if command_exists bun; then
    bun_version=$(bun --version 2>/dev/null || echo "?")
    print_success "Bun $bun_version"
else
    print_warning "Bun not found (optional - required for apps/api-bun)"
fi

# Docker
print_status "Checking Docker..."
if command_exists docker; then
    docker_version=$(docker --version 2>/dev/null || echo "?")
    print_success "Docker $docker_version"
    if docker info >/dev/null 2>&1; then
        print_success "Docker daemon running"
    else
        print_warning "Docker daemon not running (optional - required for local infrastructure)"
    fi
else
    print_warning "Docker not found (optional - required for local infrastructure)"
fi

# Terraform
print_status "Checking Terraform..."
if command_exists terraform; then
    tf_version=$(terraform --version 2>/dev/null | head -n1 || echo "?")
    print_success "Terraform $tf_version"
else
    print_warning "Terraform not found (optional - required for infrastructure management)"
fi

# Terragrunt
print_status "Checking Terragrunt..."
if command_exists terragrunt; then
    tg_version=$(terragrunt --version 2>/dev/null | head -n1 || echo "?")
    print_success "Terragrunt $tg_version"
else
    print_warning "Terragrunt not found (optional - required for infrastructure management)"
fi

# Rust/Cargo
print_status "Checking Rust..."
if command_exists rustc && command_exists cargo; then
    rust_version=$(rustc --version 2>/dev/null || echo "?")
    print_success "Rust $rust_version"
else
    print_warning "Rust/Cargo not found (optional - required for Solana and Polkadot development)"
fi

# Solana CLI
print_status "Checking Solana CLI..."
if command_exists solana; then
    solana_version=$(solana --version 2>/dev/null || echo "?")
    print_success "Solana CLI $solana_version"
else
    print_warning "Solana CLI not found (optional - required for Solana development)"
fi

# Anchor CLI
print_status "Checking Anchor CLI..."
if command_exists anchor; then
    anchor_version=$(anchor --version 2>/dev/null || echo "?")
    print_success "Anchor CLI $anchor_version"
else
    print_warning "Anchor CLI not found (optional - required for Solana development)"
fi

# Expo/EAS CLI
print_status "Checking Expo/EAS CLI..."
if command_exists expo; then
    expo_version=$(expo --version 2>/dev/null || echo "?")
    print_success "Expo CLI $expo_version"
else
    print_warning "Expo CLI not found (optional - required for mobile development)"
fi
if command_exists eas; then
    eas_version=$(eas --version 2>/dev/null || echo "?")
    print_success "EAS CLI $eas_version"
else
    print_warning "EAS CLI not found (optional - required for mobile deployment)"
fi

echo ""

# Summary
if [ "$HAS_ERRORS" = true ]; then
    print_error "Some required checks failed. Fix the issues above and re-run."
    exit 1
else
    print_success "All required tools are available."
    exit 0
fi

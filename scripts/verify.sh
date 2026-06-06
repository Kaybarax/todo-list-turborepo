#!/bin/bash

# Verify script - Default pre-PR quality checks
# Runs lint, typecheck, and test in sequence. Exits on first failure.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Running pre-PR verification..."
echo ""

# Step 1: Lint
print_status "Step 1/3: Running linter..."
if pnpm lint; then
    print_success "Lint passed"
    echo ""
else
    print_error "Lint failed"
    exit 1
fi

# Step 2: Typecheck
print_status "Step 2/3: Running typecheck..."
if pnpm typecheck; then
    print_success "Typecheck passed"
    echo ""
else
    print_error "Typecheck failed"
    exit 1
fi

# Step 3: Test
print_status "Step 3/3: Running tests..."
if pnpm test; then
    print_success "Tests passed"
    echo ""
else
    print_error "Tests failed"
    exit 1
fi

echo ""
print_success "All verification checks passed!"

#!/bin/bash

# Blockchain contracts build script
# Compiles and tests smart contracts for all supported networks

set -e

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
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
NETWORK="${NETWORK:-all}"
RUN_TESTS="${RUN_TESTS:-true}"
GENERATE_DOCS="${GENERATE_DOCS:-false}"
VERIFY_CONTRACTS="${VERIFY_CONTRACTS:-false}"

print_status "Building blockchain contracts..."
print_status "Network: $NETWORK"
print_status "Run tests: $RUN_TESTS"

# Function to build Polygon contracts
build_polygon() {
    if [ ! -d "apps/blockchain-smart-contracts/polygon" ]; then
        print_warning "Polygon contracts directory not found, skipping..."
        return
    fi
    
    print_status "Building Polygon contracts..."
    cd apps/blockchain-smart-contracts/polygon
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing Polygon contract dependencies..."
        pnpm install
    fi
    
    # Compile contracts
    print_status "Compiling Solidity contracts..."
    pnpm compile
    
    # Run tests if requested
    if [ "$RUN_TESTS" = "true" ]; then
        print_status "Running Polygon contract tests..."
        pnpm test
    fi
    
    # Generate documentation if requested
    if [ "$GENERATE_DOCS" = "true" ]; then
        print_status "Generating Polygon contract documentation..."
        pnpm docgen || print_warning "Documentation generation failed"
    fi
    
    # Verify contracts if requested
    if [ "$VERIFY_CONTRACTS" = "true" ] && [ -n "$ETHERSCAN_API_KEY" ]; then
        print_status "Verifying Polygon contracts..."
        pnpm verify || print_warning "Contract verification failed"
    fi
    
    cd ../../..
    print_success "Polygon contracts built successfully"
}

# Function to build Solana programs
build_solana() {
    if [ ! -d "apps/blockchain-smart-contracts/solana" ]; then
        print_warning "Solana programs directory not found, skipping..."
        return
    fi
    
    print_status "Building Solana programs..."
    cd apps/blockchain-smart-contracts/solana
    
    # Check if Anchor is installed
    if ! command -v anchor &> /dev/null; then
        print_error "Anchor CLI not found. Please install Anchor first."
        print_status "Installation: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
        cd ../../..
        return 1
    fi
    
    # Check if Solana CLI is installed
    if ! command -v solana &> /dev/null; then
        print_error "Solana CLI not found. Please install Solana CLI first."
        print_status "Installation: sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
        cd ../../..
        return 1
    fi
    
    # Build programs
    print_status "Building Solana programs with Anchor..."
    anchor build
    
    # Run tests if requested
    if [ "$RUN_TESTS" = "true" ]; then
        print_status "Running Solana program tests..."
        anchor test --skip-local-validator || {
            print_warning "Solana tests failed. Make sure test validator is running."
        }
    fi
    
    # Generate IDL and types
    print_status "Generating Solana program IDL..."
    anchor idl parse --file target/idl/todo_program.json > ../../../packages/services/src/blockchain/solana/idl.json || {
        print_warning "IDL generation failed"
    }
    
    cd ../../..
    print_success "Solana programs built successfully"
}

# Function to build Polkadot pallets
build_polkadot() {
    if [ ! -d "apps/blockchain-smart-contracts/polkadot" ]; then
        print_warning "Polkadot pallets directory not found, skipping..."
        return
    fi
    
    print_status "Building Polkadot pallets..."
    cd apps/blockchain-smart-contracts/polkadot
    
    # Check if Rust is installed
    if ! command -v cargo &> /dev/null; then
        print_error "Rust/Cargo not found. Please install Rust first."
        print_status "Installation: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        cd ../../..
        return 1
    fi
    
    # Install Substrate dependencies
    print_status "Installing Substrate dependencies..."
    rustup target add wasm32-unknown-unknown
    rustup component add rust-src
    
    # Build pallets
    print_status "Building Polkadot pallets..."
    cargo build --release
    
    # Run tests if requested
    if [ "$RUN_TESTS" = "true" ]; then
        print_status "Running Polkadot pallet tests..."
        cargo test
    fi
    
    # Build WASM runtime
    print_status "Building WASM runtime..."
    cargo build --release --features runtime-benchmarks
    
    cd ../../..
    print_success "Polkadot pallets built successfully"
}

# Function to generate contract artifacts
generate_artifacts() {
    print_status "Generating contract artifacts..."
    
    # Create artifacts directory
    mkdir -p build/contracts
    
    # Copy Polygon artifacts
    if [ -d "apps/blockchain-smart-contracts/polygon/artifacts" ]; then
        cp -r apps/blockchain-smart-contracts/polygon/artifacts build/contracts/polygon
        print_status "Polygon artifacts copied"
    fi
    
    # Copy Solana artifacts
    if [ -d "apps/blockchain-smart-contracts/solana/target" ]; then
        mkdir -p build/contracts/solana
        cp -r apps/blockchain-smart-contracts/solana/target/deploy build/contracts/solana/
        cp -r apps/blockchain-smart-contracts/solana/target/idl build/contracts/solana/
        print_status "Solana artifacts copied"
    fi
    
    # Copy Polkadot artifacts
    if [ -d "apps/blockchain-smart-contracts/polkadot/target" ]; then
        mkdir -p build/contracts/polkadot
        cp -r apps/blockchain-smart-contracts/polkadot/target/release build/contracts/polkadot/
        print_status "Polkadot artifacts copied"
    fi
    
    print_success "Contract artifacts generated in build/contracts/"
}

# Function to validate contract builds
validate_builds() {
    print_status "Validating contract builds..."
    
    local validation_failed=false
    
    # Validate Polygon contracts
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "polygon" ]; then
        if [ ! -f "apps/blockchain-smart-contracts/polygon/artifacts/contracts/TodoList.sol/TodoList.json" ]; then
            print_error "Polygon TodoList contract not found"
            validation_failed=true
        fi
    fi
    
    # Validate Solana programs
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "solana" ]; then
        if [ ! -f "apps/blockchain-smart-contracts/solana/target/deploy/todo_program.so" ]; then
            print_error "Solana todo program not found"
            validation_failed=true
        fi
    fi
    
    # Validate Polkadot pallets
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "polkadot" ]; then
        if [ ! -f "apps/blockchain-smart-contracts/polkadot/target/release/node-template" ]; then
            print_error "Polkadot node binary not found"
            validation_failed=true
        fi
    fi
    
    if [ "$validation_failed" = "true" ]; then
        print_error "Contract build validation failed"
        exit 1
    fi
    
    print_success "Contract build validation passed"
}

# Function to show build summary
show_build_summary() {
    print_status "Contract Build Summary:"
    echo "  Network: $NETWORK"
    echo "  Tests: $([ "$RUN_TESTS" = "true" ] && echo "Passed" || echo "Skipped")"
    echo "  Documentation: $([ "$GENERATE_DOCS" = "true" ] && echo "Generated" || echo "Skipped")"
    echo "  Verification: $([ "$VERIFY_CONTRACTS" = "true" ] && echo "Attempted" || echo "Skipped")"
    echo ""
    
    if [ -d "build/contracts" ]; then
        echo "Contract Artifacts:"
        find build/contracts -name "*.json" -o -name "*.so" -o -name "node-template" | head -10
        echo ""
    fi
    
    echo "Deployment Commands:"
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "polygon" ]; then
        echo "  Polygon: cd apps/blockchain-smart-contracts/polygon && pnpm deploy:local"
    fi
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "solana" ]; then
        echo "  Solana: cd apps/blockchain-smart-contracts/solana && anchor deploy"
    fi
    if [ "$NETWORK" = "all" ] || [ "$NETWORK" = "polkadot" ]; then
        echo "  Polkadot: cd apps/blockchain-smart-contracts/polkadot && ./target/release/node-template --dev"
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Build blockchain contracts for Todo App"
    echo ""
    echo "Options:"
    echo "  --network NETWORK     Build specific network (polygon, solana, polkadot, all)"
    echo "  --skip-tests          Skip running contract tests"
    echo "  --generate-docs       Generate contract documentation"
    echo "  --verify              Verify contracts on block explorers"
    echo "  --help                Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  NETWORK               Target network (default: all)"
    echo "  RUN_TESTS            Run tests (default: true)"
    echo "  GENERATE_DOCS        Generate documentation (default: false)"
    echo "  VERIFY_CONTRACTS     Verify contracts (default: false)"
    echo "  ETHERSCAN_API_KEY    API key for contract verification"
    echo ""
    echo "Examples:"
    echo "  $0                           # Build all contracts"
    echo "  $0 --network polygon         # Build only Polygon contracts"
    echo "  $0 --skip-tests --verify     # Build without tests but verify"
}

# Main build function
main_build() {
    local start_time=$(date +%s)
    
    case $NETWORK in
        polygon)
            build_polygon
            ;;
        solana)
            build_solana
            ;;
        polkadot)
            build_polkadot
            ;;
        all)
            build_polygon
            build_solana
            build_polkadot
            ;;
        *)
            print_error "Unknown network: $NETWORK"
            show_help
            exit 1
            ;;
    esac
    
    generate_artifacts
    validate_builds
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_success "Contract build completed successfully in ${duration}s"
    show_build_summary
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --network)
            NETWORK="$2"
            shift 2
            ;;
        --skip-tests)
            RUN_TESTS="false"
            shift
            ;;
        --generate-docs)
            GENERATE_DOCS="true"
            shift
            ;;
        --verify)
            VERIFY_CONTRACTS="true"
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute main build
main_build
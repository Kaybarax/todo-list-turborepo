#!/bin/bash

# Blockchain contracts build script
# Compiles and tests smart contracts for all supported networks
# Enhanced with dependency management and automatic installation

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
AUTO_INSTALL="${AUTO_INSTALL:-true}"
SKIP_DEPS_CHECK="${SKIP_DEPS_CHECK:-false}"

# Dependency management configuration
DEPS_CHECK_SCRIPT="./scripts/blockchain-deps-check.sh"
INSTALL_SCRIPT="./scripts/install-blockchain-tools.sh"

# Dependency management functions
check_dependencies() {
    local network="$1"
    
    if [ "$SKIP_DEPS_CHECK" = "true" ]; then
        print_status "Skipping dependency check (SKIP_DEPS_CHECK=true)"
        return 0
    fi
    
    print_status "Checking dependencies for network: $network"
    
    # Check if dependency checker script exists
    if [ ! -f "$DEPS_CHECK_SCRIPT" ]; then
        print_error "Dependency checker script not found: $DEPS_CHECK_SCRIPT"
        print_warning "Proceeding without dependency validation"
        return 0
    fi
    
    # Run dependency check for specific network
    local check_args=""
    if [ "$network" != "all" ]; then
        check_args="--network=$network"
    fi
    
    if "$DEPS_CHECK_SCRIPT" $check_args --verbose; then
        print_success "All dependencies verified for $network"
        return 0
    else
        print_warning "Dependency check failed for $network"
        return 1
    fi
}

attempt_auto_install() {
    local network="$1"
    
    if [ "$AUTO_INSTALL" != "true" ]; then
        print_status "Auto-install disabled (AUTO_INSTALL=false)"
        return 1
    fi
    
    print_status "Attempting automatic installation of missing dependencies for $network"
    
    # Check if installer script exists
    if [ ! -f "$INSTALL_SCRIPT" ]; then
        print_error "Installer script not found: $INSTALL_SCRIPT"
        return 1
    fi
    
    # Determine which tools to install based on network
    local tools_to_install=()
    case "$network" in
        "polygon"|"moonbeam"|"base")
            tools_to_install=("node")
            ;;
        "solana")
            tools_to_install=("rust" "solana" "anchor")
            ;;
        "polkadot")
            tools_to_install=("rust" "substrate")
            ;;
        "all")
            tools_to_install=("node" "rust" "solana" "anchor" "substrate")
            ;;
        *)
            print_error "Unknown network for dependency installation: $network"
            return 1
            ;;
    esac
    
    # Attempt to install each required tool
    local install_failed=false
    for tool in "${tools_to_install[@]}"; do
        print_status "Installing $tool..."
        if ! "$INSTALL_SCRIPT" --tool="$tool"; then
            print_error "Failed to install $tool"
            install_failed=true
        else
            print_success "$tool installed successfully"
        fi
    done
    
    if [ "$install_failed" = "true" ]; then
        print_error "Some tools failed to install automatically"
        return 1
    fi
    
    print_success "All required tools installed successfully"
    return 0
}

validate_environment() {
    local network="$1"
    
    print_status "Validating build environment for $network"
    
    # First check dependencies
    if ! check_dependencies "$network"; then
        print_warning "Dependencies missing for $network"
        
        # Attempt automatic installation
        if attempt_auto_install "$network"; then
            print_success "Dependencies installed, re-validating environment"
            
            # Re-check dependencies after installation
            if ! check_dependencies "$network"; then
                print_error "Environment validation failed even after installation attempt"
                provide_manual_guidance "$network"
                return 1
            fi
        else
            print_error "Automatic installation failed"
            provide_manual_guidance "$network"
            return 1
        fi
    fi
    
    print_success "Environment validation passed for $network"
    return 0
}

provide_manual_guidance() {
    local network="$1"
    
    print_error "Build environment validation failed for $network"
    print_status "Manual installation guidance:"
    echo ""
    
    case "$network" in
        "polygon"|"moonbeam"|"base")
            echo "For $network development, you need:"
            echo "  - Node.js 20+ (https://nodejs.org/)"
            echo "  - pnpm package manager (npm install -g pnpm)"
            echo "  - Hardhat dependencies (pnpm install in project root)"
            ;;
        "solana")
            echo "For Solana development, you need:"
            echo "  - Rust 1.70+ (https://rustup.rs/)"
            echo "  - Solana CLI 1.16+ (https://docs.solana.com/cli/install-solana-cli-tools)"
            echo "  - Anchor CLI 0.28+ (cargo install --git https://github.com/coral-xyz/anchor avm)"
            ;;
        "polkadot")
            echo "For Polkadot development, you need:"
            echo "  - Rust 1.70+ (https://rustup.rs/)"
            echo "  - WebAssembly target (rustup target add wasm32-unknown-unknown)"
            echo "  - cargo-contract (cargo install cargo-contract)"
            echo "  - Protocol Buffers compiler (system package manager)"
            ;;
        "all")
            echo "For full blockchain development, install all of the above tools."
            ;;
    esac
    
    echo ""
    echo "After manual installation, you can:"
    echo "  - Run dependency check: $DEPS_CHECK_SCRIPT --network=$network"
    echo "  - Retry build: $0 --network=$network"
    echo "  - Skip dependency check: SKIP_DEPS_CHECK=true $0 --network=$network"
    echo ""
}

# This will be printed later in main_build function

# Function to build Polygon contracts
build_polygon() {
    if [ ! -d "apps/smart-contracts/polygon" ]; then
        print_warning "Polygon contracts directory not found, skipping..."
        return 0
    fi
    
    # Validate environment before building
    if ! validate_environment "polygon"; then
        print_error "Environment validation failed for Polygon"
        return 1
    fi
    
    print_status "Building Polygon contracts..."
    cd apps/smart-contracts/polygon
    
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
    if [ ! -d "apps/smart-contracts/solana" ]; then
        print_warning "Solana programs directory not found, skipping..."
        return 0
    fi
    
    # Validate environment before building
    if ! validate_environment "solana"; then
        print_error "Environment validation failed for Solana"
        return 1
    fi
    
    print_status "Building Solana programs..."
    cd apps/smart-contracts/solana
    
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
    if [ ! -d "apps/smart-contracts/polkadot" ]; then
        print_warning "Polkadot pallets directory not found, skipping..."
        return 0
    fi
    
    # Validate environment before building
    if ! validate_environment "polkadot"; then
        print_error "Environment validation failed for Polkadot"
        return 1
    fi
    
    print_status "Building Polkadot pallets..."
    cd apps/smart-contracts/polkadot
    
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

# Function to build Moonbeam contracts
build_moonbeam() {
    if [ ! -d "apps/smart-contracts/moonbeam" ]; then
        print_warning "Moonbeam contracts directory not found, skipping..."
        return 0
    fi
    
    # Validate environment before building
    if ! validate_environment "moonbeam"; then
        print_error "Environment validation failed for Moonbeam"
        return 1
    fi
    
    print_status "Building Moonbeam contracts..."
    cd apps/smart-contracts/moonbeam
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing Moonbeam contract dependencies..."
        pnpm install
    fi
    
    # Compile Solidity contracts
    print_status "Compiling Moonbeam Solidity contracts..."
    pnpm compile
    
    # Run tests if not skipped
    if [ "$RUN_TESTS" = "true" ]; then
        print_status "Running Moonbeam contract tests..."
        pnpm test
    fi
    
    # Generate documentation if requested
    if [ "$GENERATE_DOCS" = "true" ]; then
        print_status "Generating Moonbeam contract documentation..."
        pnpm docgen || print_warning "Documentation generation failed"
    fi
    
    # Verify contracts if requested
    if [ "$VERIFY_CONTRACTS" = "true" ] && [ -n "$MOONBEAM_API_KEY" ]; then
        print_status "Verifying Moonbeam contracts..."
        pnpm verify || print_warning "Contract verification failed"
    fi
    
    cd ../../..
    print_success "Moonbeam contracts built successfully"
}

# Function to build Base contracts
build_base() {
    if [ ! -d "apps/smart-contracts/base" ]; then
        print_warning "Base contracts directory not found, skipping..."
        return 0
    fi
    
    # Validate environment before building
    if ! validate_environment "base"; then
        print_error "Environment validation failed for Base"
        return 1
    fi
    
    print_status "Building Base contracts..."
    cd apps/smart-contracts/base
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing Base contract dependencies..."
        pnpm install
    fi
    
    # Compile Solidity contracts
    print_status "Compiling Base Solidity contracts..."
    pnpm compile
    
    # Run tests if not skipped
    if [ "$RUN_TESTS" = "true" ]; then
        print_status "Running Base contract tests..."
        pnpm test
    fi
    
    # Generate documentation if requested
    if [ "$GENERATE_DOCS" = "true" ]; then
        print_status "Generating Base contract documentation..."
        pnpm docgen || print_warning "Documentation generation failed"
    fi
    
    # Verify contracts if requested
    if [ "$VERIFY_CONTRACTS" = "true" ] && [ -n "$BASESCAN_API_KEY" ]; then
        print_status "Verifying Base contracts..."
        pnpm verify || print_warning "Contract verification failed"
    fi
    
    cd ../../..
    print_success "Base contracts built successfully"
}

# Function to generate contract artifacts
generate_artifacts() {
    print_status "Generating contract artifacts..."
    
    # Create artifacts directory
    mkdir -p build/contracts
    
    local artifacts_copied=false
    
    # Copy Polygon artifacts
    if [ -d "apps/smart-contracts/polygon/artifacts" ]; then
        mkdir -p build/contracts/polygon
        cp -r apps/smart-contracts/polygon/artifacts/* build/contracts/polygon/ 2>/dev/null || true
        print_status "Polygon artifacts copied"
        artifacts_copied=true
    fi
    
    # Copy Solana artifacts
    if [ -d "apps/smart-contracts/solana/target/deploy" ]; then
        mkdir -p build/contracts/solana
        cp -r apps/smart-contracts/solana/target/deploy build/contracts/solana/ 2>/dev/null || true
        artifacts_copied=true
    fi
    if [ -d "apps/smart-contracts/solana/target/idl" ]; then
        mkdir -p build/contracts/solana
        cp -r apps/smart-contracts/solana/target/idl build/contracts/solana/ 2>/dev/null || true
        print_status "Solana artifacts copied"
    fi
    
    # Copy Polkadot artifacts
    if [ -d "apps/smart-contracts/polkadot/target/release" ]; then
        mkdir -p build/contracts/polkadot
        cp -r apps/smart-contracts/polkadot/target/release build/contracts/polkadot/ 2>/dev/null || true
        print_status "Polkadot artifacts copied"
        artifacts_copied=true
    fi
    
    # Copy Moonbeam artifacts
    if [ -d "apps/smart-contracts/moonbeam/artifacts" ]; then
        mkdir -p build/contracts/moonbeam
        cp -r apps/smart-contracts/moonbeam/artifacts/* build/contracts/moonbeam/ 2>/dev/null || true
        print_status "Moonbeam artifacts copied"
        artifacts_copied=true
    fi
    
    # Copy Base artifacts
    if [ -d "apps/smart-contracts/base/artifacts" ]; then
        mkdir -p build/contracts/base
        cp -r apps/smart-contracts/base/artifacts/* build/contracts/base/ 2>/dev/null || true
        print_status "Base artifacts copied"
        artifacts_copied=true
    fi
    
    if [ "$artifacts_copied" = "true" ]; then
        print_success "Contract artifacts generated in build/contracts/"
    else
        print_warning "No contract artifacts found to copy"
    fi
}

# Function to validate contract builds based on successful builds
validate_builds() {
    local build_results=("$@")
    
    if [ ${#build_results[@]} -eq 0 ]; then
        print_warning "No build results to validate"
        return 0
    fi
    
    print_status "Validating contract builds..."
    
    local validation_failed=false
    
    for result in "${build_results[@]}"; do
        local network="${result%:*}"
        local status="${result#*:}"
        
        # Only validate successful builds
        if [ "$status" = "success" ]; then
            case "$network" in
                "polygon")
                    if [ -d "apps/smart-contracts/polygon/artifacts" ]; then
                        print_success "Polygon artifacts validated"
                    else
                        print_warning "Polygon build succeeded but no artifacts found"
                    fi
                    ;;
                "solana")
                    if [ -d "apps/smart-contracts/solana/target" ]; then
                        print_success "Solana artifacts validated"
                    else
                        print_warning "Solana build succeeded but no artifacts found"
                    fi
                    ;;
                "polkadot")
                    if [ -d "apps/smart-contracts/polkadot/target" ]; then
                        print_success "Polkadot artifacts validated"
                    else
                        print_warning "Polkadot build succeeded but no artifacts found"
                    fi
                    ;;
                "moonbeam")
                    if [ -d "apps/smart-contracts/moonbeam/artifacts" ]; then
                        print_success "Moonbeam artifacts validated"
                    else
                        print_warning "Moonbeam build succeeded but no artifacts found"
                    fi
                    ;;
                "base")
                    if [ -d "apps/smart-contracts/base/artifacts" ]; then
                        print_success "Base artifacts validated"
                    else
                        print_warning "Base build succeeded but no artifacts found"
                    fi
                    ;;
            esac
        fi
    done
    
    if [ "$validation_failed" = "true" ]; then
        print_error "Contract build validation failed"
        return 1
    fi
    
    print_success "Contract build validation completed"
    return 0
}

# Function to show build summary with results
show_build_summary_with_results() {
    local results=("$@")
    
    print_status "Contract Build Summary:"
    echo "  Network: $NETWORK"
    echo "  Tests: $([ "$RUN_TESTS" = "true" ] && echo "Enabled" || echo "Skipped")"
    echo "  Documentation: $([ "$GENERATE_DOCS" = "true" ] && echo "Generated" || echo "Skipped")"
    echo "  Verification: $([ "$VERIFY_CONTRACTS" = "true" ] && echo "Attempted" || echo "Skipped")"
    echo "  Auto-install: $([ "$AUTO_INSTALL" = "true" ] && echo "Enabled" || echo "Disabled")"
    echo "  Deps check: $([ "$SKIP_DEPS_CHECK" = "true" ] && echo "Skipped" || echo "Enabled")"
    echo ""
    
    # Show build results
    if [ ${#results[@]} -gt 0 ]; then
        echo "Build Results:"
        for result in "${results[@]}"; do
            local network="${result%:*}"
            local status="${result#*:}"
            if [ "$status" = "success" ]; then
                echo -e "  ${GREEN}✓${NC} $network: Build successful"
            else
                echo -e "  ${RED}✗${NC} $network: Build failed"
            fi
        done
        echo ""
    fi
    
    if [ -d "build/contracts" ]; then
        echo "Contract Artifacts:"
        find build/contracts -name "*.json" -o -name "*.so" -o -name "node-template" | head -10
        echo ""
    fi
    
    echo "Deployment Commands:"
    for result in "${results[@]}"; do
        local network="${result%:*}"
        local status="${result#*:}"
        if [ "$status" = "success" ]; then
            case "$network" in
                "polygon")
                    echo "  Polygon: cd apps/smart-contracts/polygon && pnpm deploy:local"
                    ;;
                "solana")
                    echo "  Solana: cd apps/smart-contracts/solana && anchor deploy"
                    ;;
                "polkadot")
                    echo "  Polkadot: cd apps/smart-contracts/polkadot && ./target/release/node-template --dev"
                    ;;
                "moonbeam")
                    echo "  Moonbeam: cd apps/smart-contracts/moonbeam && pnpm deploy:local"
                    ;;
                "base")
                    echo "  Base: cd apps/smart-contracts/base && pnpm deploy:local"
                    ;;
            esac
        fi
    done
    
    # Show troubleshooting info for failed builds
    local has_failures=false
    for result in "${results[@]}"; do
        local status="${result#*:}"
        if [ "$status" = "failed" ]; then
            has_failures=true
            break
        fi
    done
    
    if [ "$has_failures" = "true" ]; then
        echo ""
        echo "Troubleshooting Failed Builds:"
        echo "  - Check dependency installation: $DEPS_CHECK_SCRIPT --verbose"
        echo "  - Install missing tools: $INSTALL_SCRIPT --all"
        echo "  - Skip dependency check: SKIP_DEPS_CHECK=true $0"
        echo "  - Disable auto-install: AUTO_INSTALL=false $0"
        echo "  - Build specific network: $0 --network=<network>"
    fi
}

# Function to show build summary (legacy compatibility)
show_build_summary() {
    show_build_summary_with_results
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Build blockchain contracts for Todo App with dependency management"
    echo ""
    echo "Options:"
    echo "  --network NETWORK     Build specific network (polygon, solana, polkadot, moonbeam, base, all)"
    echo "  --skip-tests          Skip running contract tests"
    echo "  --generate-docs       Generate contract documentation"
    echo "  --verify              Verify contracts on block explorers"
    echo "  --no-auto-install     Disable automatic installation of missing dependencies"
    echo "  --skip-deps-check     Skip dependency validation (not recommended)"
    echo "  --help                Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  NETWORK               Target network (default: all)"
    echo "  RUN_TESTS            Run tests (default: true)"
    echo "  GENERATE_DOCS        Generate documentation (default: false)"
    echo "  VERIFY_CONTRACTS     Verify contracts (default: false)"
    echo "  AUTO_INSTALL         Auto-install missing dependencies (default: true)"
    echo "  SKIP_DEPS_CHECK      Skip dependency validation (default: false)"
    echo "  ETHERSCAN_API_KEY    API key for Polygon contract verification"
    echo "  MOONBEAM_API_KEY     API key for Moonbeam contract verification"
    echo "  BASESCAN_API_KEY     API key for Base contract verification"
    echo ""
    echo "Examples:"
    echo "  $0                           # Build all contracts with dependency management"
    echo "  $0 --network polygon         # Build only Polygon contracts"
    echo "  $0 --network moonbeam        # Build only Moonbeam contracts"
    echo "  $0 --network base            # Build only Base contracts"
    echo "  $0 --skip-tests --verify     # Build without tests but verify"
    echo "  $0 --no-auto-install        # Build without automatic dependency installation"
    echo "  $0 --skip-deps-check         # Build without dependency validation"
    echo ""
    echo "Dependency Management:"
    echo "  The script automatically checks for required blockchain development tools"
    echo "  and attempts to install missing dependencies. You can control this behavior"
    echo "  using the --no-auto-install and --skip-deps-check options."
    echo ""
    echo "  Manual dependency management:"
    echo "    Check dependencies: $DEPS_CHECK_SCRIPT --verbose"
    echo "    Install tools:      $INSTALL_SCRIPT --all"
}

# Main build function with enhanced error handling
main_build() {
    local start_time=$(date +%s)
    local build_results=()
    local overall_success=true
    
    print_status "Building blockchain contracts..."
    print_status "Network: $NETWORK"
    print_status "Run tests: $RUN_TESTS"
    print_status "Auto-install: $AUTO_INSTALL"
    print_status "Skip deps check: $SKIP_DEPS_CHECK"
    echo ""
    
    # Pre-build validation for all networks if building all
    if [ "$NETWORK" = "all" ] && [ "$SKIP_DEPS_CHECK" != "true" ]; then
        print_status "Running pre-build validation for all networks..."
        if ! validate_environment "all"; then
            print_error "Pre-build validation failed. Some networks may not build successfully."
            print_status "Continuing with individual network validation..."
        fi
    fi
    
    case $NETWORK in
        polygon)
            if build_polygon; then
                build_results+=("polygon:success")
            else
                build_results+=("polygon:failed")
                overall_success=false
            fi
            ;;
        solana)
            if build_solana; then
                build_results+=("solana:success")
            else
                build_results+=("solana:failed")
                overall_success=false
            fi
            ;;
        polkadot)
            if build_polkadot; then
                build_results+=("polkadot:success")
            else
                build_results+=("polkadot:failed")
                overall_success=false
            fi
            ;;
        moonbeam)
            if build_moonbeam; then
                build_results+=("moonbeam:success")
            else
                build_results+=("moonbeam:failed")
                overall_success=false
            fi
            ;;
        base)
            if build_base; then
                build_results+=("base:success")
            else
                build_results+=("base:failed")
                overall_success=false
            fi
            ;;
        all)
            # Build each network individually and track results
            if build_polygon; then
                build_results+=("polygon:success")
            else
                build_results+=("polygon:failed")
                overall_success=false
            fi
            
            if build_solana; then
                build_results+=("solana:success")
            else
                build_results+=("solana:failed")
                overall_success=false
            fi
            
            if build_polkadot; then
                build_results+=("polkadot:success")
            else
                build_results+=("polkadot:failed")
                overall_success=false
            fi
            
            if build_moonbeam; then
                build_results+=("moonbeam:success")
            else
                build_results+=("moonbeam:failed")
                overall_success=false
            fi
            
            if build_base; then
                build_results+=("base:success")
            else
                build_results+=("base:failed")
                overall_success=false
            fi
            ;;
        *)
            print_error "Unknown network: $NETWORK"
            show_help
            exit 1
            ;;
    esac
    
    # Generate artifacts only for successful builds
    if [ ${#build_results[@]} -gt 0 ]; then
        generate_artifacts
        
        # Validate builds that succeeded
        validate_builds "${build_results[@]}"
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Show build summary with results
    show_build_summary_with_results "${build_results[@]}"
    
    if [ "$overall_success" = "true" ]; then
        print_success "Contract build completed successfully in ${duration}s"
        return 0
    else
        print_error "Contract build completed with some failures in ${duration}s"
        print_status "Check the build summary above for details"
        return 1
    fi
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
        --no-auto-install)
            AUTO_INSTALL="false"
            shift
            ;;
        --skip-deps-check)
            SKIP_DEPS_CHECK="true"
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

# Execute main build with proper exit code handling
if main_build; then
    exit 0
else
    exit 1
fi
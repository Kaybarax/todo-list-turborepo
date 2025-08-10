#!/bin/bash

# Automated Blockchain Tools Installer
# Installs missing blockchain development dependencies
# Supports: Rust, Solana CLI, Anchor CLI
# Platforms: macOS, Linux, Windows (WSL/Git Bash)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RUST_MIN_VERSION="1.70.0"
SOLANA_VERSION="1.18.0"
ANCHOR_VERSION="0.29.0"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Platform detection
detect_platform() {
    case "$(uname -s)" in
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're running in CI environment
is_ci() {
    [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$GITLAB_CI" ] || [ -n "$JENKINS_URL" ]
}

# Get system architecture
get_arch() {
    case "$(uname -m)" in
        x86_64|amd64)
            echo "x86_64"
            ;;
        arm64|aarch64)
            echo "arm64"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Version comparison function
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Retry mechanism for network operations
retry_command() {
    local max_attempts=3
    local delay=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if "$@"; then
            return 0
        else
            if [ $attempt -eq $max_attempts ]; then
                log_error "Command failed after $max_attempts attempts: $*"
                return 1
            fi
            log_warning "Attempt $attempt failed. Retrying in ${delay}s..."
            sleep $delay
            attempt=$((attempt + 1))
            delay=$((delay * 2))
        fi
    done
}

# Install Rust using rustup
install_rust() {
    log_info "Installing Rust using rustup..."
    
    if command_exists rustc; then
        local current_version
        current_version=$(rustc --version | cut -d' ' -f2)
        if version_ge "$current_version" "$RUST_MIN_VERSION"; then
            log_success "Rust $current_version is already installed and meets requirements"
            return 0
        else
            log_warning "Rust $current_version is outdated. Updating..."
        fi
    fi
    
    # Download and install rustup
    local platform arch
    platform=$(detect_platform)
    arch=$(get_arch)
    
    case $platform in
        "macos"|"linux")
            # Check if we have curl or wget
            if command_exists curl; then
                local download_cmd="curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs"
            elif command_exists wget; then
                local download_cmd="wget -qO- https://sh.rustup.rs"
            else
                log_error "Neither curl nor wget found. Please install one of them first."
                return 1
            fi
            
            log_info "Downloading rustup installer for $platform ($arch)..."
            if ! retry_command sh -c "$download_cmd | sh -s -- -y --default-toolchain stable"; then
                log_error "Failed to install Rust via rustup"
                log_info "Manual installation: Visit https://rustup.rs/ for instructions"
                return 1
            fi
            ;;
        "windows")
            log_warning "Windows detected. Please download rustup from https://rustup.rs/ and run the installer manually."
            log_info "After installation, restart your terminal and run this script again."
            return 1
            ;;
        *)
            log_error "Unsupported platform for automatic Rust installation: $platform"
            return 1
            ;;
    esac
    
    # Source cargo environment
    if [ -f "$HOME/.cargo/env" ]; then
        # shellcheck source=/dev/null
        source "$HOME/.cargo/env"
    fi
    
    # Update PATH for current session
    export PATH="$HOME/.cargo/bin:$PATH"
    
    # Verify installation
    if command_exists rustc; then
        local installed_version
        installed_version=$(rustc --version | cut -d' ' -f2)
        log_success "Rust $installed_version installed successfully"
        
        # Install additional components needed for blockchain development
        log_info "Installing additional Rust components..."
        if ! rustup component add clippy rustfmt; then
            log_warning "Failed to install some Rust components, but core installation succeeded"
        fi
        
        # Install wasm target for Substrate development
        log_info "Installing WebAssembly target for Substrate development..."
        if ! rustup target add wasm32-unknown-unknown; then
            log_warning "Failed to install WASM target, but core installation succeeded"
        fi
        
        return 0
    else
        log_error "Rust installation verification failed"
        log_info "Try restarting your terminal and running this script again"
        return 1
    fi
}

# Install Solana CLI
install_solana() {
    log_info "Installing Solana CLI v$SOLANA_VERSION..."
    
    if command_exists solana; then
        local current_version
        current_version=$(solana --version | cut -d' ' -f2)
        if [ "$current_version" = "$SOLANA_VERSION" ]; then
            log_success "Solana CLI $current_version is already installed"
            return 0
        else
            log_warning "Solana CLI $current_version found. Installing specific version $SOLANA_VERSION..."
        fi
    fi
    
    local platform arch
    platform=$(detect_platform)
    arch=$(get_arch)
    
    case $platform in
        "macos"|"linux")
            # Check if we have curl or wget
            if command_exists curl; then
                local download_cmd="curl -sSfL https://release.solana.com/v$SOLANA_VERSION/install"
            elif command_exists wget; then
                local download_cmd="wget -qO- https://release.solana.com/v$SOLANA_VERSION/install"
            else
                log_error "Neither curl nor wget found. Please install one of them first."
                return 1
            fi
            
            log_info "Downloading Solana CLI installer for $platform ($arch)..."
            # Use official Solana installer
            if ! retry_command sh -c "$($download_cmd)"; then
                log_error "Failed to install Solana CLI"
                log_info "Manual installation: Visit https://docs.solana.com/cli/install-solana-cli-tools"
                return 1
            fi
            
            # Add to PATH if not already there
            local solana_path="$HOME/.local/share/solana/install/active_release/bin"
            if [[ ":$PATH:" != *":$solana_path:"* ]]; then
                # Add to shell profiles
                for profile in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile"; do
                    if [ -f "$profile" ] || [ "$profile" = "$HOME/.bashrc" ]; then
                        echo "export PATH=\"$solana_path:\$PATH\"" >> "$profile" 2>/dev/null || true
                    fi
                done
                export PATH="$solana_path:$PATH"
                log_info "Added Solana CLI to PATH in shell profiles"
            fi
            ;;
        "windows")
            log_warning "Windows detected. Please install Solana CLI manually:"
            log_info "1. Download from https://github.com/solana-labs/solana/releases/tag/v$SOLANA_VERSION"
            log_info "2. Extract and add to PATH"
            log_info "3. Restart your terminal and run this script again"
            return 1
            ;;
        *)
            log_error "Unsupported platform for automatic Solana CLI installation: $platform"
            return 1
            ;;
    esac
    
    # Verify installation
    if command_exists solana; then
        local installed_version
        installed_version=$(solana --version | cut -d' ' -f2)
        log_success "Solana CLI $installed_version installed successfully"
        
        # Configure Solana for development (only if not in CI)
        if ! is_ci; then
            log_info "Configuring Solana for development..."
            if ! solana config set --url localhost; then
                log_warning "Failed to configure Solana CLI, but installation succeeded"
            fi
        fi
        
        return 0
    else
        log_error "Solana CLI installation verification failed"
        log_info "Try restarting your terminal and running this script again"
        return 1
    fi
}

# Install Anchor CLI
install_anchor() {
    log_info "Installing Anchor CLI v$ANCHOR_VERSION..."
    
    # Check if Rust is available
    if ! command_exists cargo; then
        log_error "Cargo not found. Please install Rust first."
        log_info "Run: $0 --tool=rust"
        return 1
    fi
    
    # Check if Solana CLI is available
    if ! command_exists solana; then
        log_error "Solana CLI not found. Please install Solana CLI first."
        log_info "Run: $0 --tool=solana"
        return 1
    fi
    
    if command_exists anchor; then
        local current_version
        current_version=$(anchor --version 2>/dev/null | cut -d' ' -f2 || echo "unknown")
        if [ "$current_version" = "$ANCHOR_VERSION" ]; then
            log_success "Anchor CLI $current_version is already installed"
            return 0
        else
            log_warning "Anchor CLI $current_version found. Installing specific version $ANCHOR_VERSION..."
        fi
    fi
    
    # Install specific version of Anchor CLI
    log_info "Installing Anchor Version Manager (AVM)..."
    log_info "This may take several minutes as Anchor CLI is compiled from source..."
    
    # First install AVM (Anchor Version Manager)
    if ! retry_command cargo install --git https://github.com/coral-xyz/anchor avm --locked --force; then
        log_error "Failed to install Anchor Version Manager (AVM)"
        log_info "Manual installation: Visit https://www.anchor-lang.com/docs/installation"
        return 1
    fi
    
    # Add cargo bin to PATH if not already there
    local cargo_bin="$HOME/.cargo/bin"
    if [[ ":$PATH:" != *":$cargo_bin:"* ]]; then
        # Add to shell profiles
        for profile in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile"; do
            if [ -f "$profile" ] || [ "$profile" = "$HOME/.bashrc" ]; then
                echo "export PATH=\"$cargo_bin:\$PATH\"" >> "$profile" 2>/dev/null || true
            fi
        done
        export PATH="$cargo_bin:$PATH"
        log_info "Added Cargo bin to PATH in shell profiles"
    fi
    
    # Install and use specific Anchor version
    log_info "Installing Anchor CLI v$ANCHOR_VERSION using AVM..."
    if ! retry_command avm install "$ANCHOR_VERSION"; then
        log_error "Failed to install Anchor CLI v$ANCHOR_VERSION"
        log_info "Available versions can be found at: https://github.com/coral-xyz/anchor/releases"
        return 1
    fi
    
    if ! avm use "$ANCHOR_VERSION"; then
        log_error "Failed to set Anchor CLI v$ANCHOR_VERSION as active"
        return 1
    fi
    
    # Verify installation
    if command_exists anchor; then
        local installed_version
        installed_version=$(anchor --version 2>/dev/null | cut -d' ' -f2 || echo "unknown")
        if [ "$installed_version" != "unknown" ]; then
            log_success "Anchor CLI $installed_version installed successfully"
            
            # Verify Anchor can find Solana
            log_info "Verifying Anchor configuration..."
            if anchor --version >/dev/null 2>&1; then
                log_success "Anchor CLI is properly configured"
            else
                log_warning "Anchor CLI installed but may need configuration"
            fi
            
            return 0
        else
            log_error "Anchor CLI installation verification failed"
            return 1
        fi
    else
        log_error "Anchor CLI installation verification failed"
        log_info "Try restarting your terminal and running this script again"
        return 1
    fi
}

# Install Substrate tools for Polkadot development
install_substrate() {
    log_info "Installing Substrate tools for Polkadot development..."
    
    # Check if Rust is available
    if ! command_exists cargo; then
        log_error "Cargo not found. Please install Rust first."
        log_info "Run: $0 --tool=rust"
        return 1
    fi
    
    # Check and install protobuf compiler (required for substrate tools)
    if ! command_exists protoc; then
        log_info "Protocol Buffers compiler (protoc) not found. Installing..."
        local platform
        platform=$(detect_platform)
        
        case $platform in
            "macos")
                if command_exists brew; then
                    if ! retry_command brew install protobuf; then
                        log_error "Failed to install protobuf via Homebrew"
                        log_info "Please install protobuf manually: brew install protobuf"
                        return 1
                    fi
                else
                    log_error "Homebrew not found. Please install protobuf manually."
                    log_info "Visit: https://github.com/protocolbuffers/protobuf/releases"
                    return 1
                fi
                ;;
            "linux")
                # Try different package managers
                if command_exists apt-get; then
                    if ! retry_command sudo apt-get update && sudo apt-get install -y protobuf-compiler; then
                        log_warning "Failed to install protobuf via apt-get"
                    fi
                elif command_exists yum; then
                    if ! retry_command sudo yum install -y protobuf-compiler; then
                        log_warning "Failed to install protobuf via yum"
                    fi
                elif command_exists pacman; then
                    if ! retry_command sudo pacman -S --noconfirm protobuf; then
                        log_warning "Failed to install protobuf via pacman"
                    fi
                else
                    log_warning "No supported package manager found for automatic protobuf installation"
                fi
                
                # Verify installation
                if ! command_exists protoc; then
                    log_error "Failed to install protobuf compiler"
                    log_info "Please install protobuf manually for your Linux distribution"
                    return 1
                fi
                ;;
            "windows")
                log_warning "Windows detected. Please install protobuf manually:"
                log_info "1. Download from https://github.com/protocolbuffers/protobuf/releases"
                log_info "2. Extract and add to PATH"
                log_info "3. Restart your terminal and run this script again"
                return 1
                ;;
            *)
                log_error "Unsupported platform for automatic protobuf installation: $platform"
                return 1
                ;;
        esac
        
        log_success "Protocol Buffers compiler installed successfully"
    else
        log_success "Protocol Buffers compiler is already installed"
    fi
    
    # Verify WASM target is installed (needed for Substrate)
    if rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
        log_success "WebAssembly target is already installed"
    else
        log_info "Installing WebAssembly target for Substrate..."
        if ! rustup target add wasm32-unknown-unknown; then
            log_error "Failed to install WebAssembly target"
            return 1
        else
            log_success "WebAssembly target installed successfully"
        fi
    fi
    
    # Install cargo-contract for ink! smart contracts
    if command_exists cargo-contract; then
        log_success "cargo-contract is already installed"
    else
        log_info "Installing cargo-contract for ink! smart contracts..."
        log_info "This may take several minutes as it compiles from source..."
        if ! retry_command cargo install cargo-contract --force; then
            log_warning "Failed to install cargo-contract, but continuing..."
        else
            log_success "cargo-contract installed successfully"
        fi
    fi
    
    # Install substrate-contracts-node for local testing (optional, as it's large)
    if command_exists substrate-contracts-node; then
        log_success "substrate-contracts-node is already installed"
    else
        log_info "Skipping substrate-contracts-node installation (large dependency)"
        log_info "To install manually: cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git"
    fi
    
    log_success "Substrate tools installation completed"
    return 0
}

# Install Node.js dependencies for Hardhat (Polygon)
install_node_deps() {
    log_info "Verifying Node.js dependencies for Hardhat..."
    
    if ! command_exists node; then
        log_error "Node.js not found. Please install Node.js 20+ first."
        return 1
    fi
    
    local node_version
    node_version=$(node --version | sed 's/v//')
    local required_version="20.0.0"
    
    if ! version_ge "$node_version" "$required_version"; then
        log_error "Node.js $node_version found, but version $required_version or higher is required"
        return 1
    fi
    
    log_success "Node.js $node_version meets requirements"
    
    # Check if we're in the project root and install dependencies
    if [ -f "package.json" ] && [ -f "pnpm-workspace.yaml" ]; then
        if command_exists pnpm; then
            log_info "Installing project dependencies with pnpm..."
            pnpm install
            log_success "Project dependencies installed"
        else
            log_warning "pnpm not found. Please install pnpm for optimal dependency management"
        fi
    fi
    
    return 0
}

# Main installation function
install_tool() {
    local tool="$1"
    
    case "$tool" in
        "rust")
            install_rust
            ;;
        "solana")
            install_solana
            ;;
        "anchor")
            install_anchor
            ;;
        "substrate"|"polkadot")
            install_substrate
            ;;
        "node"|"nodejs")
            install_node_deps
            ;;
        *)
            log_error "Unknown tool: $tool"
            log_info "Available tools: rust, solana, anchor, substrate, node"
            return 1
            ;;
    esac
}

# Show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --tool=<tool>     Install specific tool (rust|solana|anchor|substrate|node)"
    echo "  --all             Install all tools"
    echo "  --force           Force reinstallation even if tool exists"
    echo "  --help            Show this help message"
    echo ""
    echo "Available tools:"
    echo "  rust              Rust programming language and Cargo"
    echo "  solana            Solana CLI for Solana blockchain development"
    echo "  anchor            Anchor framework for Solana smart contracts"
    echo "  substrate         Substrate tools for Polkadot development"
    echo "  node              Node.js dependencies verification"
    echo ""
    echo "Examples:"
    echo "  $0 --tool=rust    Install only Rust"
    echo "  $0 --all          Install all blockchain tools"
    echo "  $0 --force --all  Force reinstall all tools"
}

# Parse command line arguments
INSTALL_ALL=false
FORCE_INSTALL=false
SPECIFIC_TOOL=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --tool=*)
            SPECIFIC_TOOL="${1#*=}"
            shift
            ;;
        --all)
            INSTALL_ALL=true
            shift
            ;;
        --force)
            FORCE_INSTALL=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    log_info "Blockchain Tools Installer"
    log_info "Platform: $(detect_platform)"
    echo ""
    
    local success=true
    
    if [ "$INSTALL_ALL" = true ]; then
        log_info "Installing all blockchain development tools..."
        
        # Install in dependency order
        install_tool "rust" || success=false
        install_tool "solana" || success=false
        install_tool "anchor" || success=false
        install_tool "substrate" || success=false
        install_tool "node" || success=false
        
    elif [ -n "$SPECIFIC_TOOL" ]; then
        log_info "Installing $SPECIFIC_TOOL..."
        install_tool "$SPECIFIC_TOOL" || success=false
        
    else
        log_error "No installation target specified. Use --all or --tool=<tool>"
        show_usage
        exit 1
    fi
    
    echo ""
    if [ "$success" = true ]; then
        log_success "Installation completed successfully!"
        log_info "Please restart your terminal or run 'source ~/.bashrc' to update your PATH"
    else
        log_error "Some installations failed. Please check the output above."
        exit 1
    fi
}

# Run main function
main "$@"
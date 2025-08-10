# Anchor CLI Setup and Troubleshooting Guide

## Overview

Anchor is a framework for Solana's Sealevel runtime providing several developer tools for writing smart contracts. This guide covers installation, configuration, and common troubleshooting scenarios for Anchor CLI.

## Prerequisites

Before installing Anchor CLI, ensure you have:
- Rust 1.70.0 or later
- Solana CLI 1.16.0 or later
- Node.js 20+ with npm/yarn/pnpm

## Installation

### Automatic Installation (Recommended)

Use our automated installer:
```bash
./scripts/install-blockchain-tools.sh --tool=anchor
```

### Manual Installation

#### Method 1: Using Cargo (Recommended)
```bash
# Install specific version for compatibility
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

#### Method 2: Using AVM (Anchor Version Manager)
```bash
# Install AVM first
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install and use latest Anchor version
avm install latest
avm use latest
```

#### Method 3: Building from Source
```bash
git clone https://github.com/coral-xyz/anchor
cd anchor
git checkout v0.29.0  # Use specific stable version
cargo install --path cli anchor-cli --locked
```

## Verification

After installation, verify Anchor CLI is working:
```bash
anchor --version
anchor init test-project
cd test-project
anchor build
```

## Common Issues and Solutions

### Issue 1: "anchor: command not found"

**Symptoms:**
- Command `anchor --version` returns "command not found"
- Anchor CLI appears to install successfully but is not available

**Solutions:**

1. **Check PATH configuration:**
   ```bash
   # Add to ~/.bashrc, ~/.zshrc, or ~/.profile
   export PATH="$HOME/.cargo/bin:$PATH"
   source ~/.bashrc  # or ~/.zshrc
   ```

2. **Verify Cargo bin directory:**
   ```bash
   ls -la ~/.cargo/bin/anchor*
   which anchor
   ```

3. **Reinstall with explicit path:**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force
   ```

### Issue 2: "failed to compile anchor-cli"

**Symptoms:**
- Compilation errors during `cargo install`
- Missing dependencies or build failures

**Solutions:**

1. **Update Rust toolchain:**
   ```bash
   rustup update stable
   rustup default stable
   ```

2. **Install required system dependencies:**
   
   **macOS:**
   ```bash
   xcode-select --install
   brew install pkg-config openssl libuv
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install -y pkg-config build-essential libuv1-dev libssl-dev
   ```
   
   **Windows:**
   ```powershell
   # Install Visual Studio Build Tools
   # Or use Windows Subsystem for Linux (WSL)
   ```

3. **Clear Cargo cache and retry:**
   ```bash
   cargo clean
   rm -rf ~/.cargo/registry/cache
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force
   ```

### Issue 3: "Anchor.toml not found"

**Symptoms:**
- Error when running `anchor build` or other commands
- Working directory doesn't contain Anchor project

**Solutions:**

1. **Initialize new Anchor project:**
   ```bash
   anchor init my-project
   cd my-project
   ```

2. **Verify project structure:**
   ```bash
   ls -la  # Should show Anchor.toml
   cat Anchor.toml  # Verify configuration
   ```

### Issue 4: Solana CLI version incompatibility

**Symptoms:**
- Build failures with version mismatch errors
- "unsupported Solana version" messages

**Solutions:**

1. **Check version compatibility:**
   ```bash
   anchor --version
   solana --version
   ```

2. **Update Solana CLI to compatible version:**
   ```bash
   solana-install update
   ```

3. **Use specific Solana version:**
   ```bash
   solana-install init 1.16.0
   ```

### Issue 5: "Program failed to complete" during build

**Symptoms:**
- Build process hangs or fails
- Memory or resource exhaustion errors

**Solutions:**

1. **Increase system resources:**
   ```bash
   # Increase stack size
   export RUST_MIN_STACK=8388608
   
   # Build with release mode for better optimization
   anchor build --release
   ```

2. **Clean and rebuild:**
   ```bash
   anchor clean
   rm -rf target/
   anchor build
   ```

3. **Check disk space:**
   ```bash
   df -h  # Ensure sufficient disk space
   ```

### Issue 6: Network connectivity issues

**Symptoms:**
- Timeouts during installation
- Failed to download dependencies

**Solutions:**

1. **Configure proxy if needed:**
   ```bash
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

2. **Use alternative registry:**
   ```bash
   # Add to ~/.cargo/config.toml
   [source.crates-io]
   replace-with = "sparse-index"
   ```

3. **Retry with timeout increase:**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force --timeout 300
   ```

## Platform-Specific Notes

### macOS
- Ensure Xcode Command Line Tools are installed
- Use Homebrew for system dependencies when possible
- M1/M2 Macs may require Rosetta for some dependencies

### Linux
- Install build-essential package
- Ensure pkg-config is available
- Some distributions may need additional SSL libraries

### Windows
- Consider using WSL for better compatibility
- Visual Studio Build Tools required for native compilation
- PowerShell execution policy may need adjustment

## Environment Variables

Key environment variables for Anchor development:

```bash
# Add to shell profile (~/.bashrc, ~/.zshrc)
export PATH="$HOME/.cargo/bin:$PATH"
export ANCHOR_PROVIDER_URL="https://api.mainnet-beta.solana.com"
export ANCHOR_WALLET="$HOME/.config/solana/id.json"
```

## Testing Installation

Create a test project to verify everything works:

```bash
# Create test project
anchor init anchor-test
cd anchor-test

# Build the project
anchor build

# Run tests
anchor test

# Clean up
cd ..
rm -rf anchor-test
```

## Getting Help

- **Anchor Documentation**: https://www.anchor-lang.com/
- **GitHub Issues**: https://github.com/coral-xyz/anchor/issues
- **Discord Community**: https://discord.gg/anchor
- **Stack Overflow**: Tag questions with `anchor-solana`

## Version Management

Use AVM (Anchor Version Manager) for managing multiple Anchor versions:

```bash
# List available versions
avm list

# Install specific version
avm install 0.29.0

# Switch between versions
avm use 0.29.0

# Show current version
avm current
```

This allows you to work with different projects that may require different Anchor versions.
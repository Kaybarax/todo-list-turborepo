# Blockchain Tools Installer

Automated installation script for blockchain development dependencies. This script installs and configures the necessary tools for developing on multiple blockchain networks including Polygon, Solana, and Polkadot.

## Features

- **Cross-platform support**: macOS, Linux, and Windows
- **Automatic dependency detection**: Checks for existing installations
- **Retry mechanisms**: Handles network failures gracefully
- **Version management**: Installs specific versions for compatibility
- **Platform-specific installation**: Uses appropriate package managers
- **Comprehensive error handling**: Provides actionable error messages

## Supported Tools

| Tool           | Description                               | Networks         |
| -------------- | ----------------------------------------- | ---------------- |
| **Rust**       | Rust programming language and Cargo       | Solana, Polkadot |
| **Solana CLI** | Command-line tools for Solana development | Solana           |
| **Anchor CLI** | Framework for Solana smart contracts      | Solana           |
| **Substrate**  | Tools for Polkadot development            | Polkadot         |
| **Node.js**    | JavaScript runtime and dependencies       | Polygon          |

## Usage

### Install All Tools

```bash
./scripts/install-blockchain-tools.sh --all
```

### Install Specific Tool

```bash
# Install Rust
./scripts/install-blockchain-tools.sh --tool=rust

# Install Solana CLI
./scripts/install-blockchain-tools.sh --tool=solana

# Install Anchor CLI
./scripts/install-blockchain-tools.sh --tool=anchor

# Install Substrate tools
./scripts/install-blockchain-tools.sh --tool=substrate

# Verify Node.js dependencies
./scripts/install-blockchain-tools.sh --tool=node
```

### Force Reinstallation

```bash
./scripts/install-blockchain-tools.sh --all --force
```

### Get Help

```bash
./scripts/install-blockchain-tools.sh --help
```

## Installation Details

### Rust Installation

- Uses `rustup` for cross-platform installation
- Installs stable toolchain by default
- Adds required components: `clippy`, `rustfmt`
- Installs WebAssembly target for Substrate development
- Updates PATH automatically

### Solana CLI Installation

- Downloads official Solana installer
- Installs specific version (1.18.0) for compatibility
- Configures for localhost development
- Updates PATH in shell profiles

### Anchor CLI Installation

- Installs Anchor Version Manager (AVM) first
- Compiles from source using Cargo
- Installs specific version (0.29.0)
- Requires Rust and Solana CLI as dependencies

### Substrate Tools Installation

- Installs Protocol Buffers compiler (protoc) if needed
- Adds WebAssembly compilation target
- Installs `cargo-contract` for ink! smart contracts
- Provides instructions for optional tools

### Node.js Dependencies

- Verifies Node.js version (20+ required)
- Installs project dependencies using pnpm
- Checks for proper workspace configuration

## Platform-Specific Notes

### macOS

- Uses Homebrew for system dependencies
- Requires Xcode Command Line Tools
- Automatically handles ARM64 and x86_64 architectures

### Linux

- Supports multiple package managers (apt, yum, pacman)
- May require sudo privileges for system packages
- Handles different distributions automatically

### Windows

- Provides manual installation instructions
- Supports WSL and Git Bash environments
- Includes PowerShell batch script alternative

## Error Handling

The script includes comprehensive error handling:

- **Network failures**: Automatic retry with exponential backoff
- **Permission errors**: Clear instructions for resolution
- **Missing dependencies**: Automatic installation attempts
- **Version conflicts**: Guidance for manual resolution
- **Platform incompatibility**: Alternative installation methods

## Environment Variables

You can customize the installation by setting these environment variables:

```bash
# Skip interactive prompts (for CI/CD)
export CI=true

# Custom installation paths
export CARGO_HOME=/custom/cargo
export RUSTUP_HOME=/custom/rustup

# Proxy settings
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080
```

## Troubleshooting

### Common Issues

1. **Permission denied errors**

   ```bash
   chmod +x scripts/install-blockchain-tools.sh
   ```

2. **Network connectivity issues**
   - Check internet connection
   - Configure proxy settings if needed
   - Try running with `--force` flag

3. **PATH not updated**

   ```bash
   source ~/.bashrc
   # or restart your terminal
   ```

4. **Rust compilation errors**
   - Ensure you have enough disk space (>2GB)
   - Check that build tools are installed

### Getting Help

- Run with `--help` for usage information
- Check the logs for detailed error messages
- Ensure you have the required permissions
- Verify your internet connection

## Testing

Run the test suite to verify the installation script:

```bash
./scripts/test-install-blockchain-tools.sh
```

## Integration

This script is designed to integrate with the existing build system:

- Called by `scripts/blockchain-deps-check.sh`
- Used in CI/CD pipelines
- Integrated with development setup scripts

## Version Information

- **Rust**: 1.70.0+
- **Solana CLI**: 1.18.0
- **Anchor CLI**: 0.29.0
- **Node.js**: 20.0.0+
- **Protocol Buffers**: Latest stable

## Contributing

When modifying this script:

1. Test on multiple platforms
2. Update version numbers as needed
3. Maintain backward compatibility
4. Update documentation
5. Run the test suite

## License

This script is part of the todo-list-turborepo project and follows the same license terms.

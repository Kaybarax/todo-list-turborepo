# Design Document

## Overview

This design addresses the blockchain development environment setup issues by creating a robust dependency management system that automatically detects, installs, and configures required blockchain development tools. The solution focuses on making the smart contract compilation process resilient and self-healing while providing clear feedback to developers.

## Architecture

### Component Structure

```
scripts/
├── blockchain-deps-check.sh     # Dependency verification script
├── install-blockchain-tools.sh  # Automated installation script
├── build-contracts.sh          # Enhanced build script (existing, to be modified)
└── troubleshooting/
    ├── anchor-setup.md         # Anchor-specific troubleshooting
    ├── solana-setup.md         # Solana CLI setup guide
    └── rust-setup.md           # Rust installation guide
```

### Dependency Management Flow

1. **Pre-compilation Check**: Verify all required tools are installed
2. **Automatic Installation**: Attempt to install missing dependencies
3. **Fallback Guidance**: Provide manual installation instructions if automatic fails
4. **Compilation Execution**: Proceed with contract compilation
5. **Post-compilation Validation**: Verify successful builds

## Components and Interfaces

### 1. Dependency Checker (`blockchain-deps-check.sh`)

**Purpose**: Comprehensive verification of blockchain development environment

**Interface**:
```bash
./scripts/blockchain-deps-check.sh [--fix] [--verbose] [--network=<polygon|solana|polkadot>]
```

**Responsibilities**:
- Check Node.js version compatibility
- Verify Rust installation and version
- Validate Solana CLI installation
- Confirm Anchor CLI availability
- Test Hardhat functionality for Polygon
- Verify Substrate tools for Polkadot

**Output Format**:
```
✓ Node.js v20.x.x (Required: 20+)
✓ Rust 1.70.0 (Required: 1.70+)
✗ Solana CLI not found
✗ Anchor CLI not found
⚠ Substrate tools not configured
```

### 2. Automated Installer (`install-blockchain-tools.sh`)

**Purpose**: Automated installation of missing blockchain development tools

**Interface**:
```bash
./scripts/install-blockchain-tools.sh [--tool=<anchor|solana|rust>] [--force]
```

**Installation Strategy**:
- **Rust**: Use rustup for cross-platform installation
- **Solana CLI**: Use official installer script
- **Anchor CLI**: Use cargo install with specific version pinning
- **Platform Detection**: Adapt commands for macOS, Linux, Windows

**Error Handling**:
- Retry mechanism for network failures
- Fallback to manual instructions
- Version conflict resolution
- Permission handling for system-wide installs

### 3. Enhanced Build Script (`build-contracts.sh`)

**Purpose**: Resilient contract compilation with dependency management

**Enhanced Flow**:
1. Run dependency check
2. Attempt automatic installation of missing tools
3. Validate environment before compilation
4. Execute network-specific builds with proper error handling
5. Generate compilation report

**Network-Specific Handling**:
- **Polygon**: Hardhat compilation with TypeScript generation
- **Solana**: Anchor build with program deployment preparation
- **Polkadot**: Substrate pallet compilation

## Data Models

### Environment Configuration

```typescript
interface BlockchainEnvironment {
  nodejs: {
    version: string;
    required: string;
    status: 'ok' | 'missing' | 'outdated';
  };
  rust: {
    version: string;
    required: string;
    status: 'ok' | 'missing' | 'outdated';
  };
  solana: {
    cli_version: string;
    anchor_version: string;
    status: 'ok' | 'missing' | 'partial';
  };
  polygon: {
    hardhat_status: 'ok' | 'missing';
    node_modules: boolean;
  };
  polkadot: {
    substrate_status: 'ok' | 'missing';
    cargo_contract: boolean;
  };
}
```

### Build Report

```typescript
interface BuildReport {
  timestamp: string;
  environment_check: boolean;
  networks: {
    polygon: {
      status: 'success' | 'failed' | 'skipped';
      contracts_compiled: string[];
      errors: string[];
    };
    solana: {
      status: 'success' | 'failed' | 'skipped';
      programs_built: string[];
      errors: string[];
    };
    polkadot: {
      status: 'success' | 'failed' | 'skipped';
      pallets_compiled: string[];
      errors: string[];
    };
  };
  total_duration: string;
  recommendations: string[];
}
```

## Error Handling

### Dependency Installation Failures

1. **Network Issues**: Retry with exponential backoff
2. **Permission Errors**: Provide sudo/admin instructions
3. **Version Conflicts**: Offer resolution strategies
4. **Platform Incompatibility**: Suggest alternative installation methods

### Compilation Failures

1. **Missing Dependencies**: Auto-install and retry
2. **Code Errors**: Pass through with enhanced error messages
3. **Environment Issues**: Provide troubleshooting guidance
4. **Partial Failures**: Continue with successful networks

### Logging Strategy

- **INFO**: General progress and status updates
- **WARN**: Non-critical issues that don't stop execution
- **ERROR**: Critical failures with actionable guidance
- **DEBUG**: Detailed information for troubleshooting

## Testing Strategy

### Unit Testing

- Test dependency detection logic
- Validate installation script functions
- Test error handling scenarios
- Verify cross-platform compatibility

### Integration Testing

- Test full build pipeline on clean environments
- Validate automatic dependency installation
- Test compilation across all supported networks
- Verify error recovery mechanisms

### Environment Testing

- Test on macOS, Linux, and Windows
- Test with different Node.js versions
- Test with missing vs. present dependencies
- Test in CI/CD environments

### Manual Testing Scenarios

1. **Fresh Environment**: Test on machine with no blockchain tools
2. **Partial Environment**: Test with some tools missing
3. **Outdated Environment**: Test with old versions of tools
4. **Network Failures**: Test installation with poor connectivity
5. **Permission Issues**: Test without admin privileges

## Implementation Phases

### Phase 1: Dependency Detection
- Create comprehensive dependency checker
- Implement cross-platform detection logic
- Add detailed reporting and logging

### Phase 2: Automated Installation
- Implement installation scripts for each tool
- Add error handling and retry logic
- Create platform-specific installation paths

### Phase 3: Build Script Enhancement
- Integrate dependency management into build process
- Add pre-compilation validation
- Implement graceful failure handling

### Phase 4: Documentation and Troubleshooting
- Create comprehensive setup documentation
- Add troubleshooting guides for common issues
- Implement interactive help system

## Security Considerations

- Validate installation sources and checksums
- Use official installation methods where possible
- Implement secure download mechanisms
- Avoid running untrusted scripts with elevated privileges
- Provide clear security warnings for manual installations
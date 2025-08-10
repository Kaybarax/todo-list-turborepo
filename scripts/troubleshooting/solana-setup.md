# Solana CLI Installation and Configuration Guide

## Overview

The Solana CLI is the primary tool for interacting with the Solana blockchain, managing wallets, deploying programs, and performing various blockchain operations. This guide covers installation, configuration, and troubleshooting.

## Prerequisites

- Operating System: macOS, Linux, or Windows
- Internet connection for downloading tools
- Terminal/Command Prompt access

## Installation

### Automatic Installation (Recommended)

Use our automated installer:
```bash
./scripts/install-blockchain-tools.sh --tool=solana
```

### Manual Installation

#### Method 1: Official Installer (Recommended)
```bash
# Download and run the official installer
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Add to PATH (add to ~/.bashrc, ~/.zshrc, or ~/.profile)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

#### Method 2: Using Package Managers

**macOS (Homebrew):**
```bash
brew install solana
```

**Ubuntu/Debian:**
```bash
# Add Solana repository
wget -qO - https://release.solana.com/v1.16.0/solana-release-x86_64-unknown-linux-gnu.tar.bz2 | tar jxf -
cd solana-release/
export PATH=$PWD/bin:$PATH
```

**Windows:**
```powershell
# Download Windows installer from https://github.com/solana-labs/solana/releases
# Or use Windows Subsystem for Linux (WSL)
```

## Initial Configuration

### 1. Verify Installation
```bash
solana --version
solana-keygen --version
```

### 2. Create Wallet
```bash
# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Or recover from seed phrase
solana-keygen recover --outfile ~/.config/solana/id.json
```

### 3. Configure Network
```bash
# Set to devnet for development
solana config set --url https://api.devnet.solana.com

# Set to mainnet for production
solana config set --url https://api.mainnet-beta.solana.com

# Set to localhost for local development
solana config set --url http://localhost:8899
```

### 4. Set Default Keypair
```bash
solana config set --keypair ~/.config/solana/id.json
```

### 5. Verify Configuration
```bash
solana config get
solana balance
```

## Common Issues and Solutions

### Issue 1: "solana: command not found"

**Symptoms:**
- Command `solana --version` returns "command not found"
- Installation appears successful but CLI is not available

**Solutions:**

1. **Check PATH configuration:**
   ```bash
   # Check current PATH
   echo $PATH
   
   # Add Solana to PATH (add to shell profile)
   export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
   source ~/.bashrc  # or ~/.zshrc
   ```

2. **Verify installation directory:**
   ```bash
   ls -la ~/.local/share/solana/install/active_release/bin/
   which solana
   ```

3. **Reinstall with explicit path:**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
   ```

### Issue 2: Network connection timeouts

**Symptoms:**
- "Connection timeout" errors
- "Failed to get recent blockhash" messages
- Slow or failed RPC calls

**Solutions:**

1. **Switch to different RPC endpoint:**
   ```bash
   # Try different devnet endpoints
   solana config set --url https://api.devnet.solana.com
   solana config set --url https://devnet.genesysgo.net
   
   # For mainnet
   solana config set --url https://api.mainnet-beta.solana.com
   solana config set --url https://solana-api.projectserum.com
   ```

2. **Check network connectivity:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"getHealth"}' https://api.devnet.solana.com
   ```

3. **Configure proxy if needed:**
   ```bash
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

### Issue 3: Insufficient funds for transactions

**Symptoms:**
- "Insufficient funds" errors
- Transaction failures due to low balance

**Solutions:**

1. **Request airdrop on devnet:**
   ```bash
   solana airdrop 2
   solana balance
   ```

2. **Check current balance and address:**
   ```bash
   solana balance
   solana address
   ```

3. **Use faucet for devnet:**
   ```bash
   # Alternative faucet method
   curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["YOUR_WALLET_ADDRESS", 2000000000]}' https://api.devnet.solana.com
   ```

### Issue 4: Keypair/wallet issues

**Symptoms:**
- "No such file or directory" for keypair
- Permission denied errors
- Invalid keypair format

**Solutions:**

1. **Create new keypair:**
   ```bash
   mkdir -p ~/.config/solana
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

2. **Fix permissions:**
   ```bash
   chmod 600 ~/.config/solana/id.json
   chown $USER ~/.config/solana/id.json
   ```

3. **Verify keypair format:**
   ```bash
   solana-keygen verify ~/.config/solana/id.json
   solana address --keypair ~/.config/solana/id.json
   ```

### Issue 5: Version compatibility issues

**Symptoms:**
- "Unsupported version" errors
- Build failures with version mismatches
- Deprecated command warnings

**Solutions:**

1. **Update to latest version:**
   ```bash
   solana-install update
   solana --version
   ```

2. **Install specific version:**
   ```bash
   solana-install init 1.16.0
   ```

3. **Check version compatibility:**
   ```bash
   solana --version
   anchor --version  # If using Anchor
   ```

### Issue 6: Local validator issues

**Symptoms:**
- Local validator fails to start
- Port conflicts
- Ledger corruption

**Solutions:**

1. **Start local validator:**
   ```bash
   solana-test-validator
   ```

2. **Reset ledger if corrupted:**
   ```bash
   solana-test-validator --reset
   ```

3. **Use different port:**
   ```bash
   solana-test-validator --rpc-port 8900
   ```

4. **Clean validator state:**
   ```bash
   rm -rf test-ledger/
   solana-test-validator
   ```

## Configuration Files

### Main Config File
Location: `~/.config/solana/cli/config.yml`

```yaml
json_rpc_url: "https://api.devnet.solana.com"
websocket_url: ""
keypair_path: /Users/username/.config/solana/id.json
address_labels:
  "11111111111111111111111111111111": System Program
commitment: confirmed
```

### Environment Variables
```bash
# Add to shell profile (~/.bashrc, ~/.zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
export SOLANA_KEYPAIR="$HOME/.config/solana/id.json"
export SOLANA_URL="https://api.devnet.solana.com"
```

## Network Endpoints

### Devnet (Development)
- RPC: `https://api.devnet.solana.com`
- WebSocket: `wss://api.devnet.solana.com/`

### Testnet (Testing)
- RPC: `https://api.testnet.solana.com`
- WebSocket: `wss://api.testnet.solana.com/`

### Mainnet Beta (Production)
- RPC: `https://api.mainnet-beta.solana.com`
- WebSocket: `wss://api.mainnet-beta.solana.com/`

### Local Development
- RPC: `http://localhost:8899`
- WebSocket: `ws://localhost:8900`

## Useful Commands

### Wallet Management
```bash
# Create new wallet
solana-keygen new

# Show wallet address
solana address

# Check balance
solana balance

# Request airdrop (devnet only)
solana airdrop 2
```

### Network Operations
```bash
# Show current configuration
solana config get

# Set network
solana config set --url https://api.devnet.solana.com

# Check network status
solana cluster-version
solana ping
```

### Program Deployment
```bash
# Deploy program
solana program deploy program.so

# Show program info
solana program show PROGRAM_ID

# Close program (recover rent)
solana program close PROGRAM_ID
```

## Platform-Specific Notes

### macOS
- Use Homebrew for easier management
- Ensure Xcode Command Line Tools are installed
- M1/M2 Macs fully supported

### Linux
- Most distributions supported
- May need to install curl and ca-certificates
- Consider using package manager when available

### Windows
- Native Windows support available
- WSL recommended for better compatibility
- PowerShell or Command Prompt both work

## Performance Optimization

### RPC Configuration
```bash
# Use faster RPC endpoints
solana config set --url https://solana-api.projectserum.com  # Mainnet
solana config set --url https://devnet.genesysgo.net        # Devnet
```

### Local Development
```bash
# Start local validator with optimizations
solana-test-validator --no-bpf-jit --reset --quiet
```

## Security Best Practices

1. **Protect your keypair:**
   ```bash
   chmod 600 ~/.config/solana/id.json
   ```

2. **Use different keypairs for different environments:**
   ```bash
   solana-keygen new --outfile ~/.config/solana/devnet.json
   solana-keygen new --outfile ~/.config/solana/mainnet.json
   ```

3. **Never share private keys or seed phrases**

4. **Use hardware wallets for mainnet operations**

## Getting Help

- **Official Documentation**: https://docs.solana.com/cli
- **GitHub Repository**: https://github.com/solana-labs/solana
- **Discord Community**: https://discord.gg/solana
- **Stack Overflow**: Tag questions with `solana`
- **Forum**: https://forum.solana.com/

## Version Management

```bash
# Check current version
solana --version

# Update to latest
solana-install update

# Install specific version
solana-install init 1.16.0

# List installed versions
solana-install list
```
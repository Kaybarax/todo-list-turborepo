const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Installation Scripts Integration', () => {
  const installScript = 'scripts/install-blockchain-tools.sh';
  
  beforeEach(() => {
    // Clean environment for each test
    process.env.PATH = process.env.ORIGINAL_PATH || process.env.PATH;
    process.env.SKIP_NETWORK_CHECK = 'true';
    process.env.CI = 'true';
  });

  describe('Script Execution', () => {
    test('should show help when --help is provided', () => {
      const result = executeScript(installScript, ['--help']);
      
      expect(result.output).toContain('Automated Blockchain Tools Installer');
      expect(result.output).toContain('USAGE:');
      expect(result.output).toContain('--tool=');
      expect(result.exitCode).toBe(0);
    });

    test('should handle invalid tool parameter', () => {
      const result = executeScript(installScript, ['--tool=invalid']);
      
      expect(result.output).toContain('Unknown tool');
      expect(result.exitCode).toBe(1);
    });

    test('should validate required parameters', () => {
      const result = executeScript(installScript, []);
      
      expect(result.output).toContain('tool parameter is required');
      expect(result.exitCode).toBe(2);
    });
  });

  describe('Platform Detection', () => {
    test('should detect platform correctly', () => {
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      expect(result.output).toMatch(/Platform: (macos|linux|windows|unknown)/);
    });

    test('should adapt installation commands for detected platform', () => {
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      // Should show platform-specific installation approach
      if (process.platform === 'darwin') {
        expect(result.output).toContain('macOS');
      } else if (process.platform === 'linux') {
        expect(result.output).toContain('linux');
      }
    });
  });

  describe('Network Connectivity Checks', () => {
    test('should skip network check when SKIP_NETWORK_CHECK is set', () => {
      process.env.SKIP_NETWORK_CHECK = 'true';
      
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      expect(result.output).not.toContain('Network connectivity check failed');
    });

    test('should handle network connectivity failures gracefully', () => {
      process.env.SKIP_NETWORK_CHECK = 'false';
      // Mock network failure by setting invalid proxy
      process.env.HTTP_PROXY = 'http://invalid-proxy:9999';
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('Network connectivity check failed');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Dependency Validation', () => {
    test('should check for existing installations before installing', () => {
      mockCommand('rustc', true, '1.75.0');
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('already installed');
      expect(result.exitCode).toBe(0);
    });

    test('should validate version requirements', () => {
      mockCommand('rustc', true, '1.60.0'); // Old version
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('outdated');
      expect(result.output).toContain('Updating');
    });

    test('should check for prerequisite tools', () => {
      // Test Anchor installation without Rust
      process.env.PATH = '/usr/bin:/bin'; // Minimal PATH
      
      const result = executeScript(installScript, ['--tool=anchor']);
      
      expect(result.output).toContain('Cargo not found');
      expect(result.output).toContain('Please install Rust first');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Installation Process Simulation', () => {
    test('should simulate Rust installation process', () => {
      // Remove rust from PATH to simulate missing installation
      process.env.PATH = process.env.PATH.replace(/[^:]*rust[^:]*:/g, '');
      
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      expect(result.output).toContain('Installing Rust using rustup');
      expect(result.output).toContain('curl --proto');
      expect(result.output).toContain('sh.rustup.rs');
    });

    test('should simulate Solana CLI installation process', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*solana[^:]*:/g, '');
      
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);
      
      expect(result.output).toContain('Installing Solana CLI');
      expect(result.output).toContain('release.solana.com');
    });

    test('should simulate Anchor CLI installation process', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo', true, '1.75.0');
      mockCommand('solana', true, '1.18.0');
      process.env.PATH = process.env.PATH.replace(/[^:]*anchor[^:]*:/g, '');
      
      const result = executeScript(installScript, ['--tool=anchor', '--dry-run']);
      
      expect(result.output).toContain('Installing Anchor CLI');
      expect(result.output).toContain('Anchor Version Manager');
      expect(result.output).toContain('cargo install');
    });
  });

  describe('Error Handling and Recovery', () => {
    test('should provide manual installation instructions on failure', () => {
      // Simulate installation failure by removing curl/wget
      process.env.PATH = '/usr/bin:/bin';
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('Manual Rust Installation');
      expect(result.output).toContain('Visit https://rustup.rs');
      expect(result.output).toContain('curl --proto');
      expect(result.exitCode).toBe(1);
    });

    test('should handle permission errors gracefully', () => {
      // Simulate permission error by trying to write to read-only directory
      const readOnlyDir = 'test/dependency-management/tmp/readonly';
      fs.mkdirSync(readOnlyDir, { recursive: true });
      fs.chmodSync(readOnlyDir, '444'); // Read-only
      
      process.env.HOME = readOnlyDir;
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('permission');
      expect(result.exitCode).toBe(1);
      
      // Cleanup
      fs.chmodSync(readOnlyDir, '755');
      fs.rmSync(readOnlyDir, { recursive: true });
    });

    test('should implement retry mechanism for network operations', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose']);
      
      expect(result.output).toContain('Attempt 1 of');
      expect(result.output).toContain('retry');
    });

    test('should validate installation after completion', () => {
      mockCommand('rustc', true, '1.75.0');
      
      const result = executeScript(installScript, ['--tool=rust']);
      
      expect(result.output).toContain('validation');
      expect(result.output).toContain('successfully');
    });
  });

  describe('Tool-Specific Installation Logic', () => {
    test('should handle Rust installation with additional components', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*rust[^:]*:/g, '');
      
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      expect(result.output).toContain('additional Rust components');
      expect(result.output).toContain('clippy');
      expect(result.output).toContain('rustfmt');
      expect(result.output).toContain('wasm32-unknown-unknown');
    });

    test('should handle Solana CLI configuration', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*solana[^:]*:/g, '');
      process.env.CI = 'false'; // Enable configuration in non-CI mode
      
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);
      
      expect(result.output).toContain('Configuring Solana');
      expect(result.output).toContain('solana config set');
    });

    test('should handle Substrate tools installation', () => {
      mockCommand('rustc', true, '1.75.0');
      
      const result = executeScript(installScript, ['--tool=substrate', '--dry-run']);
      
      expect(result.output).toContain('Protocol Buffers compiler');
      expect(result.output).toContain('cargo-contract');
      expect(result.output).toContain('wasm32-unknown-unknown');
    });
  });

  describe('Force Installation', () => {
    test('should reinstall when --force flag is used', () => {
      mockCommand('rustc', true, '1.75.0');
      
      const result = executeScript(installScript, ['--tool=rust', '--force', '--dry-run']);
      
      expect(result.output).toContain('Force installation enabled');
      expect(result.output).toContain('Installing Rust');
    });
  });

  describe('Verbose Mode', () => {
    test('should show detailed output in verbose mode', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);
      
      expect(result.output).toContain('[DEBUG]');
      expect(result.output).toContain('Platform:');
      expect(result.output).toContain('Architecture:');
    });
  });

  describe('CI Environment Handling', () => {
    test('should adapt behavior for CI environment', () => {
      process.env.CI = 'true';
      
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);
      
      expect(result.output).not.toContain('interactive');
      expect(result.output).toContain('CI environment detected');
    });

    test('should skip interactive prompts in CI', () => {
      process.env.CI = 'true';
      
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);
      
      expect(result.output).not.toContain('Would you like to');
      expect(result.output).not.toContain('Press any key');
    });
  });
});
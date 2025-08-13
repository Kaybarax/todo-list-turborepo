const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Dependency Detection Functions', () => {
  const depsCheckScript = 'scripts/blockchain-deps-check.sh';

  beforeEach(() => {
    // Reset PATH to clean state for each test
    process.env.PATH = process.env.ORIGINAL_PATH || process.env.PATH;
  });

  describe('Node.js Detection', () => {
    test('should detect Node.js when available', () => {
      mockCommand('node', true, '20.1.0');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Node.js v20.1.0');
      expect(result.output).toContain('✓');
    });

    test('should report error when Node.js is missing', () => {
      // Remove node from PATH
      process.env.PATH = process.env.PATH.replace(/[^:]*node[^:]*:/g, '');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Node.js not found');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });

    test('should report error when Node.js version is too old', () => {
      mockCommand('node', true, '18.0.0');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Version too old');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Rust Detection', () => {
    test('should detect Rust when available', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo', true, '1.75.0');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Rust 1.75.0');
      expect(result.output).toContain('✓');
    });

    test('should report error when Rust is missing', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*rust[^:]*:/g, '');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Rust not found');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });

    test('should warn when cargo is missing but rustc is present', () => {
      mockCommand('rustc', true, '1.75.0');
      // Don't mock cargo

      const result = executeScript(depsCheckScript, ['--network=solana', '--verbose']);

      expect(result.output).toContain('Cargo not found');
      expect(result.output).toContain('⚠');
    });
  });

  describe('Solana CLI Detection', () => {
    test('should detect Solana CLI when available', () => {
      mockCommand('solana', true, '1.18.0');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Solana CLI 1.18.0');
      expect(result.output).toContain('✓');
    });

    test('should report error when Solana CLI is missing', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*solana[^:]*:/g, '');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Solana CLI not found');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });

    test('should report error when Solana CLI version is too old', () => {
      mockCommand('solana', true, '1.14.0');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Version too old');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Anchor CLI Detection', () => {
    test('should detect Anchor CLI when available', () => {
      const mockAnchor = createTestFixture(
        'mock-anchor',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "anchor-cli 0.29.0"
  exit 0
fi
echo "Mock anchor command"
exit 0`,
      );
      fs.chmodSync(mockAnchor, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockAnchor))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Anchor CLI 0.29.0');
      expect(result.output).toContain('✓');
    });

    test('should report error when Anchor CLI is missing', () => {
      process.env.PATH = process.env.PATH.replace(/[^:]*anchor[^:]*:/g, '');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Anchor CLI not found');
      expect(result.output).toContain('✗');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Version Comparison', () => {
    test('should correctly compare semantic versions', () => {
      // Test version comparison by checking different Node.js versions
      const testCases = [
        { version: '20.0.0', expected: true },
        { version: '20.1.0', expected: true },
        { version: '21.0.0', expected: true },
        { version: '19.9.9', expected: false },
        { version: '18.0.0', expected: false },
      ];

      testCases.forEach(({ version, expected }) => {
        mockCommand('node', true, version);

        const result = executeScript(depsCheckScript, ['--network=polygon']);

        if (expected) {
          expect(result.output).toContain('✓');
          expect(result.exitCode).toBe(0);
        } else {
          expect(result.output).toContain('✗');
          expect(result.exitCode).toBe(1);
        }
      });
    });
  });

  describe('Network-Specific Filtering', () => {
    test('should only check Polygon dependencies when network=polygon', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('pnpm', true, '9.1.0');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Polygon Dependencies');
      expect(result.output).not.toContain('Solana Dependencies');
      expect(result.output).not.toContain('Polkadot Dependencies');
    });

    test('should only check Solana dependencies when network=solana', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('solana', true, '1.18.0');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Solana Dependencies');
      expect(result.output).not.toContain('Polygon Dependencies');
      expect(result.output).not.toContain('Polkadot Dependencies');
    });

    test('should check all dependencies when network=all or no network specified', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('rustc', true, '1.75.0');

      const result = executeScript(depsCheckScript, ['--network=all']);

      expect(result.output).toContain('Polygon Dependencies');
      expect(result.output).toContain('Solana Dependencies');
      expect(result.output).toContain('Polkadot Dependencies');
    });
  });

  describe('Verbose Mode', () => {
    test('should show detailed information in verbose mode', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo', true, '1.75.0');

      const result = executeScript(depsCheckScript, ['--verbose']);

      expect(result.output).toContain('[DEBUG]');
      expect(result.output).toContain('Checking Node.js installation');
      expect(result.output).toContain('Checking Rust installation');
    });

    test('should show cargo version in verbose mode when available', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo', true, '1.75.0');

      const result = executeScript(depsCheckScript, ['--verbose', '--network=solana']);

      expect(result.output).toContain('Cargo 1.75.0 detected');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid network parameter', () => {
      const result = executeScript(depsCheckScript, ['--network=invalid']);

      expect(result.output).toContain('Unknown network: invalid');
      expect(result.exitCode).toBe(1);
    });

    test('should handle command execution failures gracefully', () => {
      // Create a mock command that fails
      const failingCommand = createTestFixture(
        'failing-node',
        `#!/bin/bash
exit 1`,
      );
      fs.chmodSync(failingCommand, '755');
      process.env.PATH = `${path.dirname(path.resolve(failingCommand))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Node.js not found');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Platform Detection', () => {
    test('should detect platform correctly', () => {
      const result = executeScript(depsCheckScript, ['--verbose']);

      expect(result.output).toMatch(/Platform: (macos|linux|windows|unknown)/);
    });
  });

  describe('Exit Codes', () => {
    test('should return 0 when all dependencies are satisfied', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('pnpm', true, '9.1.0');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('All dependencies are properly installed');
    });

    test('should return 1 when dependencies are missing', () => {
      process.env.PATH = '/usr/bin:/bin'; // Minimal PATH without our tools

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.exitCode).toBe(1);
      expect(result.output).toContain('Some dependencies are missing');
    });

    test('should return 2 for invalid arguments', () => {
      const result = executeScript(depsCheckScript, ['--invalid-option']);

      expect(result.exitCode).toBe(2);
      expect(result.output).toContain('Unknown option');
    });
  });
});

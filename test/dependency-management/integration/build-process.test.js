const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Build Process Integration', () => {
  const buildScript = 'scripts/build-contracts.sh';
  
  beforeEach(() => {
    process.env.SKIP_DEPS_CHECK = 'false';
    process.env.AUTO_INSTALL = 'false';
    process.env.RUN_TESTS = 'false';
    process.env.CI = 'true';
  });

  describe('Dependency Integration', () => {
    test('should run dependency check before building', () => {
      const result = executeScript(buildScript, ['--network=polygon', '--skip-tests']);
      
      expect(result.output).toContain('Checking dependencies');
      expect(result.output).toContain('network: polygon');
    });

    test('should skip dependency check when SKIP_DEPS_CHECK is true', () => {
      process.env.SKIP_DEPS_CHECK = 'true';
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('Skipping dependency check');
    });

    test('should attempt auto-install when AUTO_INSTALL is enabled', () => {
      process.env.AUTO_INSTALL = 'true';
      // Simulate missing dependencies
      process.env.PATH = '/usr/bin:/bin';
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('Attempting automatic installation');
    });

    test('should provide manual guidance when auto-install fails', () => {
      process.env.AUTO_INSTALL = 'true';
      process.env.PATH = '/usr/bin:/bin';
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('Manual installation guidance');
      expect(result.output).toContain('For polygon development, you need');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Network-Specific Validation', () => {
    test('should validate Polygon dependencies before building', () => {
      mockCommand('node', false); // Missing Node.js
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('Polygon dependency validation failed');
      expect(result.output).toContain('Node.js not found');
      expect(result.exitCode).toBe(1);
    });

    test('should validate Solana dependencies before building', () => {
      mockCommand('rustc', false); // Missing Rust
      
      const result = executeScript(buildScript, ['--network=solana']);
      
      expect(result.output).toContain('Solana dependency validation failed');
      expect(result.output).toContain('Rust not found');
      expect(result.exitCode).toBe(1);
    });

    test('should validate Polkadot dependencies before building', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo-contract', false); // Missing cargo-contract
      
      const result = executeScript(buildScript, ['--network=polkadot']);
      
      expect(result.output).toContain('Polkadot dependency validation failed');
      expect(result.output).toContain('cargo-contract not found');
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Build Environment Setup', () => {
    test('should create necessary directories for build artifacts', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('pnpm', true, '9.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--dry-run']);
      
      expect(result.output).toContain('Initializing build environment');
    });

    test('should validate project structure before building', () => {
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      if (!fs.existsSync('apps/smart-contracts/polygon/package.json')) {
        expect(result.output).toContain('package.json not found');
        expect(result.exitCode).toBe(1);
      }
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('should continue with other networks when one fails', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('rustc', false); // Rust missing, Solana will fail
      
      const result = executeScript(buildScript, ['--network=all']);
      
      expect(result.output).toContain('Polygon');
      expect(result.output).toContain('Solana dependency validation failed');
      expect(result.output).toContain('continuing with other networks');
    });

    test('should provide detailed error information on build failure', () => {
      mockCommand('node', true, '18.0.0'); // Too old
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('version 18.0.0 is too old');
      expect(result.output).toContain('Required: 20+');
      expect(result.exitCode).toBe(1);
    });

    test('should handle missing project directories gracefully', () => {
      mockCommand('node', true, '20.1.0');
      
      // Test with non-existent network directory
      const result = executeScript(buildScript, ['--network=polygon']);
      
      if (!fs.existsSync('apps/smart-contracts/polygon')) {
        expect(result.output).toContain('directory not found');
        expect(result.output).toContain('skipping');
      }
    });
  });

  describe('Build Validation', () => {
    test('should validate build artifacts after compilation', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('pnpm', true, '9.1.0');
      
      // Create mock artifacts directory
      const artifactsDir = 'test/dependency-management/tmp/artifacts';
      fs.mkdirSync(artifactsDir, { recursive: true });
      fs.writeFileSync(`${artifactsDir}/Contract.json`, '{"contractName": "Contract"}');
      
      const result = executeScript(buildScript, ['--network=polygon', '--dry-run']);
      
      expect(result.output).toContain('Validating build artifacts');
      
      // Cleanup
      fs.rmSync(artifactsDir, { recursive: true });
    });

    test('should report missing build artifacts', () => {
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--dry-run']);
      
      expect(result.output).toContain('build artifacts');
    });
  });

  describe('Interactive Mode Integration', () => {
    test('should offer interactive troubleshooting on failure', () => {
      process.env.CI = 'false'; // Enable interactive mode
      mockCommand('node', false);
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('interactive troubleshooting');
      expect(result.output).toContain('--interactive');
    });

    test('should run environment diagnosis when requested', () => {
      const result = executeScript(buildScript, ['--diagnose']);
      
      expect(result.output).toContain('comprehensive environment diagnosis');
    });
  });

  describe('Logging and Reporting', () => {
    test('should generate structured build logs', () => {
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--verbose']);
      
      expect(result.output).toContain('[INFO]');
      expect(result.output).toContain('[DEBUG]');
      expect(result.output).toContain('Build process started');
    });

    test('should provide build summary with status indicators', () => {
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toMatch(/✓|✗|⚠/); // Status indicators
      expect(result.output).toContain('Build Summary');
    });

    test('should show progress indicators for long operations', () => {
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--verbose']);
      
      expect(result.output).toContain('progress');
    });
  });

  describe('Configuration Handling', () => {
    test('should respect environment variable configuration', () => {
      process.env.RUN_TESTS = 'true';
      process.env.GENERATE_DOCS = 'true';
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon']);
      
      expect(result.output).toContain('Running tests');
      expect(result.output).toContain('Generating documentation');
    });

    test('should handle command line argument overrides', () => {
      process.env.RUN_TESTS = 'true';
      mockCommand('node', true, '20.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--skip-tests']);
      
      expect(result.output).toContain('Skipping tests');
    });
  });

  describe('Network-Specific Build Processes', () => {
    test('should handle Polygon-specific build steps', () => {
      mockCommand('node', true, '20.1.0');
      mockCommand('pnpm', true, '9.1.0');
      
      const result = executeScript(buildScript, ['--network=polygon', '--dry-run']);
      
      expect(result.output).toContain('Polygon contract build');
      expect(result.output).toContain('Hardhat');
    });

    test('should handle Solana-specific build steps', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('solana', true, '1.18.0');
      mockCommand('anchor', true, '0.29.0');
      
      const result = executeScript(buildScript, ['--network=solana', '--dry-run']);
      
      expect(result.output).toContain('Solana program build');
      expect(result.output).toContain('Anchor');
    });

    test('should handle Polkadot-specific build steps', () => {
      mockCommand('rustc', true, '1.75.0');
      mockCommand('cargo-contract', true, '3.0.0');
      
      const result = executeScript(buildScript, ['--network=polkadot', '--dry-run']);
      
      expect(result.output).toContain('Polkadot pallet build');
      expect(result.output).toContain('Substrate');
    });
  });
});
const { execSync } = require('child_process');

describe('Version Comparison Logic', () => {
  const depsCheckScript = 'scripts/blockchain-deps-check.sh';

  describe('Semantic Version Parsing', () => {
    test('should handle versions with v prefix', () => {
      mockCommand('node', true, 'v20.1.0');

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.output).toContain('Node.js v20.1.0');
      expect(result.exitCode).toBe(0);
    });

    test('should handle versions without v prefix', () => {
      mockCommand('rustc', true, '1.75.0');

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Rust 1.75.0');
      expect(result.exitCode).toBe(0);
    });

    test('should handle complex version strings', () => {
      const mockSolana = createTestFixture(
        'mock-solana-complex',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "solana-cli 1.18.0 (src:12345678; feat:1234567890)"
  exit 0
fi
echo "Mock solana command"
exit 0`,
      );
      fs.chmodSync(mockSolana, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockSolana))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Solana CLI 1.18.0');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Version Comparison Edge Cases', () => {
    test('should handle equal versions correctly', () => {
      mockCommand('node', true, '20.0.0'); // Exactly minimum required

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('✓');
    });

    test('should handle patch version differences', () => {
      const testCases = [
        { version: '20.0.1', shouldPass: true },
        { version: '20.0.0', shouldPass: true },
        { version: '19.9.9', shouldPass: false },
      ];

      testCases.forEach(({ version, shouldPass }) => {
        mockCommand('node', true, version);

        const result = executeScript(depsCheckScript, ['--network=polygon']);

        if (shouldPass) {
          expect(result.exitCode).toBe(0);
        } else {
          expect(result.exitCode).toBe(1);
        }
      });
    });

    test('should handle minor version differences', () => {
      const testCases = [
        { version: '20.1.0', shouldPass: true },
        { version: '20.0.0', shouldPass: true },
        { version: '19.99.0', shouldPass: false },
      ];

      testCases.forEach(({ version, shouldPass }) => {
        mockCommand('rustc', true, version);

        const result = executeScript(depsCheckScript, ['--network=solana']);

        // Note: Rust minimum is 1.70.0, so 20.x.x versions should all pass
        // This test is more about the comparison logic
        expect(result.success || result.exitCode === 0).toBe(shouldPass);
      });
    });

    test('should handle major version differences', () => {
      const testCases = [
        { version: '21.0.0', shouldPass: true },
        { version: '20.0.0', shouldPass: true },
        { version: '19.0.0', shouldPass: false },
      ];

      testCases.forEach(({ version, shouldPass }) => {
        mockCommand('node', true, version);

        const result = executeScript(depsCheckScript, ['--network=polygon']);

        if (shouldPass) {
          expect(result.exitCode).toBe(0);
        } else {
          expect(result.exitCode).toBe(1);
        }
      });
    });
  });

  describe('Invalid Version Handling', () => {
    test('should handle malformed version strings', () => {
      const mockInvalidVersion = createTestFixture(
        'mock-invalid-version',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "invalid-version-string"
  exit 0
fi
echo "Mock command"
exit 0`,
      );
      fs.chmodSync(mockInvalidVersion, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockInvalidVersion))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      // Should handle gracefully and report as missing or invalid
      expect(result.exitCode).toBe(1);
    });

    test('should handle empty version output', () => {
      const mockEmptyVersion = createTestFixture(
        'mock-empty-version',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo ""
  exit 0
fi
echo "Mock command"
exit 0`,
      );
      fs.chmodSync(mockEmptyVersion, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockEmptyVersion))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.exitCode).toBe(1);
    });

    test('should handle version command failures', () => {
      const mockFailingVersion = createTestFixture(
        'mock-failing-version',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  exit 1
fi
echo "Mock command"
exit 0`,
      );
      fs.chmodSync(mockFailingVersion, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockFailingVersion))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=polygon']);

      expect(result.exitCode).toBe(1);
    });
  });

  describe('Anchor Version Parsing', () => {
    test('should extract version from anchor --version output', () => {
      const mockAnchor = createTestFixture(
        'mock-anchor-version',
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
      expect(result.exitCode).toBe(0);
    });

    test('should handle complex anchor version output', () => {
      const mockAnchorComplex = createTestFixture(
        'mock-anchor-complex',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "anchor-cli 0.29.0
solana-cli 1.18.0 (src:12345678; feat:1234567890)
rustc 1.75.0 (82e1608df 2023-12-21)"
  exit 0
fi
echo "Mock anchor command"
exit 0`,
      );
      fs.chmodSync(mockAnchorComplex, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockAnchorComplex))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Anchor CLI 0.29.0');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Rust Version Parsing', () => {
    test('should extract version from rustc --version output', () => {
      const mockRustc = createTestFixture(
        'mock-rustc-version',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "rustc 1.75.0 (82e1608df 2023-12-21)"
  exit 0
fi
echo "Mock rustc command"
exit 0`,
      );
      fs.chmodSync(mockRustc, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockRustc))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Rust 1.75.0');
      expect(result.exitCode).toBe(0);
    });

    test('should handle nightly rust versions', () => {
      const mockRustcNightly = createTestFixture(
        'mock-rustc-nightly',
        `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "rustc 1.76.0-nightly (12345678 2023-12-21)"
  exit 0
fi
echo "Mock rustc command"
exit 0`,
      );
      fs.chmodSync(mockRustcNightly, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockRustcNightly))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--network=solana']);

      expect(result.output).toContain('Rust 1.76.0');
      expect(result.exitCode).toBe(0);
    });
  });
});

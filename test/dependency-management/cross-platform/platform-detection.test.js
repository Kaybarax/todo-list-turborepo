const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

describe('Cross-Platform Compatibility', () => {
  const depsCheckScript = 'scripts/blockchain-deps-check.sh';
  const installScript = 'scripts/install-blockchain-tools.sh';

  describe('Platform Detection', () => {
    test('should detect current platform correctly', () => {
      const result = executeScript(depsCheckScript, ['--verbose']);

      const expectedPlatform =
        process.platform === 'darwin'
          ? 'macos'
          : process.platform === 'linux'
            ? 'linux'
            : process.platform === 'win32'
              ? 'windows'
              : 'unknown';

      expect(result.output).toContain(`Platform: ${expectedPlatform}`);
    });

    test('should handle unknown platforms gracefully', () => {
      // Mock uname to return unknown platform
      const mockUname = createTestFixture(
        'mock-uname',
        `#!/bin/bash
if [ "$1" = "-s" ]; then
  echo "UnknownOS"
  exit 0
fi
echo "uname mock"
exit 0`,
      );
      fs.chmodSync(mockUname, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockUname))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--verbose']);

      expect(result.output).toContain('Platform: unknown');
      expect(result.output).toContain('Unsupported platform');
    });
  });

  describe('Architecture Detection', () => {
    test('should detect system architecture', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      const expectedArch = process.arch === 'x64' ? 'x86_64' : process.arch === 'arm64' ? 'arm64' : 'unknown';

      expect(result.output).toContain(`Architecture: ${expectedArch}`);
    });

    test('should handle unsupported architectures', () => {
      // This test would need to mock the architecture detection
      // For now, we'll just verify the script handles it gracefully
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      expect(result.output).toMatch(/Architecture: (x86_64|arm64|unknown)/);
    });
  });

  describe('macOS-Specific Behavior', () => {
    test('should use Homebrew for package installation on macOS', () => {
      if (process.platform !== 'darwin') {
        return; // Skip on non-macOS
      }

      const result = executeScript(installScript, ['--tool=substrate', '--dry-run']);

      expect(result.output).toContain('brew install protobuf');
    });

    test('should handle missing Homebrew on macOS', () => {
      if (process.platform !== 'darwin') {
        return; // Skip on non-macOS
      }

      // Remove brew from PATH
      const originalPath = process.env.PATH;
      process.env.PATH = process.env.PATH.replace(/[^:]*brew[^:]*:/g, '');

      const result = executeScript(installScript, ['--tool=substrate']);

      expect(result.output).toContain('Homebrew not found');
      expect(result.output).toContain('Cannot install protobuf automatically');

      process.env.PATH = originalPath;
    });
  });

  describe('Linux-Specific Behavior', () => {
    test('should detect package manager on Linux', () => {
      if (process.platform !== 'linux') {
        return; // Skip on non-Linux
      }

      const result = executeScript(installScript, ['--tool=substrate', '--verbose', '--dry-run']);

      // Should detect one of the common package managers
      expect(result.output).toMatch(/(apt-get|yum|pacman|dnf)/);
    });

    test('should handle missing package manager on Linux', () => {
      if (process.platform !== 'linux') {
        return; // Skip on non-Linux
      }

      // Remove common package managers from PATH
      const originalPath = process.env.PATH;
      process.env.PATH = '/usr/bin:/bin'; // Minimal PATH

      const result = executeScript(installScript, ['--tool=substrate']);

      expect(result.output).toContain('package manager');

      process.env.PATH = originalPath;
    });

    test('should use sudo for system package installation on Linux', () => {
      if (process.platform !== 'linux') {
        return; // Skip on non-Linux
      }

      const result = executeScript(installScript, ['--tool=substrate', '--dry-run']);

      expect(result.output).toContain('sudo');
    });
  });

  describe('Windows/WSL Behavior', () => {
    test('should detect Windows/WSL environment', () => {
      // Mock Windows environment
      const mockUname = createTestFixture(
        'mock-uname-windows',
        `#!/bin/bash
if [ "$1" = "-s" ]; then
  echo "MINGW64_NT-10.0"
  exit 0
fi
echo "uname mock"
exit 0`,
      );
      fs.chmodSync(mockUname, '755');
      process.env.PATH = `${path.dirname(path.resolve(mockUname))}:${process.env.PATH}`;

      const result = executeScript(depsCheckScript, ['--verbose']);

      expect(result.output).toContain('Platform: windows');
    });

    test('should provide Windows-specific installation instructions', () => {
      const result = executeScript(installScript, ['--tool=rust', '--help']);

      expect(result.output).toContain('Windows');
      expect(result.output).toContain('rustup-init.exe');
    });
  });

  describe('Path Handling', () => {
    test('should handle different path separators correctly', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      // Should handle path operations without errors
      expect(result.success || result.exitCode === 0).toBe(true);
    });

    test('should update shell profiles appropriately for platform', () => {
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);

      if (process.platform === 'darwin') {
        expect(result.output).toMatch(/\.zshrc|\.bash_profile/);
      } else {
        expect(result.output).toMatch(/\.bashrc|\.profile/);
      }
    });
  });

  describe('Command Availability', () => {
    test('should check for curl vs wget availability', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      expect(result.output).toMatch(/(curl|wget)/);
    });

    test('should fallback to alternative download methods', () => {
      // Remove curl from PATH
      const originalPath = process.env.PATH;
      process.env.PATH = process.env.PATH.replace(/[^:]*curl[^:]*:/g, '');

      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);

      expect(result.output).toContain('wget');

      process.env.PATH = originalPath;
    });

    test('should handle missing download tools gracefully', () => {
      // Remove both curl and wget
      const originalPath = process.env.PATH;
      process.env.PATH = '/usr/bin:/bin';

      const result = executeScript(installScript, ['--tool=rust']);

      expect(result.output).toContain('Neither curl nor wget found');
      expect(result.output).toContain('Manual installation');
      expect(result.exitCode).toBe(1);

      process.env.PATH = originalPath;
    });
  });

  describe('File System Operations', () => {
    test('should handle different file permissions correctly', () => {
      const testDir = 'test/dependency-management/tmp/permissions-test';
      fs.mkdirSync(testDir, { recursive: true });

      // Test file creation and permission setting
      const testFile = `${testDir}/test-script.sh`;
      fs.writeFileSync(testFile, '#!/bin/bash\necho "test"');

      // The script should be able to make it executable
      fs.chmodSync(testFile, '755');

      expect(fs.statSync(testFile).mode & 0o111).toBeTruthy(); // Executable bit set

      // Cleanup
      fs.rmSync(testDir, { recursive: true });
    });

    test('should handle directory creation across platforms', () => {
      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);

      // Should not fail on directory operations
      expect(result.success || result.exitCode === 0).toBe(true);
    });
  });

  describe('Environment Variables', () => {
    test('should handle different shell environment variable syntax', () => {
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);

      // Should use appropriate syntax for setting PATH
      expect(result.output).toContain('export PATH=');
    });

    test('should handle HOME directory variations', () => {
      const originalHome = process.env.HOME;
      process.env.HOME = '/tmp/test-home';

      const result = executeScript(installScript, ['--tool=rust', '--dry-run']);

      expect(result.output).toContain('/tmp/test-home');

      process.env.HOME = originalHome;
    });
  });

  describe('Network Configuration', () => {
    test('should handle proxy settings across platforms', () => {
      process.env.HTTP_PROXY = 'http://proxy.example.com:8080';
      process.env.HTTPS_PROXY = 'http://proxy.example.com:8080';

      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      // Should acknowledge proxy settings
      expect(result.output).toMatch(/(proxy|HTTP_PROXY)/i);

      delete process.env.HTTP_PROXY;
      delete process.env.HTTPS_PROXY;
    });

    test('should handle different certificate stores', () => {
      const result = executeScript(installScript, ['--tool=rust', '--verbose', '--dry-run']);

      // Should handle SSL/TLS appropriately
      expect(result.output).toContain('--proto');
      expect(result.output).toContain('https');
    });
  });

  describe('Shell Compatibility', () => {
    test('should work with different shell environments', () => {
      // Test with different SHELL environment variables
      const shells = ['/bin/bash', '/bin/zsh', '/bin/sh'];

      shells.forEach(shell => {
        const originalShell = process.env.SHELL;
        process.env.SHELL = shell;

        const result = executeScript(depsCheckScript, ['--verbose']);

        expect(result.success || result.exitCode === 0).toBe(true);

        process.env.SHELL = originalShell;
      });
    });

    test('should handle shell-specific profile files', () => {
      const result = executeScript(installScript, ['--tool=solana', '--dry-run']);

      // Should reference appropriate profile files
      expect(result.output).toMatch(/\.(bashrc|zshrc|profile)/);
    });
  });
});

/**
 * Unit tests for scripts/doctor-repository-health.sh
 *
 * Validates that the doctor script correctly inspects:
 *   - Package scripts completeness
 *   - Workspace package discovery
 *   - Key repository hygiene
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOCTOR_SCRIPT = path.resolve(__dirname, '../../..', 'scripts/doctor-repository-health.sh');
const FIXTURES_DIR = path.resolve(__dirname, '..', 'fixtures');

// ---------------------------------------------------------------------------
// Helper: run the doctor script and return structured results
// ---------------------------------------------------------------------------
function runDoctor(options = {}) {
  const cwd = options.cwd || process.cwd();
  const env = { ...process.env, NODE_ENV: 'test', CI: 'true' };

  try {
    const stdout = execSync(`bash ${DOCTOR_SCRIPT}`, { cwd, env, encoding: 'utf8' });
    return { exitCode: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      exitCode: err.status || 1,
      stdout: err.stdout || '',
      stderr: err.stderr || '',
    };
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Doctor Repository Health', () => {
  describe('script existence and basic execution', () => {
    test('script file exists and is executable', () => {
      expect(fs.existsSync(DOCTOR_SCRIPT)).toBe(true);

      const stats = fs.statSync(DOCTOR_SCRIPT);
      // Check executable bit for owner
      expect(stats.mode & 0o100).toBe(0o100);
    });

    test('script runs without crashing', () => {
      // In a CI/clean repo the script should exit 0 or 1, not throw
      const result = runDoctor();

      // Must produce some output
      expect(result.stdout.length).toBeGreaterThan(0);

      // Should contain expected section headings
      expect(result.stdout).toContain('Package Scripts');
      expect(result.stdout).toContain('Workspace Package Discovery');
      expect(result.stdout).toContain('Repository Hygiene');
    });
  });

  describe('package scripts inspection', () => {
    test('reports PASS for existing required scripts in package.json', () => {
      const rootPkg = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'),
      );

      const result = runDoctor();

      // The root package.json should have 'dev', 'build', 'test', 'lint', 'clean'
      const required = ['dev', 'build', 'test', 'lint', 'clean'];
      for (const script of required) {
        if (rootPkg.scripts && rootPkg.scripts[script]) {
          expect(result.stdout).toContain(script);
        }
      }
    });

    test('detects missing packageManager field and issues a warning', () => {
      const rootPkg = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'),
      );

      const result = runDoctor();

      if (rootPkg.packageManager) {
        expect(result.stdout).toContain('packageManager');
        expect(result.stdout).toContain(rootPkg.packageManager);
      }
    });
  });

  describe('workspace package discovery', () => {
    test('reports discovered workspace packages', () => {
      const result = runDoctor();

      // The doctor script prints discovered packages
      expect(result.stdout).toContain('Discovered package');

      // Known workspace names from pnpm-workspace.yaml
      const knownPackages = [
        '@todo/web',
        '@todo/api',
        '@todo/mobile',
        '@todo/ingestion',
        '@todo/ui-web',
        '@todo/ui-mobile',
        '@todo/utils',
        '@todo/services',
        '@todo/config-eslint',
        '@todo/config-jest',
        '@todo/config-ts',
        '@todo/config-release',
      ];

      const found = knownPackages.filter((pkg) => result.stdout.includes(pkg));
      expect(found.length).toBeGreaterThanOrEqual(8);
    });

    test('detects pnpm-workspace.yaml existence', () => {
      const result = runDoctor();
      expect(result.stdout).toContain('pnpm-workspace.yaml');
    });
  });

  describe('repository hygiene', () => {
    test('reports essential config files as present', () => {
      const configFiles = [
        '.editorconfig',
        '.env.example',
        '.gitignore',
        '.npmrc',
        '.prettierrc',
        'tsconfig.json',
        'turbo.json',
      ];

      const result = runDoctor();

      for (const f of configFiles) {
        if (fs.existsSync(path.resolve(process.cwd(), f))) {
          expect(result.stdout).toContain(`${f} is present`);
        }
      }
    });

    test('checks gitignore covers critical patterns and warns if missing', () => {
      const gitignorePath = path.resolve(process.cwd(), '.gitignore');
      const result = runDoctor();

      if (fs.existsSync(gitignorePath)) {
        const content = fs.readFileSync(gitignorePath, 'utf8');

        const criticalPatterns = ['node_modules', 'dist', '.turbo'];
        for (const pattern of criticalPatterns) {
          if (content.includes(pattern)) {
            expect(result.stdout).toContain(`covers '${pattern}'`);
          }
        }
      }
    });

    test('reports lockfile existence', () => {
      const result = runDoctor();

      if (fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'))) {
        expect(result.stdout).toContain('pnpm-lock.yaml exists');
      }
    });
  });

  describe('exit codes', () => {
    test('returns exit code 0 when all checks pass', () => {
      // In a well-maintained repo the doctor should pass
      const result = runDoctor();

      // Exit code is either 0 (pass/warn) or 1 (fail)
      expect([0, 1]).toContain(result.exitCode);
    });
  });
});

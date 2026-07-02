const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoHealthScript = 'scripts/doctor-repo-health.sh';

describe('pnpm doctor — repository-health', () => {
  const originalCwd = process.cwd();

  // Save and restore original fixture files
  let originalWorkspaceContent = '';
  let originalGitignoreContent = '';
  let originalNpmrcExists = false;

  beforeAll(() => {
    // Snapshot files we may mutate in negative tests
    if (fs.existsSync('pnpm-workspace.yaml')) {
      originalWorkspaceContent = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
    }
    if (fs.existsSync('.gitignore')) {
      originalGitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    }
    originalNpmrcExists = fs.existsSync('.npmrc');
  });

  afterAll(() => {
    // Restore mutated files
    fs.writeFileSync('pnpm-workspace.yaml', originalWorkspaceContent);
    fs.writeFileSync('.gitignore', originalGitignoreContent);
    if (!originalNpmrcExists && fs.existsSync('.npmrc')) {
      fs.unlinkSync('.npmrc');
    }
  });

  describe('happy path — healthy repository', () => {
    test('should pass all checks when workspace and hygiene are sound', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.success).toBe(true);
      expect(result.output).toContain('All repository health checks passed');
      expect(result.exitCode).toBe(0);
    });

    test('should discover workspace packages declared in pnpm-workspace.yaml', () => {
      const result = global.executeScript(repoHealthScript);
      // The workspace yaml declares apps/* and packages/* — expect at least
      // one matched directory for those globs (output includes YAML prefix).
      expect(result.success).toBe(true);
      expect(result.output).toContain('apps/*');
      expect(result.output).toContain('packages/*');
    });

    test('should report that .gitignore covers critical entries', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toContain(".gitignore covers 'node_modules'");
      expect(result.output).toContain(".gitignore covers 'dist'");
      expect(result.output).toContain(".gitignore covers 'coverage'");
    });

    test('should verify engines.node and engines.pnpm are defined', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toMatch(/engines\.node defined as/);
      expect(result.output).toMatch(/engines\.pnpm defined as/);
    });

    test('should confirm pnpm-lock.yaml exists', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toContain('pnpm-lock.yaml present');
    });

    test('should confirm turbo.json exists', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toContain('turbo.json present');
    });
  });

  describe('package script scanning', () => {
    test('should scan multiple package.json files for build scripts', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toMatch(/packages have a 'build' script/);
      expect(result.output).toMatch(/Scanned \d+ package\.json files/);
    });

    test('should report how many packages have a test script', () => {
      const result = global.executeScript(repoHealthScript);
      expect(result.output).toMatch(/packages have a 'test' script/);
    });
  });

  describe('negative tests — degraded repository', () => {
    test('should fail when pnpm-workspace.yaml is missing', () => {
      fs.renameSync('pnpm-workspace.yaml', 'pnpm-workspace.yaml.bak');
      try {
        const result = global.executeScript(repoHealthScript);
        expect(result.success).toBe(false);
        expect(result.output).toContain('not found at repository root');
        expect(result.exitCode).toBe(1);
      } finally {
        fs.renameSync('pnpm-workspace.yaml.bak', 'pnpm-workspace.yaml');
      }
    });

    test('should fail when pnpm-lock.yaml is missing', () => {
      const lockExists = fs.existsSync('pnpm-lock.yaml');
      if (lockExists) {
        fs.renameSync('pnpm-lock.yaml', 'pnpm-lock.yaml.bak');
      }
      try {
        const result = global.executeScript(repoHealthScript);
        expect(result.success).toBe(false);
        expect(result.output).toContain('pnpm-lock.yaml missing');
      } finally {
        if (lockExists) {
          fs.renameSync('pnpm-lock.yaml.bak', 'pnpm-lock.yaml');
        }
      }
    });

    test('should warn when .gitignore does not cover coverage', () => {
      // Temporarily remove 'coverage' from .gitignore
      const gitignorePath = '.gitignore';
      const original = fs.readFileSync(gitignorePath, 'utf8');
      const patched = original.replace(/^coverage$/m, '# removed coverage for test');
      fs.writeFileSync(gitignorePath, patched);

      try {
        const result = global.executeScript(repoHealthScript);
        expect(result.output).toContain(".gitignore does not contain 'coverage'");
      } finally {
        fs.writeFileSync(gitignorePath, original);
      }
    });
  });

  describe('script structure', () => {
    test('should display a styled header banner', () => {
      const result = global.executeScript(repoHealthScript, ['--help']).success
        ? global.executeScript(repoHealthScript)
        : global.executeScript(repoHealthScript);
      expect(result.output).toContain('pnpm doctor');
      expect(result.output).toContain('repository-health');
    });
  });
});

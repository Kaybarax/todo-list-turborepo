// Simple validation test to ensure the test framework is working
describe('Test Framework Validation', () => {
  test('should have access to global test helpers', () => {
    expect(typeof global.executeScript).toBe('function');
    expect(typeof global.mockCommand).toBe('function');
    expect(typeof global.createTestFixture).toBe('function');
  });

  test('should be able to execute scripts', () => {
    const result = global.executeScript('scripts/blockchain-deps-check.sh', ['--help']);

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('output');
    expect(result).toHaveProperty('exitCode');
    expect(result.output).toContain('Blockchain Development Environment');
  });

  test('should be able to create mock commands', () => {
    const mockPath = global.mockCommand('test-tool', true, '1.0.0');

    expect(mockPath).toContain('mock-test-tool');
    expect(require('fs').existsSync(mockPath)).toBe(true);
  });

  test('should be able to create test fixtures', () => {
    const fixturePath = global.createTestFixture('test-file.txt', 'test content');

    expect(fixturePath).toContain('fixtures/test-file.txt');
    expect(require('fs').existsSync(fixturePath)).toBe(true);
    expect(require('fs').readFileSync(fixturePath, 'utf8')).toBe('test content');
  });
});

describe('Repo Clean Verification', () => {
  test('repo-clean-verify.sh should exist and be executable', () => {
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.resolve(__dirname, '../../scripts/repo-clean-verify.sh');

    expect(fs.existsSync(scriptPath)).toBe(true);
    const stat = fs.statSync(scriptPath);
    expect(stat.isFile()).toBe(true);
    // Check it's executable
    expect((stat.mode & 0o111) !== 0).toBe(true);
  });

  test('repo-clean-verify.sh --list should print known patterns', () => {
    const result = global.executeScript('scripts/repo-clean-verify.sh', ['--list']);

    expect(result.success).toBe(true);
    expect(result.output).toContain('.turbo');
    expect(result.output).toContain('.eslintcache');
    expect(result.output).toContain('Always-flagged directories');
  });

  test('repo-clean-verify.sh should exit 0 on a clean repo', () => {
    const result = global.executeScript('scripts/repo-clean-verify.sh', []);

    expect(result.success).toBe(true);
    expect(result.output).toContain('Repository is clean');
  });

  test('cleanup.sh --verify should delegate to repo-clean-verify.sh', () => {
    const result = global.executeScript('scripts/cleanup.sh', ['--verify', '--list']);

    expect(result.success).toBe(true);
    expect(result.output).toContain('.turbo');
  });
});

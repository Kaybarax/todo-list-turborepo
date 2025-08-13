const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Global test setup for dependency management tests
beforeAll(() => {
  // Ensure test environment is clean
  process.env.NODE_ENV = 'test';
  process.env.CI = 'true'; // Disable interactive features
  process.env.SKIP_NETWORK_CHECK = 'true'; // Skip network checks in tests

  // Create temporary directories for testing
  const testDirs = ['test/dependency-management/tmp', 'test/dependency-management/fixtures'];

  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

afterAll(() => {
  // Cleanup test artifacts
  const tmpDir = 'test/dependency-management/tmp';
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// Helper function to execute shell scripts in test environment
global.executeScript = (scriptPath, args = [], options = {}) => {
  const defaultOptions = {
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    cwd: options.cwd || process.cwd(),
  };

  try {
    const result = execSync(`bash ${scriptPath} ${args.join(' ')}`, defaultOptions);
    return { success: true, output: result, exitCode: 0 };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || error.message,
      error: error.stderr || error.message,
      exitCode: error.status || 1,
    };
  }
};

// Mock command availability for testing
global.mockCommand = (command, available = true, version = '1.0.0') => {
  const mockScript = `#!/bin/bash
if [ "$1" = "--version" ]; then
  echo "${command} ${version}"
  exit 0
fi
echo "Mock ${command} command"
exit 0`;

  const mockPath = `test/dependency-management/tmp/mock-${command}`;
  fs.writeFileSync(mockPath, mockScript);
  fs.chmodSync(mockPath, '755');

  if (available) {
    process.env.PATH = `${path.dirname(path.resolve(mockPath))}:${process.env.PATH}`;
  }

  return mockPath;
};

// Helper to create test fixtures
global.createTestFixture = (name, content) => {
  const fixturePath = `test/dependency-management/fixtures/${name}`;
  fs.writeFileSync(fixturePath, content);
  return fixturePath;
};

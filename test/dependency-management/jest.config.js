module.exports = {
  displayName: 'Dependency Management Tests',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.js', '<rootDir>/**/*.spec.js'],
  collectCoverageFrom: [
    '../../scripts/blockchain-deps-check.sh',
    '../../scripts/install-blockchain-tools.sh',
    '../../scripts/build-contracts.sh',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  testTimeout: 30000,
  verbose: true,
  bail: false,
  maxWorkers: 4,
};

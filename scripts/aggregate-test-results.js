#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Aggregates test results from multiple test suites
 */
class TestResultsAggregator {
  constructor() {
    this.results = {
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        coverage: {
          lines: 0,
          functions: 0,
          branches: 0,
          statements: 0
        }
      },
      suites: []
    };
  }

  /**
   * Read and parse coverage report
   */
  readCoverageReport(coveragePath) {
    try {
      const coverageFile = path.join(coveragePath, 'coverage-summary.json');
      if (fs.existsSync(coverageFile)) {
        const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
        return {
          lines: coverage.total.lines.pct || 0,
          functions: coverage.total.functions.pct || 0,
          branches: coverage.total.branches.pct || 0,
          statements: coverage.total.statements.pct || 0
        };
      }
    } catch (error) {
      console.warn(`Failed to read coverage report from ${coveragePath}:`, error.message);
    }
    return { lines: 0, functions: 0, branches: 0, statements: 0 };
  }

  /**
   * Read and parse Jest test results
   */
  readJestResults(resultsPath) {
    try {
      const resultsFile = path.join(resultsPath, 'jest-results.json');
      if (fs.existsSync(resultsFile)) {
        const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        return {
          totalTests: results.numTotalTests || 0,
          passedTests: results.numPassedTests || 0,
          failedTests: results.numFailedTests || 0,
          skippedTests: results.numPendingTests || 0
        };
      }
    } catch (error) {
      console.warn(`Failed to read Jest results from ${resultsPath}:`, error.message);
    }
    return { totalTests: 0, passedTests: 0, failedTests: 0, skippedTests: 0 };
  }

  /**
   * Read and parse Playwright test results
   */
  readPlaywrightResults(resultsPath) {
    try {
      const resultsFile = path.join(resultsPath, 'results.json');
      if (fs.existsSync(resultsFile)) {
        const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        const stats = results.stats || {};
        return {
          totalTests: stats.expected || 0,
          passedTests: stats.passed || 0,
          failedTests: stats.failed || 0,
          skippedTests: stats.skipped || 0
        };
      }
    } catch (error) {
      console.warn(`Failed to read Playwright results from ${resultsPath}:`, error.message);
    }
    return { totalTests: 0, passedTests: 0, failedTests: 0, skippedTests: 0 };
  }

  /**
   * Process test suite results
   */
  processSuite(suiteName, coveragePath, resultsPath, type = 'jest') {
    console.log(`Processing ${suiteName} test suite...`);

    const coverage = this.readCoverageReport(coveragePath);
    const testResults = type === 'playwright' 
      ? this.readPlaywrightResults(resultsPath)
      : this.readJestResults(resultsPath);

    const suite = {
      name: suiteName,
      type,
      ...testResults,
      coverage,
      timestamp: new Date().toISOString()
    };

    this.results.suites.push(suite);

    // Update summary
    this.results.summary.totalTests += testResults.totalTests;
    this.results.summary.passedTests += testResults.passedTests;
    this.results.summary.failedTests += testResults.failedTests;
    this.results.summary.skippedTests += testResults.skippedTests;

    console.log(`  Tests: ${testResults.totalTests} total, ${testResults.passedTests} passed, ${testResults.failedTests} failed`);
    console.log(`  Coverage: ${coverage.lines}% lines, ${coverage.functions}% functions`);
  }

  /**
   * Calculate average coverage
   */
  calculateAverageCoverage() {
    const suites = this.results.suites.filter(suite => suite.coverage);
    if (suites.length === 0) return;

    const totals = suites.reduce((acc, suite) => ({
      lines: acc.lines + suite.coverage.lines,
      functions: acc.functions + suite.coverage.functions,
      branches: acc.branches + suite.coverage.branches,
      statements: acc.statements + suite.coverage.statements
    }), { lines: 0, functions: 0, branches: 0, statements: 0 });

    this.results.summary.coverage = {
      lines: Math.round(totals.lines / suites.length),
      functions: Math.round(totals.functions / suites.length),
      branches: Math.round(totals.branches / suites.length),
      statements: Math.round(totals.statements / suites.length)
    };
  }

  /**
   * Generate HTML report
   */
  generateHtmlReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .suite { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .coverage { display: flex; gap: 20px; margin: 10px 0; }
        .coverage-item { text-align: center; }
        .progress-bar { width: 100px; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: #28a745; transition: width 0.3s; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Todo App Test Results</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> ${this.results.summary.totalTests}</p>
        <p><strong>Passed:</strong> <span class="passed">${this.results.summary.passedTests}</span></p>
        <p><strong>Failed:</strong> <span class="failed">${this.results.summary.failedTests}</span></p>
        <p><strong>Skipped:</strong> <span class="skipped">${this.results.summary.skippedTests}</span></p>
        
        <h3>Average Coverage</h3>
        <div class="coverage">
            <div class="coverage-item">
                <div>Lines</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.results.summary.coverage.lines}%"></div>
                </div>
                <div>${this.results.summary.coverage.lines}%</div>
            </div>
            <div class="coverage-item">
                <div>Functions</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.results.summary.coverage.functions}%"></div>
                </div>
                <div>${this.results.summary.coverage.functions}%</div>
            </div>
            <div class="coverage-item">
                <div>Branches</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.results.summary.coverage.branches}%"></div>
                </div>
                <div>${this.results.summary.coverage.branches}%</div>
            </div>
            <div class="coverage-item">
                <div>Statements</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.results.summary.coverage.statements}%"></div>
                </div>
                <div>${this.results.summary.coverage.statements}%</div>
            </div>
        </div>
    </div>

    <h2>Test Suites</h2>
    ${this.results.suites.map(suite => `
        <div class="suite">
            <h3>${suite.name} (${suite.type})</h3>
            <p>
                <span class="passed">${suite.passedTests} passed</span> | 
                <span class="failed">${suite.failedTests} failed</span> | 
                <span class="skipped">${suite.skippedTests} skipped</span> | 
                <strong>${suite.totalTests} total</strong>
            </p>
            <div class="coverage">
                <div class="coverage-item">
                    <div>Lines: ${suite.coverage.lines}%</div>
                </div>
                <div class="coverage-item">
                    <div>Functions: ${suite.coverage.functions}%</div>
                </div>
                <div class="coverage-item">
                    <div>Branches: ${suite.coverage.branches}%</div>
                </div>
                <div class="coverage-item">
                    <div>Statements: ${suite.coverage.statements}%</div>
                </div>
            </div>
        </div>
    `).join('')}

    <h2>Detailed Results</h2>
    <table>
        <thead>
            <tr>
                <th>Suite</th>
                <th>Type</th>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Skipped</th>
                <th>Lines Coverage</th>
                <th>Functions Coverage</th>
            </tr>
        </thead>
        <tbody>
            ${this.results.suites.map(suite => `
                <tr>
                    <td>${suite.name}</td>
                    <td>${suite.type}</td>
                    <td>${suite.totalTests}</td>
                    <td class="passed">${suite.passedTests}</td>
                    <td class="failed">${suite.failedTests}</td>
                    <td class="skipped">${suite.skippedTests}</td>
                    <td>${suite.coverage.lines}%</td>
                    <td>${suite.coverage.functions}%</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <p><em>Generated on ${new Date().toISOString()}</em></p>
</body>
</html>
    `;

    return html;
  }

  /**
   * Run the aggregation process
   */
  async run() {
    console.log('Starting test results aggregation...');

    // Process each test suite
    this.processSuite('API', '/app/coverage/api', '/app/test-results/api');
    this.processSuite('Web', '/app/coverage/web', '/app/test-results/web');
    this.processSuite('Mobile', '/app/coverage/mobile', '/app/test-results/mobile');
    this.processSuite('Ingestion', '/app/coverage/ingestion', '/app/test-results/ingestion');
    this.processSuite('Contracts', '/app/coverage/contracts', '/app/test-results/contracts');
    this.processSuite('Integration', '/app/coverage/integration', '/app/test-results/integration');
    this.processSuite('E2E', '/app/test-results/e2e', '/app/test-results/e2e', 'playwright');

    // Calculate averages
    this.calculateAverageCoverage();

    // Save JSON results
    const resultsDir = '/app/test-results';
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(resultsDir, 'aggregated-results.json'),
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHtmlReport();
    fs.writeFileSync(path.join(resultsDir, 'test-report.html'), htmlReport);

    // Print summary
    console.log('\n=== Test Results Summary ===');
    console.log(`Total Tests: ${this.results.summary.totalTests}`);
    console.log(`Passed: ${this.results.summary.passedTests}`);
    console.log(`Failed: ${this.results.summary.failedTests}`);
    console.log(`Skipped: ${this.results.summary.skippedTests}`);
    console.log(`Success Rate: ${Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100)}%`);
    console.log(`Average Coverage: ${this.results.summary.coverage.lines}% lines, ${this.results.summary.coverage.functions}% functions`);
    console.log('\nReports generated:');
    console.log(`- JSON: ${path.join(resultsDir, 'aggregated-results.json')}`);
    console.log(`- HTML: ${path.join(resultsDir, 'test-report.html')}`);

    // Exit with appropriate code
    const exitCode = this.results.summary.failedTests > 0 ? 1 : 0;
    process.exit(exitCode);
  }
}

// Run the aggregator
const aggregator = new TestResultsAggregator();
aggregator.run().catch(error => {
  console.error('Failed to aggregate test results:', error);
  process.exit(1);
});
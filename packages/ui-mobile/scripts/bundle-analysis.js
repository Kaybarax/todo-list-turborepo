#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Bundle Analysis Script for Eva Design Integration
 * Analyzes bundle size impact and provides optimization recommendations
 */

const BUNDLE_SIZE_LIMITS = {
  'eva-design': 150, // KB
  'ui-kitten': 200, // KB
  'style-dictionary': 50, // KB
  'total-eva-deps': 400, // KB
};

function analyzePackageSize(packageName) {
  try {
    const packagePath = path.join(process.cwd(), 'node_modules', packageName);
    if (!fs.existsSync(packagePath)) {
      console.log(`⚠️  Package ${packageName} not found`);
      return 0;
    }

    // Get package size using du command
    const sizeOutput = execSync(`du -sk ${packagePath}`, { encoding: 'utf8' });
    const sizeKB = parseInt(sizeOutput.split('\t')[0]);

    return sizeKB;
  } catch (error) {
    console.error(`Error analyzing ${packageName}:`, error.message);
    return 0;
  }
}

function analyzeEvaDesignImpact() {
  console.log('🔍 Analyzing Eva Design Bundle Impact...\n');

  const packages = {
    '@eva-design/eva': analyzePackageSize('@eva-design/eva'),
    '@ui-kitten/components': analyzePackageSize('@ui-kitten/components'),
    'style-dictionary': analyzePackageSize('style-dictionary'),
    'react-native-svg': analyzePackageSize('react-native-svg'),
  };

  const totalSize = Object.values(packages).reduce((sum, size) => sum + size, 0);

  console.log('📦 Package Sizes:');
  Object.entries(packages).forEach(([pkg, size]) => {
    const status = size > 0 ? '✅' : '❌';
    console.log(`  ${status} ${pkg}: ${size} KB`);
  });

  console.log(`\n📊 Total Eva Design Dependencies: ${totalSize} KB`);

  // Check against limits
  const isWithinLimits = totalSize <= BUNDLE_SIZE_LIMITS['total-eva-deps'];
  console.log(`🎯 Bundle Size Target: ${BUNDLE_SIZE_LIMITS['total-eva-deps']} KB`);
  console.log(`${isWithinLimits ? '✅' : '❌'} Status: ${isWithinLimits ? 'Within limits' : 'Exceeds limits'}`);

  return { packages, totalSize, isWithinLimits };
}

function analyzeTreeShaking() {
  console.log('\n🌳 Tree Shaking Analysis...');

  const recommendations = [];

  // Check for barrel exports usage
  const srcFiles = execSync('find lib -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' }).split('\n').filter(Boolean);

  let barrelImports = 0;
  let directImports = 0;

  srcFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');

      // Check for barrel imports
      if (content.includes("from '@ui-kitten/components'")) {
        barrelImports++;
      }

      // Check for direct imports
      if (content.includes("from '@ui-kitten/components/")) {
        directImports++;
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });

  console.log(`  📁 Barrel imports: ${barrelImports}`);
  console.log(`  🎯 Direct imports: ${directImports}`);

  if (barrelImports > directImports) {
    recommendations.push('Consider using direct imports from @ui-kitten/components for better tree shaking');
  }

  return { barrelImports, directImports, recommendations };
}

function analyzeStyleDictionary() {
  console.log('\n🎨 Style Dictionary Analysis...');

  const tokenFiles = ['lib/theme/tokens/eva-tokens.ts', 'lib/theme/tokens/eva-tokens.json'];

  const analysis = {
    tokenFiles: [],
    totalTokens: 0,
    fileSize: 0,
  };

  tokenFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);

      analysis.tokenFiles.push({
        file,
        size: sizeKB,
        exists: true,
      });

      analysis.fileSize += sizeKB;

      // Count tokens in TypeScript file
      if (file.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const tokenMatches = content.match(/['"][^'"]+['"]:\s*['"][^'"]*['"]/g);
          analysis.totalTokens = tokenMatches ? tokenMatches.length : 0;
        } catch (error) {
          console.warn(`Could not analyze tokens in ${file}`);
        }
      }
    } else {
      analysis.tokenFiles.push({
        file,
        size: 0,
        exists: false,
      });
    }
  });

  console.log('  📄 Token Files:');
  analysis.tokenFiles.forEach(({ file, size, exists }) => {
    const status = exists ? '✅' : '❌';
    console.log(`    ${status} ${file}: ${size} KB`);
  });

  console.log(`  🔢 Total Tokens: ${analysis.totalTokens}`);
  console.log(`  📊 Total Token File Size: ${analysis.fileSize} KB`);

  return analysis;
}

function generateOptimizationReport(bundleAnalysis, treeShakingAnalysis, styleDictionaryAnalysis) {
  console.log('\n📋 Optimization Recommendations:');

  const recommendations = [...treeShakingAnalysis.recommendations];

  // Bundle size recommendations
  if (!bundleAnalysis.isWithinLimits) {
    recommendations.push('Consider lazy loading Eva Design components');
    recommendations.push('Implement code splitting for Eva Design features');
  }

  // Style Dictionary recommendations
  if (styleDictionaryAnalysis.fileSize > 20) {
    recommendations.push('Consider splitting token files by category');
    recommendations.push('Implement token tree shaking for unused tokens');
  }

  // Performance recommendations
  recommendations.push('Use React.memo for components with complex Eva Design styling');
  recommendations.push('Implement theme caching to avoid repeated calculations');
  recommendations.push("Consider using Eva Design's built-in performance optimizations");

  if (recommendations.length === 0) {
    console.log('  ✅ No optimization recommendations - bundle is well optimized!');
  } else {
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  return recommendations;
}

function generateReport() {
  console.log('🚀 Eva Design Bundle Analysis Report');
  console.log('=====================================\n');

  const bundleAnalysis = analyzeEvaDesignImpact();
  const treeShakingAnalysis = analyzeTreeShaking();
  const styleDictionaryAnalysis = analyzeStyleDictionary();

  const recommendations = generateOptimizationReport(bundleAnalysis, treeShakingAnalysis, styleDictionaryAnalysis);

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    bundleAnalysis,
    treeShakingAnalysis,
    styleDictionaryAnalysis,
    recommendations,
    summary: {
      totalSize: bundleAnalysis.totalSize,
      withinLimits: bundleAnalysis.isWithinLimits,
      optimizationScore: recommendations.length === 0 ? 100 : Math.max(0, 100 - recommendations.length * 10),
    },
  };

  const reportPath = path.join(process.cwd(), 'bundle-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  console.log(`🎯 Optimization Score: ${report.summary.optimizationScore}/100`);
}

// Run analysis if called directly
if (require.main === module) {
  generateReport();
}

module.exports = {
  analyzeEvaDesignImpact,
  analyzeTreeShaking,
  analyzeStyleDictionary,
  generateOptimizationReport,
};

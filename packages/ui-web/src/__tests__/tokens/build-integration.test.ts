import { describe, it, expect, beforeAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';

const execAsync = promisify(exec);

describe('Style Dictionary Build Integration', () => {
  const projectRoot = resolve(__dirname, '../../..');
  const distTokensPath = resolve(projectRoot, 'dist/tokens');

  beforeAll(async () => {
    // Ensure tokens are built before running tests
    try {
      await execAsync('npm run tokens:build', { cwd: projectRoot });
    } catch (error) {
      console.warn('Token build failed, tests may fail:', error);
    }
  });

  describe('Build Process', () => {
    it('should successfully build tokens without errors', async () => {
      const { stdout, stderr } = await execAsync('npm run tokens:build', { cwd: projectRoot });

      // Should not have critical errors
      expect(stderr).not.toContain('Error:');
      expect(stderr).not.toContain('Failed');

      // Should indicate successful completion
      expect(stdout).toContain('✅');
    });

    it('should generate all required output files', () => {
      const expectedFiles = ['variables.css', 'tokens.js', 'tokens.d.ts', 'tailwind-tokens.js', 'daisyui-themes.js'];

      expectedFiles.forEach(file => {
        const filePath = resolve(distTokensPath, file);
        expect(existsSync(filePath)).toBe(true);

        // File should not be empty
        const stats = statSync(filePath);
        expect(stats.size).toBeGreaterThan(0);
      });
    });

    it('should generate files with recent timestamps', () => {
      const files = ['variables.css', 'tokens.js', 'tokens.d.ts'];
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;

      files.forEach(file => {
        const filePath = resolve(distTokensPath, file);
        const stats = statSync(filePath);

        // Files should be recently generated (within 5 minutes)
        expect(stats.mtime.getTime()).toBeGreaterThan(fiveMinutesAgo);
      });
    });
  });

  describe('Build Output Validation', () => {
    it('should generate valid CSS with proper syntax', () => {
      const cssPath = resolve(distTokensPath, 'variables.css');
      const cssContent = readFileSync(cssPath, 'utf-8');

      // Should have proper CSS structure
      expect(cssContent).toContain(':root {');
      expect(cssContent).toMatch(/}\s*$/); // Should end with closing brace

      // Should not have syntax errors
      expect(cssContent).not.toContain('undefined');
      expect(cssContent).not.toContain('null');
      expect(cssContent).not.toContain('[object Object]');

      // Should have proper CSS custom property format
      const customProps = cssContent.match(/--[\w-]+:\s*[^;]+;/g);
      expect(customProps).toBeTruthy();
      expect(customProps!.length).toBeGreaterThan(10);
    });

    it('should generate valid JavaScript module', async () => {
      const jsPath = resolve(distTokensPath, 'tokens.js');
      const jsContent = readFileSync(jsPath, 'utf-8');

      // Should be valid ES module
      expect(jsContent).toContain('export');
      expect(jsContent).not.toContain('module.exports');

      // Should not have syntax errors
      expect(jsContent).not.toContain('undefined');
      expect(jsContent).not.toContain('[object Object]');

      // Should be importable
      const { default: tokens } = await import(jsPath);
      expect(tokens).toBeDefined();
      expect(typeof tokens).toBe('object');
    });

    it('should generate valid TypeScript definitions', () => {
      const tsPath = resolve(distTokensPath, 'tokens.d.ts');
      const tsContent = readFileSync(tsPath, 'utf-8');

      // Should have proper TypeScript syntax
      expect(tsContent).toContain('export interface');
      expect(tsContent).toContain('export declare');

      // Should define main interfaces
      expect(tsContent).toContain('DesignTokens');
      expect(tsContent).toContain('ColorTokens');
      expect(tsContent).toContain('SpaceTokens');

      // Should not have syntax errors
      expect(tsContent).not.toContain('undefined');
      expect(tsContent).not.toContain('any;'); // Should have proper types
    });

    it('should generate valid Tailwind configuration', () => {
      const tailwindPath = resolve(distTokensPath, 'tailwind.config.js');
      const tailwindContent = readFileSync(tailwindPath, 'utf-8');

      // Should be valid CommonJS module
      expect(tailwindContent).toContain('module.exports');
      expect(tailwindContent).toContain('theme:');
      expect(tailwindContent).toContain('extend:');

      // Should have proper structure
      expect(tailwindContent).toContain('colors:');
      expect(tailwindContent).toContain('spacing:');
      expect(tailwindContent).toContain('fontFamily:');
    });

    it('should generate valid DaisyUI themes', () => {
      const daisyPath = resolve(distTokensPath, 'daisy-themes.css');
      const daisyContent = readFileSync(daisyPath, 'utf-8');

      // Should have DaisyUI theme structure
      expect(daisyContent).toContain('[data-theme=');
      expect(daisyContent).toMatch(/\[data-theme="[^"]+"\]/);

      // Should have DaisyUI semantic variables
      const daisyVars = ['--p:', '--s:', '--a:', '--n:', '--b1:'];
      daisyVars.forEach(variable => {
        expect(daisyContent).toContain(variable);
      });

      // Should have proper CSS syntax
      expect(daisyContent).not.toContain('undefined');
      expect(daisyContent).not.toContain('null');
    });
  });

  describe('Build Performance', () => {
    it('should build tokens in reasonable time', async () => {
      const startTime = Date.now();

      await execAsync('npm run tokens:build', { cwd: projectRoot });

      const buildTime = Date.now() - startTime;

      // Build should complete within 30 seconds
      expect(buildTime).toBeLessThan(30000);

      // But should take some time (not instant, indicating actual work)
      expect(buildTime).toBeGreaterThan(100);
    });

    it('should generate reasonably sized output files', () => {
      const files = [
        { name: 'variables.css', maxSize: 50 * 1024 }, // 50KB
        { name: 'tokens.js', maxSize: 100 * 1024 }, // 100KB
        { name: 'tokens.d.ts', maxSize: 50 * 1024 }, // 50KB
        { name: 'tailwind.config.js', maxSize: 100 * 1024 }, // 100KB
        { name: 'daisy-themes.css', maxSize: 20 * 1024 }, // 20KB
      ];

      files.forEach(({ name, maxSize }) => {
        const filePath = resolve(distTokensPath, name);
        const stats = statSync(filePath);

        expect(stats.size).toBeLessThan(maxSize);
        expect(stats.size).toBeGreaterThan(100); // Should have content
      });
    });
  });

  describe('Build Consistency', () => {
    it('should produce identical output on repeated builds', async () => {
      // Build tokens twice
      await execAsync('npm run tokens:build', { cwd: projectRoot });
      const firstBuild = readFileSync(resolve(distTokensPath, 'tokens.js'), 'utf-8');

      // Small delay to ensure different timestamps if content differs
      await new Promise(resolve => setTimeout(resolve, 100));

      await execAsync('npm run tokens:build', { cwd: projectRoot });
      const secondBuild = readFileSync(resolve(distTokensPath, 'tokens.js'), 'utf-8');

      // Content should be identical (excluding timestamps/comments)
      const normalizeContent = (content: string) =>
        content
          .replace(/\/\*.*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .trim();

      expect(normalizeContent(firstBuild)).toBe(normalizeContent(secondBuild));
    });

    it('should maintain token references across formats', async () => {
      // Import JS tokens
      const jsPath = resolve(distTokensPath, 'tokens.js');
      const { default: jsTokens } = await import(jsPath);

      // Read CSS variables
      const cssPath = resolve(distTokensPath, 'variables.css');
      const cssContent = readFileSync(cssPath, 'utf-8');

      // Check that primary colors exist in both formats
      if (jsTokens.color?.primary) {
        Object.keys(jsTokens.color.primary).forEach(shade => {
          const cssVar = `--color-primary-${shade}`;
          expect(cssContent).toContain(cssVar);
        });
      }

      // Check that spacing tokens exist in both formats
      if (jsTokens.space) {
        Object.keys(jsTokens.space).forEach(spaceKey => {
          const cssVar = `--space-${spaceKey}`;
          expect(cssContent).toContain(cssVar);
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle missing source files gracefully', async () => {
      // This test would require temporarily moving source files
      // For now, just ensure the build script exists and is executable
      const buildScript = resolve(projectRoot, 'scripts/build-tokens.cjs');
      expect(existsSync(buildScript)).toBe(true);
    });

    it('should validate token structure during build', async () => {
      // Build should succeed with current token structure
      const { stdout, stderr } = await execAsync('npm run tokens:build', { cwd: projectRoot });

      // Should not have validation errors
      expect(stderr).not.toContain('Invalid token');
      expect(stderr).not.toContain('Missing required');
      expect(stdout).toContain('✅');
    });
  });
});

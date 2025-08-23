/**
 * Tests for the main package index exports
 * Ensures all exports are properly configured and accessible
 */

import * as utils from '../index';

describe('@todo/utils main exports', () => {
  describe('category-based exports', () => {
    it('should export all utility categories', () => {
      expect(utils.common).toBeDefined();
      expect(utils.blockchain).toBeDefined();
      expect(utils.ui).toBeDefined();
      expect(utils.testing).toBeDefined();
      expect(utils.api).toBeDefined();
      expect(utils.logging).toBeDefined();
    });

    it('should have common utilities in common category', () => {
      expect(utils.common.getEnvVar).toBeDefined();
      expect(utils.common.isDefined).toBeDefined();
      expect(utils.common.isString).toBeDefined();
    });

    it('should have blockchain utilities in blockchain category', () => {
      expect(utils.blockchain.BlockchainError).toBeDefined();
      expect(utils.blockchain.TransactionMonitor).toBeDefined();
    });

    it('should have UI utilities in ui category', () => {
      expect(utils.ui.web).toBeDefined();
      expect(utils.ui.mobile).toBeDefined();
    });

    it('should have testing utilities in testing category', () => {
      expect(utils.testing.mobile).toBeDefined();
      expect(utils.testing.api).toBeDefined();
    });

    it('should have logging utilities in logging category', () => {
      expect(utils.logging.createLogger).toBeDefined();
      expect(utils.logging.logger).toBeDefined();
    });
  });

  describe('named exports for common utilities', () => {
    it('should export common environment utilities', () => {
      expect(utils.getEnvVar).toBeDefined();
      expect(utils.requireEnvVar).toBeDefined();
      expect(utils.isDevelopment).toBeDefined();
      expect(utils.isProduction).toBeDefined();
      expect(utils.isTest).toBeDefined();
    });

    it('should export common type guard utilities', () => {
      expect(utils.isDefined).toBeDefined();
      expect(utils.isString).toBeDefined();
      expect(utils.isNumber).toBeDefined();
      expect(utils.isBoolean).toBeDefined();
      expect(utils.assertNever).toBeDefined();
      expect(utils.invariant).toBeDefined();
    });

    it('should export blockchain utilities', () => {
      expect(utils.BlockchainError).toBeDefined();
      expect(utils.TransactionMonitor).toBeDefined();
      expect(utils.BlockchainErrorType).toBeDefined();
      expect(utils.BlockchainNetwork).toBeDefined();
    });

    it('should export UI utilities', () => {
      expect(utils.cn).toBeDefined();
      expect(utils.ariaAttr).toBeDefined();
      expect(utils.mergeRefs).toBeDefined();
      expect(utils.mqUp).toBeDefined();
      expect(utils.getToken).toBeDefined();
    });

    it('should export logging utilities', () => {
      expect(utils.createLogger).toBeDefined();
      expect(utils.createApiLogger).toBeDefined();
      expect(utils.logger).toBeDefined();
    });

    it('should export testing utilities', () => {
      expect(utils.mobileRender).toBeDefined();
      expect(utils.createMockTodo).toBeDefined();
      expect(utils.apiTodoToTodo).toBeDefined();
    });
  });

  describe('metadata exports', () => {
    it('should export migration mapping', () => {
      expect(utils.MIGRATION_MAPPING).toBeDefined();
      expect(typeof utils.MIGRATION_MAPPING).toBe('object');

      // Check some key migration paths
      expect(utils.MIGRATION_MAPPING['packages/services/src/utils/env.ts']).toBe('@todo/utils/common/env');
      expect(utils.MIGRATION_MAPPING['packages/ui-web/src/utils/']).toBe('@todo/utils/ui/web/');
    });

    it('should export package info', () => {
      expect(utils.PACKAGE_INFO).toBeDefined();
      expect(utils.PACKAGE_INFO.name).toBe('@todo/utils');
      expect(utils.PACKAGE_INFO.version).toBeDefined();
      expect(utils.PACKAGE_INFO.categories).toEqual(['common', 'blockchain', 'ui', 'testing', 'api', 'logging']);
    });

    it('should export version', () => {
      expect(utils.VERSION).toBeDefined();
      expect(typeof utils.VERSION).toBe('string');
    });
  });

  describe('import patterns', () => {
    it('should support category-based imports', () => {
      const { common, blockchain, ui } = utils;

      expect(common.getEnvVar).toBeDefined();
      expect(blockchain.BlockchainError).toBeDefined();
      expect(ui.web.cn).toBeDefined();
    });

    it('should support named imports', () => {
      const { getEnvVar, BlockchainError, cn } = utils;

      expect(getEnvVar).toBeDefined();
      expect(BlockchainError).toBeDefined();
      expect(cn).toBeDefined();
    });

    it('should maintain function identity between import patterns', () => {
      // Same function should be identical whether imported via category or named export
      expect(utils.getEnvVar).toBe(utils.common.getEnvVar);
      expect(utils.BlockchainError).toBe(utils.blockchain.BlockchainError);
      expect(utils.cn).toBe(utils.ui.web.cn);
    });
  });

  describe('tree-shaking support', () => {
    it('should have proper ESM exports structure', () => {
      // Check that exports are properly structured for tree-shaking
      expect(typeof utils.common).toBe('object');
      expect(typeof utils.blockchain).toBe('object');
      expect(typeof utils.ui).toBe('object');

      // Functions should be directly accessible
      expect(typeof utils.getEnvVar).toBe('function');
      expect(typeof utils.isDefined).toBe('function');
      expect(typeof utils.cn).toBe('function');
    });
  });

  describe('TypeScript support', () => {
    it('should export utility categories interface', () => {
      // This is mainly a compile-time check, but we can verify the structure exists
      expect(utils.PACKAGE_INFO.categories).toContain('common');
      expect(utils.PACKAGE_INFO.categories).toContain('blockchain');
      expect(utils.PACKAGE_INFO.categories).toContain('ui');
    });
  });
});

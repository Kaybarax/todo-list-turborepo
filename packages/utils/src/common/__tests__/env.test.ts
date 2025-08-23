import {
  getEnvVar,
  requireEnvVar,
  getEnvVarAsBoolean,
  getEnvVarAsNumber,
  isDevelopment,
  isProduction,
  isTest,
} from '../env';

// Mock globalThis.process.env
const mockProcessEnv = (env: Record<string, string | undefined>) => {
  const originalProcess = (globalThis as any).process;
  (globalThis as any).process = { env };
  return () => {
    if (originalProcess) {
      (globalThis as any).process = originalProcess;
    } else {
      delete (globalThis as any).process;
    }
  };
};

describe('Environment Utilities', () => {
  describe('getEnvVar', () => {
    it('should return environment variable value when it exists', () => {
      const cleanup = mockProcessEnv({ TEST_VAR: 'test-value' });

      expect(getEnvVar('TEST_VAR')).toBe('test-value');

      cleanup();
    });

    it('should return default value when environment variable does not exist', () => {
      const cleanup = mockProcessEnv({});

      expect(getEnvVar('NON_EXISTENT_VAR', 'default')).toBe('default');

      cleanup();
    });

    it('should return empty string as default when no default provided', () => {
      const cleanup = mockProcessEnv({});

      expect(getEnvVar('NON_EXISTENT_VAR')).toBe('');

      cleanup();
    });

    it('should handle browser environment gracefully', () => {
      const originalProcess = (globalThis as any).process;
      delete (globalThis as any).process;

      expect(getEnvVar('ANY_VAR', 'browser-default')).toBe('browser-default');

      if (originalProcess) {
        (globalThis as any).process = originalProcess;
      }
    });

    it('should handle undefined process.env gracefully', () => {
      const cleanup = mockProcessEnv({});

      expect(getEnvVar('ANY_VAR', 'fallback-default')).toBe('fallback-default');

      cleanup();
    });
  });

  describe('requireEnvVar', () => {
    it('should return environment variable value when it exists', () => {
      const cleanup = mockProcessEnv({ REQUIRED_VAR: 'required-value' });

      expect(requireEnvVar('REQUIRED_VAR')).toBe('required-value');

      cleanup();
    });

    it('should throw error when environment variable does not exist', () => {
      const cleanup = mockProcessEnv({});

      expect(() => requireEnvVar('MISSING_VAR')).toThrow('Required environment variable MISSING_VAR is not set');

      cleanup();
    });

    it('should throw error when environment variable is empty string', () => {
      const cleanup = mockProcessEnv({ EMPTY_VAR: '' });

      expect(() => requireEnvVar('EMPTY_VAR')).toThrow('Required environment variable EMPTY_VAR is not set');

      cleanup();
    });
  });

  describe('getEnvVarAsBoolean', () => {
    it('should return true for "true" value', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: 'true' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);

      cleanup();
    });

    it('should return true for "1" value', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: '1' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);

      cleanup();
    });

    it('should return true for "yes" value', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: 'yes' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);

      cleanup();
    });

    it('should return true for "TRUE" value (case insensitive)', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: 'TRUE' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);

      cleanup();
    });

    it('should return false for "false" value', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: 'false' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(false);

      cleanup();
    });

    it('should return false for "0" value', () => {
      const cleanup = mockProcessEnv({ BOOL_VAR: '0' });

      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(false);

      cleanup();
    });

    it('should return default value when variable does not exist', () => {
      const cleanup = mockProcessEnv({});

      expect(getEnvVarAsBoolean('NON_EXISTENT', true)).toBe(true);
      expect(getEnvVarAsBoolean('NON_EXISTENT', false)).toBe(false);
      expect(getEnvVarAsBoolean('NON_EXISTENT')).toBe(false);

      cleanup();
    });
  });

  describe('getEnvVarAsNumber', () => {
    it('should return number value when valid number string', () => {
      const cleanup = mockProcessEnv({ NUM_VAR: '42' });

      expect(getEnvVarAsNumber('NUM_VAR')).toBe(42);

      cleanup();
    });

    it('should return float value when valid float string', () => {
      const cleanup = mockProcessEnv({ NUM_VAR: '3.14' });

      expect(getEnvVarAsNumber('NUM_VAR')).toBe(3.14);

      cleanup();
    });

    it('should return default value when invalid number string', () => {
      const cleanup = mockProcessEnv({ NUM_VAR: 'not-a-number' });

      expect(getEnvVarAsNumber('NUM_VAR', 100)).toBe(100);

      cleanup();
    });

    it('should return default value when variable does not exist', () => {
      const cleanup = mockProcessEnv({});

      expect(getEnvVarAsNumber('NON_EXISTENT', 50)).toBe(50);
      expect(getEnvVarAsNumber('NON_EXISTENT')).toBe(0);

      cleanup();
    });

    it('should handle negative numbers', () => {
      const cleanup = mockProcessEnv({ NUM_VAR: '-25' });

      expect(getEnvVarAsNumber('NUM_VAR')).toBe(-25);

      cleanup();
    });
  });

  describe('Environment detection functions', () => {
    describe('isDevelopment', () => {
      it('should return true when NODE_ENV is development', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'development' });

        expect(isDevelopment()).toBe(true);

        cleanup();
      });

      it('should return false when NODE_ENV is not development', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'production' });

        expect(isDevelopment()).toBe(false);

        cleanup();
      });

      it('should return false when NODE_ENV is not set', () => {
        const cleanup = mockProcessEnv({});

        expect(isDevelopment()).toBe(false);

        cleanup();
      });
    });

    describe('isProduction', () => {
      it('should return true when NODE_ENV is production', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'production' });

        expect(isProduction()).toBe(true);

        cleanup();
      });

      it('should return false when NODE_ENV is not production', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'development' });

        expect(isProduction()).toBe(false);

        cleanup();
      });
    });

    describe('isTest', () => {
      it('should return true when NODE_ENV is test', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'test' });

        expect(isTest()).toBe(true);

        cleanup();
      });

      it('should return false when NODE_ENV is not test', () => {
        const cleanup = mockProcessEnv({ NODE_ENV: 'development' });

        expect(isTest()).toBe(false);

        cleanup();
      });
    });
  });
});

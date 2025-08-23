import { describe, it, expect } from 'vitest';

import * as utils from '../index';

describe('@todo/utils', () => {
  it('should export all utility categories', () => {
    expect(utils).toHaveProperty('common');
    expect(utils).toHaveProperty('blockchain');
    expect(utils).toHaveProperty('ui');
    expect(utils).toHaveProperty('testing');
    expect(utils).toHaveProperty('api');
    expect(utils).toHaveProperty('logging');
  });

  it('should have proper module structure', () => {
    expect(typeof utils.common).toBe('object');
    expect(typeof utils.blockchain).toBe('object');
    expect(typeof utils.ui).toBe('object');
    expect(typeof utils.testing).toBe('object');
    expect(typeof utils.api).toBe('object');
    expect(typeof utils.logging).toBe('object');
  });
});

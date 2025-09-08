import { getShadow, shadowMd } from '../lib/utils/shadows';

describe('shadows util (P1-3)', () => {
  it('returns a cloned style object for a given elevation', () => {
    const a = getShadow('md');
    const b = getShadow('md');
    expect(a).not.toBe(b);
    expect(a.shadowOpacity).toBeDefined();
  });

  it('overrides color when provided', () => {
    const s = getShadow('sm', '#123456');
    expect(s.shadowColor).toBe('#123456');
  });

  it('exports convenience helper', () => {
    const s = shadowMd();
    expect(s.elevation).toBeGreaterThan(0);
  });
});

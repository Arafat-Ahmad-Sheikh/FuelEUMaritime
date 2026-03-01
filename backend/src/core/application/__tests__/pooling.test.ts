import { describe, it, expect } from 'vitest';
import { createPool } from '../pooling';

describe('createPool', () => {
  it('distributes surplus to deficits', () => {
    const members = [
      { shipId: 'A', cb_before: 100 },
      { shipId: 'B', cb_before: -60 },
      { shipId: 'C', cb_before: -30 }
    ];
    const res = createPool(members as any);
    const totalBefore = members.reduce((s, m) => s + m.cb_before, 0);
    const totalAfter = res.reduce((s, m) => s + (m.cb_after || 0), 0);
    expect(totalBefore).toBeCloseTo(totalAfter);
    // deficits should be reduced
    const b = res.find(r => r.shipId === 'B')!;
    const c = res.find(r => r.shipId === 'C')!;
    expect(b.cb_after!).toBeGreaterThan(-60);
    expect(c.cb_after!).toBeGreaterThan(-30);
    // surplus should be non-negative
    const a = res.find(r => r.shipId === 'A')!;
    expect(a.cb_after!).toBeGreaterThanOrEqual(0);
  });

  it('throws if total < 0', () => {
    const members = [
      { shipId: 'A', cb_before: -10 },
      { shipId: 'B', cb_before: -5 }
    ];
    expect(() => createPool(members as any)).toThrow();
  });
});

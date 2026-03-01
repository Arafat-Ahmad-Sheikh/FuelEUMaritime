import { describe, it, expect } from 'vitest';
import { computeCB, energyInScope, TARGET_INTENSITY } from '../computeCB';

describe('computeCB', () => {
  it('computes energyInScope correctly', () => {
    expect(energyInScope(1)).toBe(41000);
    expect(energyInScope(10)).toBe(410000);
  });

  it('computes CB positive when actual < target', () => {
    const route: any = { fuelConsumption: 100, ghgIntensity: TARGET_INTENSITY - 1 };
    const cb = computeCB(route);
    expect(cb).toBeGreaterThan(0);
  });

  it('computes CB negative when actual > target', () => {
    const route: any = { fuelConsumption: 100, ghgIntensity: TARGET_INTENSITY + 5 };
    const cb = computeCB(route);
    expect(cb).toBeLessThan(0);
  });
});

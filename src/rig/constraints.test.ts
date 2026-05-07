import { describe, expect, it } from 'vitest';
import { clampRotation, CONSTRAINTS } from './constraints';
import { BONE_IDS } from './types';

describe('CONSTRAINTS', () => {
  it('has an entry for every BoneId with min <= max on each axis', () => {
    for (const id of BONE_IDS) {
      const c = CONSTRAINTS[id];
      expect(c).toBeDefined();
      expect(c.x.min).toBeLessThanOrEqual(c.x.max);
      expect(c.y.min).toBeLessThanOrEqual(c.y.max);
      expect(c.z.min).toBeLessThanOrEqual(c.z.max);
    }
  });
});

describe('clampRotation', () => {
  it('passes values inside the range through unchanged', () => {
    const result = clampRotation('head', [0.1, 0.1, 0.1]);
    expect(result).toEqual([0.1, 0.1, 0.1]);
  });

  it('clamps an over-rotation to the max', () => {
    const huge: [number, number, number] = [10, 10, 10];
    const r = clampRotation('head', huge);
    const c = CONSTRAINTS.head;
    expect(r[0]).toBe(c.x.max);
    expect(r[1]).toBe(c.y.max);
    expect(r[2]).toBe(c.z.max);
  });

  it('clamps an under-rotation to the min', () => {
    const r = clampRotation('shin_L', [-99, 0, 0]);
    expect(r[0]).toBe(CONSTRAINTS.shin_L.x.min);
  });

  it('respects asymmetric ranges (knee can flex but not hyperextend)', () => {
    const flex = clampRotation('shin_L', [-2, 0, 0]); // flex into legal zone
    expect(flex[0]).toBe(-2);
    const hyper = clampRotation('shin_L', [1.0, 0, 0]); // hyperextend, clamped
    expect(hyper[0]).toBe(CONSTRAINTS.shin_L.x.max);
  });

  it('snout is severely restricted', () => {
    const r = clampRotation('snout', [1, 1, 1]);
    expect(Math.abs(r[0])).toBeLessThan(0.1);
  });
});

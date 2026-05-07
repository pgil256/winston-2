import { describe, expect, it } from 'vitest';
import { BONE_ROLES, SABLE_PALETTE, getBoneColor } from './palette';
import { BONE_IDS } from '../rig/types';

describe('palette', () => {
  it('has a role entry for every BoneId', () => {
    for (const id of BONE_IDS) {
      expect(BONE_ROLES).toHaveProperty(id);
    }
  });

  it('returns the palette colour for a known role', () => {
    expect(getBoneColor('snout')).toBe(SABLE_PALETTE.darkBrown);
    expect(getBoneColor('pelvis')).toBe(SABLE_PALETTE.cream);
    expect(getBoneColor('spine_upper')).toBe(SABLE_PALETTE.lightBrown);
  });

  it('falls back to a placeholder colour for null roles (root)', () => {
    expect(getBoneColor('root')).toMatch(/^#/);
  });

  it('accepts a custom palette', () => {
    const alt = { ...SABLE_PALETTE, lightBrown: '#abcdef' };
    expect(getBoneColor('spine_upper', alt)).toBe('#abcdef');
  });
});

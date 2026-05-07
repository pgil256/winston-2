import { describe, expect, it } from 'vitest';
import { ALL_SLOTS, SLOT_ANCHORS, getSlotForBone } from './anchors';
import { BONE_IDS } from '../rig/types';
import { SKELETON } from '../rig/skeleton';

describe('accessory anchors', () => {
  it('every anchor bone exists in the skeleton', () => {
    for (const slot of ALL_SLOTS) {
      for (const bone of SLOT_ANCHORS[slot]) {
        expect(SKELETON[bone]).toBeDefined();
      }
    }
  });

  it('feet slot binds to all four limb tips', () => {
    expect(SLOT_ANCHORS.feet).toEqual(
      expect.arrayContaining(['paw_L', 'paw_R', 'foot_L', 'foot_R']),
    );
  });

  it('reverse lookup is consistent with the forward map', () => {
    for (const slot of ALL_SLOTS) {
      for (const bone of SLOT_ANCHORS[slot]) {
        expect(getSlotForBone(bone)).toBe(slot);
      }
    }
  });

  it('non-anchor bones return null', () => {
    const anchored = new Set<string>();
    for (const slot of ALL_SLOTS) for (const b of SLOT_ANCHORS[slot]) anchored.add(b);
    for (const id of BONE_IDS) {
      if (!anchored.has(id)) {
        expect(getSlotForBone(id)).toBeNull();
      }
    }
  });
});

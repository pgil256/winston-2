import { describe, expect, it } from 'vitest';
import {
  WARDROBE_SLOTS,
  defaultWardrobeSelection,
  type WardrobeSlot,
} from './types';
import {
  SLOT_ANCHORS,
  WARDROBE_ANCHORS,
  getAnchorsForSlot,
  getPrimaryAnchorForSlot,
} from './anchors';

describe('wardrobe anchors', () => {
  it('defines the approved six wardrobe slots', () => {
    expect(WARDROBE_SLOTS).toEqual(['head', 'face', 'neck', 'body', 'back', 'feet']);
  });

  it('creates a default none selection for every slot', () => {
    expect(defaultWardrobeSelection()).toEqual({
      head: 'none',
      face: 'none',
      neck: 'none',
      body: 'none',
      back: 'none',
      feet: 'none',
    });
  });

  it('maps every slot to at least one measured anchor', () => {
    for (const slot of WARDROBE_SLOTS) {
      expect(SLOT_ANCHORS[slot]).toBeDefined();
      expect(SLOT_ANCHORS[slot].length).toBeGreaterThan(0);
      for (const anchor of SLOT_ANCHORS[slot]) {
        expect(WARDROBE_ANCHORS[anchor]).toBeDefined();
      }
    }
  });

  it('uses all four paw anchors for feet', () => {
    expect(getAnchorsForSlot('feet')).toEqual([
      'frontPawL',
      'frontPawR',
      'rearFootL',
      'rearFootR',
    ]);
  });

  it('returns a primary anchor for non-feet slots', () => {
    const nonFeet = WARDROBE_SLOTS.filter((slot): slot is Exclude<WardrobeSlot, 'feet'> => slot !== 'feet');
    for (const slot of nonFeet) {
      expect(WARDROBE_ANCHORS[getPrimaryAnchorForSlot(slot)]).toBeDefined();
    }
  });
});

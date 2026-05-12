import { describe, expect, it } from 'vitest';
import { WARDROBE_ANCHORS } from './anchors';
import { allWardrobeItems, getWardrobeItem, itemsForSlot } from './registry';
import { WARDROBE_SLOTS } from './types';

const accessoryGlbs = import.meta.glob('../../public/models/accessories/*.glb', {
  query: '?url',
  import: 'default',
});

function hasPublicAccessoryGlb(assetPath: `/models/accessories/${string}.glb`): boolean {
  const expected = `../../public${assetPath}`;
  return Object.prototype.hasOwnProperty.call(accessoryGlbs, expected);
}

describe('wardrobe registry', () => {
  it('has unique ids', () => {
    const ids = allWardrobeItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has metadata for every item', () => {
    for (const item of allWardrobeItems) {
      expect(item.label.trim()).not.toBe('');
      expect(item.source.name.trim()).not.toBe('');
      expect(item.source.url.trim()).not.toBe('');
      expect(item.source.license).toMatch(/^(CC0|CC-BY-3.0|CC-BY-4.0|Custom)$/);
      expect(item.tags.length).toBeGreaterThan(0);
      if (item.source.license.startsWith('CC-BY')) {
        expect(item.source.attribution?.trim()).not.toBe('');
      }
    }
  });

  it('references valid slots and anchors', () => {
    for (const item of allWardrobeItems) {
      expect(WARDROBE_SLOTS).toContain(item.slot);
      expect(WARDROBE_ANCHORS[item.transform.anchor]).toBeDefined();
    }
  });

  it('finds items by id and slot', () => {
    expect(getWardrobeItem('top-hat')?.label).toBe('Top Hat');
    expect(getWardrobeItem('scarf')?.label).toBe('Scarf');
    expect(itemsForSlot('head').map((item) => item.id)).toContain('top-hat');
    expect(itemsForSlot('neck').map((item) => item.id)).toContain('scarf');
  });

  it('ships at least eighteen wardrobe items across the six slots', () => {
    expect(allWardrobeItems.length).toBeGreaterThanOrEqual(18);
    for (const slot of WARDROBE_SLOTS) {
      expect(itemsForSlot(slot).length).toBeGreaterThan(0);
    }
  });

  it('keeps glb asset paths inside public/models/accessories', () => {
    for (const item of allWardrobeItems) {
      if (item.kind !== 'glb') continue;
      expect(item.assetPath.startsWith('/models/accessories/')).toBe(true);
      expect(hasPublicAccessoryGlb(item.assetPath)).toBe(true);
    }
  });
});

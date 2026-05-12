import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { allWardrobeItems } from '../wardrobe/registry';
import { WARDROBE_SLOT_LABELS, WARDROBE_SLOTS } from '../wardrobe/types';
import { WardrobePanel } from './WardrobePanel';

describe('WardrobePanel', () => {
  it('renders the six wardrobe slot tabs and catalog count', () => {
    const html = renderToStaticMarkup(<WardrobePanel />);

    for (const slot of WARDROBE_SLOTS) {
      expect(html).toContain(WARDROBE_SLOT_LABELS[slot]);
    }
    expect(html).toContain(`${allWardrobeItems.length} wardrobe items`);
  });
});

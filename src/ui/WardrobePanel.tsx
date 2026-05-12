import { useRef, useState } from 'react';
import { saveLook, loadLook } from '../storage/looks';
import { useAppStore } from '../store/appStore';
import { allWardrobeItems, itemsForSlot } from '../wardrobe/registry';
import {
  WARDROBE_SLOT_LABELS,
  WARDROBE_SLOTS,
  type WardrobeSlot,
} from '../wardrobe/types';

export function WardrobePanel(): JSX.Element {
  const [activeSlot, setActiveSlot] = useState<WardrobeSlot>('head');
  const lookNameRef = useRef('my-look');
  const wardrobe = useAppStore((s) => s.wardrobe);
  const setWardrobeItem = useAppStore((s) => s.setWardrobeItem);
  const clearWardrobeSlot = useAppStore((s) => s.clearWardrobeSlot);
  const resetWardrobe = useAppStore((s) => s.resetWardrobe);
  const randomizeWardrobe = useAppStore((s) => s.randomizeWardrobe);
  const environment = useAppStore((s) => s.environment);
  const pose = useAppStore((s) => s.pose);
  const applyLook = useAppStore((s) => s.applyLook);

  const activeItems = itemsForSlot(activeSlot);
  const selected = wardrobe[activeSlot];

  return (
    <section className="wardrobe-panel" aria-label="Wardrobe">
      <div className="wardrobe-tabs" aria-label="Wardrobe slots">
        {WARDROBE_SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            aria-pressed={slot === activeSlot}
            className={slot === activeSlot ? 'wardrobe-tab is-active' : 'wardrobe-tab'}
            onClick={() => setActiveSlot(slot)}
          >
            {WARDROBE_SLOT_LABELS[slot]}
          </button>
        ))}
      </div>

      <div className="wardrobe-items" aria-label={`${WARDROBE_SLOT_LABELS[activeSlot]} items`}>
        <button
          type="button"
          className={selected === 'none' ? 'wardrobe-item is-selected' : 'wardrobe-item'}
          onClick={() => clearWardrobeSlot(activeSlot)}
        >
          <span>None</span>
          <small>clear slot</small>
        </button>
        {activeItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={selected === item.id ? 'wardrobe-item is-selected' : 'wardrobe-item'}
            onClick={() => setWardrobeItem(activeSlot, item.id)}
          >
            <span>{item.label}</span>
            <small>{item.tags.slice(0, 2).join(' / ')}</small>
          </button>
        ))}
      </div>

      <div className="wardrobe-actions">
        <button type="button" onClick={() => clearWardrobeSlot(activeSlot)}>
          Clear Slot
        </button>
        <button type="button" onClick={resetWardrobe}>
          Reset Outfit
        </button>
        <button type="button" onClick={randomizeWardrobe}>
          Randomize
        </button>
      </div>

      <div className="wardrobe-save">
        <input
          type="text"
          defaultValue="my-look"
          aria-label="Look name"
          onChange={(event) => {
            lookNameRef.current = event.currentTarget.value;
          }}
        />
        <button
          type="button"
          onClick={() => {
            saveLook(lookNameRef.current, {
              version: 2,
              pose,
              wardrobe,
              environment,
            });
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            const look = loadLook(lookNameRef.current);
            if (look) applyLook(look);
          }}
        >
          Load
        </button>
      </div>

      <p className="wardrobe-count">{allWardrobeItems.length} wardrobe items</p>
    </section>
  );
}

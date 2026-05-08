# Dressup Wardrobe Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four-dropdown dress-up feature with a playful six-slot wardrobe system that supports procedural and GLB accessories on the current static ferret model.

**Architecture:** Add a typed wardrobe registry, measured static anchors, versioned saved-look migration, a unified accessory renderer, and a compact player-facing wardrobe panel. The current ferret GLB remains the base model; imported accessories fit through per-item transforms rather than skeletal deformation.

**Tech Stack:** Vite, React 18, TypeScript strict mode, three, @react-three/fiber, @react-three/drei, zustand, Vitest, glTF/GLB assets.

---

## Working Notes

- The working tree already contains uncommitted edits in `src/accessories/body/Cape.tsx`, `src/accessories/neck/Collar.tsx`, `src/accessories/neck/Scarf.tsx`, `src/environments/Beach.tsx`, `src/ferret/FerretRig.tsx`, and `src/ui/ControlPanel.tsx`. Treat them as user/existing work. Review and preserve them; do not revert them.
- On this machine, Windows `npm.cmd` does not run correctly from the WSL UNC path. Use WSL commands for verification:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test'
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run build'
```

## File Structure

- Create `src/wardrobe/types.ts`: slots, item metadata, transforms, license data, default selection helpers.
- Create `src/wardrobe/anchors.ts`: measured static ferret anchors and slot-to-anchor lookup.
- Create `src/wardrobe/registry.ts`: all wardrobe entries and lookup helpers.
- Create `src/wardrobe/procedural.tsx`: map registry `component` ids to existing and new procedural accessory components.
- Create `src/wardrobe/WardrobeItem.tsx`: render one procedural or GLB item at one anchor.
- Create `src/ui/WardrobePanel.tsx`: player-facing slot tabs, item tiles, clear/reset/randomize/save/load controls.
- Modify `src/ferret/FerretRig.tsx`: render selected wardrobe items at static anchors.
- Modify `src/store/appStore.ts`: add wardrobe state/actions while keeping old accessory compatibility during migration.
- Modify `src/storage/looks.ts`: support version 1 and version 2 looks.
- Modify `src/App.tsx`: mount `WardrobePanel`; keep Leva/control panel only for non-wardrobe debug controls.
- Modify `src/index.css`: style the wardrobe panel as a compact overlay.
- Add tests under `src/wardrobe/*.test.ts` and update `src/store/appStore.test.ts`, `src/storage/looks.test.ts`.
- Add GLB files under `public/models/accessories/` and source metadata under `public/models/accessories/CREDITS.md`.

---

### Task 1: Core Wardrobe Types And Anchors

**Files:**
- Create: `src/wardrobe/types.ts`
- Create: `src/wardrobe/anchors.ts`
- Create: `src/wardrobe/anchors.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/wardrobe/anchors.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/anchors.test.ts'
```

Expected: FAIL because `src/wardrobe/types.ts` and `src/wardrobe/anchors.ts` do not exist yet.

- [ ] **Step 3: Implement wardrobe types**

Create `src/wardrobe/types.ts`:

```ts
export const WARDROBE_SLOTS = ['head', 'face', 'neck', 'body', 'back', 'feet'] as const;
export type WardrobeSlot = (typeof WARDROBE_SLOTS)[number];

export const WARDROBE_SLOT_LABELS: Record<WardrobeSlot, string> = {
  head: 'Head',
  face: 'Face',
  neck: 'Neck',
  body: 'Body',
  back: 'Back',
  feet: 'Feet',
};

export type WardrobeAnchor =
  | 'headCrown'
  | 'faceBridge'
  | 'chestFront'
  | 'upperBack'
  | 'waist'
  | 'frontPawL'
  | 'frontPawR'
  | 'rearFootL'
  | 'rearFootR';

export type LicenseKind = 'CC0' | 'CC-BY-3.0' | 'CC-BY-4.0' | 'Custom';

export interface WardrobeSource {
  readonly name: string;
  readonly url: string;
  readonly license: LicenseKind;
  readonly attribution?: string;
}

export interface WardrobeTransform {
  readonly anchor: WardrobeAnchor;
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly scale: number | readonly [number, number, number];
}

export interface BaseWardrobeItem {
  readonly id: string;
  readonly label: string;
  readonly slot: WardrobeSlot;
  readonly source: WardrobeSource;
  readonly transform: WardrobeTransform;
  readonly tags: readonly string[];
}

export interface GlbWardrobeItem extends BaseWardrobeItem {
  readonly kind: 'glb';
  readonly assetPath: `/models/accessories/${string}.glb`;
}

export interface ProceduralWardrobeItem extends BaseWardrobeItem {
  readonly kind: 'procedural';
  readonly component: string;
}

export type WardrobeItem = GlbWardrobeItem | ProceduralWardrobeItem;
export type WardrobeSelection = Record<WardrobeSlot, string | 'none'>;

export function defaultWardrobeSelection(): WardrobeSelection {
  return {
    head: 'none',
    face: 'none',
    neck: 'none',
    body: 'none',
    back: 'none',
    feet: 'none',
  };
}
```

- [ ] **Step 4: Implement measured anchors**

Create `src/wardrobe/anchors.ts`:

```ts
import type { WardrobeAnchor, WardrobeSlot } from './types';

export interface AnchorTransform {
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
}

// Scene-space points derived from public/models/ferret.glb with current scale:
// source bbox [-0.5173,-0.01863,-2.59349] to [0.5173,2.11011,1.82064],
// scale 0.135927 for a 0.6 scene-unit body length.
export const WARDROBE_ANCHORS: Readonly<Record<WardrobeAnchor, AnchorTransform>> = {
  headCrown: { position: [0, 0.2881, 0.2315], rotation: [0, 0, 0] },
  faceBridge: { position: [0, 0.22, 0.265], rotation: [0, 0, 0] },
  chestFront: { position: [0, 0.162, 0.242], rotation: [0, 0, 0] },
  upperBack: { position: [0, 0.206, 0.102], rotation: [0, 0, 0] },
  waist: { position: [0, 0.124, -0.03], rotation: [0, 0, 0] },
  frontPawL: { position: [0.0557, 0.018, 0.178], rotation: [0, 0, 0] },
  frontPawR: { position: [-0.0557, 0.018, 0.178], rotation: [0, 0, 0] },
  rearFootL: { position: [0.0666, 0.019, -0.046], rotation: [0, 0, 0] },
  rearFootR: { position: [-0.0666, 0.019, -0.046], rotation: [0, 0, 0] },
};

export const SLOT_ANCHORS: Readonly<Record<WardrobeSlot, readonly WardrobeAnchor[]>> = {
  head: ['headCrown'],
  face: ['faceBridge'],
  neck: ['chestFront'],
  body: ['waist'],
  back: ['upperBack'],
  feet: ['frontPawL', 'frontPawR', 'rearFootL', 'rearFootR'],
};

export function getAnchorsForSlot(slot: WardrobeSlot): readonly WardrobeAnchor[] {
  return SLOT_ANCHORS[slot];
}

export function getPrimaryAnchorForSlot(slot: WardrobeSlot): WardrobeAnchor {
  return SLOT_ANCHORS[slot][0];
}
```

- [ ] **Step 5: Run the focused test and confirm it passes**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/anchors.test.ts'
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/wardrobe/types.ts src/wardrobe/anchors.ts src/wardrobe/anchors.test.ts
git commit -m "feat: add wardrobe slots and ferret anchors"
```

---

### Task 2: Wardrobe Registry And Validation

**Files:**
- Create: `src/wardrobe/registry.ts`
- Create: `src/wardrobe/registry.test.ts`

- [ ] **Step 1: Write the failing registry tests**

Create `src/wardrobe/registry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { WARDROBE_ANCHORS } from './anchors';
import { allWardrobeItems, getWardrobeItem, itemsForSlot } from './registry';
import { WARDROBE_SLOTS } from './types';

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
    expect(itemsForSlot('head').map((item) => item.id)).toContain('top-hat');
    expect(itemsForSlot('neck').map((item) => item.id)).toContain('scarf');
  });

  it('keeps glb asset paths inside public/models/accessories', () => {
    for (const item of allWardrobeItems) {
      if (item.kind !== 'glb') continue;
      expect(item.assetPath.startsWith('/models/accessories/')).toBe(true);
      const diskPath = join(process.cwd(), 'public', item.assetPath.replace('/models/', 'models/'));
      expect(existsSync(diskPath)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/registry.test.ts'
```

Expected: FAIL because `src/wardrobe/registry.ts` does not exist yet.

- [ ] **Step 3: Implement the initial registry with migrated procedural items**

Create `src/wardrobe/registry.ts`:

```ts
import type { WardrobeItem, WardrobeSlot } from './types';

const CUSTOM_SOURCE = {
  name: 'Winston 2.0 procedural accessory',
  url: 'https://github.com/pgil256/winston-2',
  license: 'Custom',
} as const;

export const allWardrobeItems: readonly WardrobeItem[] = [
  {
    id: 'top-hat',
    label: 'Top Hat',
    slot: 'head',
    kind: 'procedural',
    component: 'TopHat',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'headCrown', position: [0, -0.029, -0.01], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['classic', 'fancy'],
  },
  {
    id: 'party-hat',
    label: 'Party Hat',
    slot: 'head',
    kind: 'procedural',
    component: 'PartyHat',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'headCrown', position: [0, -0.029, -0.01], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['party', 'playful'],
  },
  {
    id: 'witch-hat',
    label: 'Witch Hat',
    slot: 'head',
    kind: 'procedural',
    component: 'WitchHat',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'headCrown', position: [0, -0.029, -0.01], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['magic', 'costume'],
  },
  {
    id: 'cowboy-hat',
    label: 'Cowboy Hat',
    slot: 'head',
    kind: 'procedural',
    component: 'CowboyHat',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'headCrown', position: [0, -0.029, -0.01], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['western', 'costume'],
  },
  {
    id: 'bowtie',
    label: 'Bowtie',
    slot: 'neck',
    kind: 'procedural',
    component: 'Bowtie',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'chestFront', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
    tags: ['formal', 'pet-fashion'],
  },
  {
    id: 'collar',
    label: 'Collar',
    slot: 'neck',
    kind: 'procedural',
    component: 'Collar',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'chestFront', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
    tags: ['pet-fashion', 'bell'],
  },
  {
    id: 'scarf',
    label: 'Scarf',
    slot: 'neck',
    kind: 'procedural',
    component: 'Scarf',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'chestFront', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
    tags: ['cozy', 'pet-fashion'],
  },
  {
    id: 'sweater',
    label: 'Sweater',
    slot: 'body',
    kind: 'procedural',
    component: 'Sweater',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'waist', position: [0, 0.02, 0.06], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['cozy', 'pet-fashion'],
  },
  {
    id: 'tutu',
    label: 'Tutu',
    slot: 'body',
    kind: 'procedural',
    component: 'Tutu',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'waist', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['dance', 'playful'],
  },
  {
    id: 'cape',
    label: 'Cape',
    slot: 'back',
    kind: 'procedural',
    component: 'Cape',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'upperBack', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.42 },
    tags: ['hero', 'costume'],
  },
  {
    id: 'socks',
    label: 'Socks',
    slot: 'feet',
    kind: 'procedural',
    component: 'Socks',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'frontPawL', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
    tags: ['cozy', 'pet-fashion'],
  },
  {
    id: 'boots',
    label: 'Boots',
    slot: 'feet',
    kind: 'procedural',
    component: 'Boots',
    source: CUSTOM_SOURCE,
    transform: { anchor: 'frontPawL', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
    tags: ['adventure', 'pet-fashion'],
  },
];

const ITEMS_BY_ID = new Map(allWardrobeItems.map((item) => [item.id, item]));

export function getWardrobeItem(id: string): WardrobeItem | undefined {
  return ITEMS_BY_ID.get(id);
}

export function itemsForSlot(slot: WardrobeSlot): readonly WardrobeItem[] {
  return allWardrobeItems.filter((item) => item.slot === slot);
}
```

- [ ] **Step 4: Run the registry test and confirm it passes**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/registry.test.ts'
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/wardrobe/registry.ts src/wardrobe/registry.test.ts
git commit -m "feat: add wardrobe registry validation"
```

---

### Task 3: Versioned Look Migration And Store Actions

**Files:**
- Modify: `src/storage/looks.ts`
- Modify: `src/storage/looks.test.ts`
- Modify: `src/store/appStore.ts`
- Modify: `src/store/appStore.test.ts`

- [ ] **Step 1: Write failing storage migration tests**

Add these tests to `src/storage/looks.test.ts`:

```ts
import { migrateLookToV2, type LookV1, type LookV2 } from './looks';

it('migrates a v1 look into expanded wardrobe slots', () => {
  const oldLook: LookV1 = {
    version: 1,
    pose: zeroPose(),
    accessories: { head: 'witch', neck: 'scarf', body: 'cape', feet: 'boots' },
    environment: 'forest',
  };

  expect(migrateLookToV2(oldLook)).toMatchObject({
    version: 2,
    wardrobe: {
      head: 'witch-hat',
      face: 'none',
      neck: 'scarf',
      body: 'none',
      back: 'cape',
      feet: 'boots',
    },
    environment: 'forest',
  });
});

it('keeps v2 looks stable when migrating', () => {
  const look: LookV2 = {
    version: 2,
    pose: zeroPose(),
    wardrobe: {
      head: 'crown',
      face: 'sunglasses',
      neck: 'none',
      body: 'tutu',
      back: 'cape',
      feet: 'boots',
    },
    environment: 'studio',
  };

  expect(migrateLookToV2(look)).toEqual(look);
});
```

- [ ] **Step 2: Write failing store tests**

Add these tests to `src/store/appStore.test.ts`:

```ts
it('initializes with an empty wardrobe selection', () => {
  expect(useAppStore.getState().wardrobe).toEqual({
    head: 'none',
    face: 'none',
    neck: 'none',
    body: 'none',
    back: 'none',
    feet: 'none',
  });
});

it('setWardrobeItem updates only one wardrobe slot', () => {
  const s = useAppStore.getState();
  s.setWardrobeItem('head', 'wizard-hat');
  s.setWardrobeItem('face', 'sunglasses');
  expect(useAppStore.getState().wardrobe).toEqual({
    head: 'wizard-hat',
    face: 'sunglasses',
    neck: 'none',
    body: 'none',
    back: 'none',
    feet: 'none',
  });
});

it('clearWardrobeSlot and resetWardrobe clear wardrobe state', () => {
  const s = useAppStore.getState();
  s.setWardrobeItem('head', 'wizard-hat');
  s.setWardrobeItem('feet', 'boots');
  s.clearWardrobeSlot('head');
  expect(useAppStore.getState().wardrobe.head).toBe('none');
  expect(useAppStore.getState().wardrobe.feet).toBe('boots');
  s.resetWardrobe();
  expect(Object.values(useAppStore.getState().wardrobe)).toEqual([
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ]);
});
```

- [ ] **Step 3: Run focused tests and confirm they fail**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/storage/looks.test.ts src/store/appStore.test.ts'
```

Expected: FAIL because migration helpers and wardrobe store state do not exist yet.

- [ ] **Step 4: Implement versioned looks**

Update `src/storage/looks.ts` so it exports `LookV1`, `LookV2`, `Look`, and `migrateLookToV2`. Preserve `saveLook`, `loadLook`, `listLooks`, and `deleteLook`.

Use this migration map:

```ts
const HAT_ID_MAP = {
  none: 'none',
  top: 'top-hat',
  party: 'party-hat',
  witch: 'witch-hat',
  cowboy: 'cowboy-hat',
} as const;

const NECK_ID_MAP = {
  none: 'none',
  bowtie: 'bowtie',
  collar: 'collar',
  scarf: 'scarf',
} as const;

const BODY_ID_MAP = {
  none: { body: 'none', back: 'none' },
  sweater: { body: 'sweater', back: 'none' },
  cape: { body: 'none', back: 'cape' },
  tutu: { body: 'tutu', back: 'none' },
} as const;

const FEET_ID_MAP = {
  none: 'none',
  socks: 'socks',
  boots: 'boots',
} as const;
```

Implement `migrateLookToV2` with this behavior:

```ts
export function migrateLookToV2(look: Look): LookV2 {
  if (look.version === 2) return look;
  const bodyBack = BODY_ID_MAP[look.accessories.body] ?? BODY_ID_MAP.none;
  return {
    version: 2,
    pose: look.pose,
    wardrobe: {
      head: HAT_ID_MAP[look.accessories.head] ?? 'none',
      face: 'none',
      neck: NECK_ID_MAP[look.accessories.neck] ?? 'none',
      body: bodyBack.body,
      back: bodyBack.back,
      feet: FEET_ID_MAP[look.accessories.feet] ?? 'none',
    },
    environment: look.environment,
  };
}
```

Update `loadLook` so it returns `migrateLookToV2(all[trimmed])`.

- [ ] **Step 5: Implement wardrobe store state and compatibility setters**

In `src/store/appStore.ts`:

- Add `wardrobe: WardrobeSelection` to `AppState`.
- Add `setWardrobeItem`, `clearWardrobeSlot`, `resetWardrobe`, and `randomizeWardrobe`.
- Keep existing `accessories`, `setHat`, `setNeck`, `setBody`, and `setFeet` until old `ControlPanel` code is removed or narrowed.
- Make legacy setters also update `wardrobe` using the same migration maps.
- Make `applyLook` call `migrateLookToV2`.
- Make `resetAll` reset both `accessories` and `wardrobe`.

Core action shapes:

```ts
setWardrobeItem: (slot, id) =>
  set((s) => ({ wardrobe: { ...s.wardrobe, [slot]: id } })),

clearWardrobeSlot: (slot) =>
  set((s) => ({ wardrobe: { ...s.wardrobe, [slot]: 'none' } })),

resetWardrobe: () => set({ wardrobe: defaultWardrobeSelection() }),
```

Implement `randomizeWardrobe` by using `itemsForSlot(slot)` and selecting one item id per slot. Include `'none'` in the candidate pool for every slot so random outfits are not always fully saturated.

- [ ] **Step 6: Run focused tests and confirm they pass**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/storage/looks.test.ts src/store/appStore.test.ts'
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/storage/looks.ts src/storage/looks.test.ts src/store/appStore.ts src/store/appStore.test.ts
git commit -m "feat: migrate looks to wardrobe state"
```

---

### Task 4: Unified Wardrobe Renderer

**Files:**
- Create: `src/wardrobe/procedural.tsx`
- Create: `src/wardrobe/WardrobeItem.tsx`
- Modify: `src/ferret/FerretRig.tsx`

- [ ] **Step 1: Create the procedural component map**

Create `src/wardrobe/procedural.tsx`:

```tsx
import type { ComponentType } from 'react';
import type { BoneId } from '../rig/types';
import { TopHat } from '../accessories/hats/TopHat';
import { PartyHat } from '../accessories/hats/PartyHat';
import { WitchHat } from '../accessories/hats/WitchHat';
import { CowboyHat } from '../accessories/hats/CowboyHat';
import { Bowtie } from '../accessories/neck/Bowtie';
import { Collar } from '../accessories/neck/Collar';
import { Scarf } from '../accessories/neck/Scarf';
import { Sweater } from '../accessories/body/Sweater';
import { Cape } from '../accessories/body/Cape';
import { Tutu } from '../accessories/body/Tutu';
import { Socks } from '../accessories/feet/Socks';
import { Boots } from '../accessories/feet/Boots';

export interface ProceduralAccessoryProps {
  readonly bone?: BoneId;
}

export const PROCEDURAL_ACCESSORIES: Readonly<Record<string, ComponentType<ProceduralAccessoryProps>>> = {
  TopHat,
  PartyHat,
  WitchHat,
  CowboyHat,
  Bowtie,
  Collar,
  Scarf,
  Sweater,
  Cape,
  Tutu,
  Socks: ({ bone }) => <Socks bone={bone ?? 'paw_L'} />,
  Boots: ({ bone }) => <Boots bone={bone ?? 'paw_L'} />,
};
```

- [ ] **Step 2: Create the wardrobe item renderer**

Create `src/wardrobe/WardrobeItem.tsx`:

```tsx
import { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { BoneId } from '../rig/types';
import type { WardrobeAnchor, WardrobeItem as WardrobeItemData } from './types';
import { WARDROBE_ANCHORS } from './anchors';
import { PROCEDURAL_ACCESSORIES } from './procedural';

interface Props {
  readonly item: WardrobeItemData;
  readonly anchor: WardrobeAnchor;
  readonly bone?: BoneId;
}

export function WardrobeItem({ item, anchor, bone }: Props): JSX.Element | null {
  const anchorTransform = WARDROBE_ANCHORS[anchor];
  const transform = item.transform;
  const scale = transform.scale;
  const scaleTuple = typeof scale === 'number' ? [scale, scale, scale] as const : scale;

  return (
    <group
      position={[
        anchorTransform.position[0] + transform.position[0],
        anchorTransform.position[1] + transform.position[1],
        anchorTransform.position[2] + transform.position[2],
      ]}
      rotation={[
        anchorTransform.rotation[0] + transform.rotation[0],
        anchorTransform.rotation[1] + transform.rotation[1],
        anchorTransform.rotation[2] + transform.rotation[2],
      ]}
      scale={scaleTuple}
    >
      {item.kind === 'procedural' ? (
        <ProceduralItem item={item} bone={bone} />
      ) : (
        <Suspense fallback={null}>
          <GlbItem item={item} />
        </Suspense>
      )}
    </group>
  );
}

function ProceduralItem({
  item,
  bone,
}: {
  readonly item: Extract<WardrobeItemData, { kind: 'procedural' }>;
  readonly bone?: BoneId;
}): JSX.Element | null {
  const Comp = PROCEDURAL_ACCESSORIES[item.component];
  return Comp ? <Comp bone={bone} /> : null;
}

function GlbItem({
  item,
}: {
  readonly item: Extract<WardrobeItemData, { kind: 'glb' }>;
}): JSX.Element {
  const { scene } = useGLTF(item.assetPath);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return <primitive object={cloned} />;
}
```

- [ ] **Step 3: Modify `FerretRig` to render wardrobe selections**

Replace the old repeated `<AccessoryAt />` groups in `src/ferret/FerretRig.tsx` with a `WardrobeLayer` helper that reads `wardrobe` from the store:

```tsx
import { FerretModel } from './FerretModel';
import { useAppStore } from '../store/appStore';
import { getAnchorsForSlot } from '../wardrobe/anchors';
import { getWardrobeItem } from '../wardrobe/registry';
import { WardrobeItem } from '../wardrobe/WardrobeItem';
import type { WardrobeAnchor, WardrobeSlot } from '../wardrobe/types';
import type { BoneId } from '../rig/types';
```

Add these helpers near the top of the file:

```ts
const FEET_BONES: Partial<Record<WardrobeAnchor, BoneId>> = {
  frontPawL: 'paw_L',
  frontPawR: 'paw_R',
  rearFootL: 'foot_L',
  rearFootR: 'foot_R',
};
```

Render the model plus wardrobe:

```tsx
export function FerretRig(): JSX.Element {
  return (
    <group>
      <group scale={SCALE} position={MODEL_OFFSET}>
        <FerretModel />
      </group>
      <WardrobeLayer />
    </group>
  );
}

function WardrobeLayer(): JSX.Element {
  const wardrobe = useAppStore((s) => s.wardrobe);
  return (
    <>
      {(Object.entries(wardrobe) as Array<[WardrobeSlot, string]>).map(([slot, id]) => {
        if (id === 'none') return null;
        const item = getWardrobeItem(id);
        if (!item) return null;
        return getAnchorsForSlot(slot).map((anchor) => (
          <WardrobeItem
            key={`${slot}-${id}-${anchor}`}
            item={item}
            anchor={anchor}
            bone={FEET_BONES[anchor]}
          />
        ));
      })}
    </>
  );
}
```

Keep the existing `MODEL_BBOX`, `TARGET_LENGTH`, `SCALE`, and `MODEL_OFFSET` logic so the ferret itself remains unchanged.

- [ ] **Step 4: Run the full unit suite**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test'
```

Expected: PASS.

- [ ] **Step 5: Run the build**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run build'
```

Expected: PASS with the existing Vite chunk-size warning allowed.

- [ ] **Step 6: Commit**

```bash
git add src/wardrobe/procedural.tsx src/wardrobe/WardrobeItem.tsx src/ferret/FerretRig.tsx
git commit -m "feat: render wardrobe items on static ferret anchors"
```

---

### Task 5: Player-Facing Wardrobe Panel

**Files:**
- Create: `src/ui/WardrobePanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `src/ui/ControlPanel.tsx`

- [ ] **Step 1: Create the wardrobe panel**

Create `src/ui/WardrobePanel.tsx`:

```tsx
import { useMemo, useRef, useState } from 'react';
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

  const activeItems = useMemo(() => itemsForSlot(activeSlot), [activeSlot]);
  const selected = wardrobe[activeSlot];

  return (
    <section className="wardrobe-panel" aria-label="Wardrobe">
      <div className="wardrobe-tabs" role="tablist" aria-label="Wardrobe slots">
        {WARDROBE_SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
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
```

- [ ] **Step 2: Mount the panel in `App.tsx`**

Import and render the panel:

```tsx
import { WardrobePanel } from './ui/WardrobePanel';
```

Place it after `<ControlPanel />` and before `<BottomLeftCorner />`:

```tsx
<ControlPanel />
<WardrobePanel />
<BottomLeftCorner />
```

- [ ] **Step 3: Narrow `ControlPanel` so it no longer owns wardrobe UI**

In `src/ui/ControlPanel.tsx`, remove the `Dress Up` `useControls` block and the accessory imports/setters. Keep `Environment` and `Save / Load Look` only if they still compile cleanly with the version 2 look shape. If save/load now lives exclusively in `WardrobePanel`, keep only the environment control in Leva.

Expected `ControlPanel` responsibility after this step: environment/debug controls only.

- [ ] **Step 4: Add compact overlay styles**

Append to `src/index.css`:

```css
.wardrobe-panel {
  position: absolute;
  top: 12px;
  left: 12px;
  width: min(440px, calc(100vw - 24px));
  max-height: calc(100vh - 24px);
  overflow: auto;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wardrobe-tabs,
.wardrobe-actions,
.wardrobe-save {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wardrobe-tab,
.wardrobe-actions button,
.wardrobe-save button {
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.82);
  color: #1f1f1f;
  border-radius: 6px;
  padding: 6px 9px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.wardrobe-tab.is-active,
.wardrobe-item.is-selected {
  border-color: #202020;
  background: #202020;
  color: #ffffff;
}

.wardrobe-items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.wardrobe-item {
  min-height: 54px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  color: #202020;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
  text-align: left;
  font: inherit;
}

.wardrobe-item span {
  font-weight: 650;
  font-size: 13px;
}

.wardrobe-item small {
  font-size: 11px;
  color: inherit;
  opacity: 0.72;
}

.wardrobe-save input {
  min-width: 0;
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  padding: 6px 8px;
  font: inherit;
  font-size: 12px;
}

.wardrobe-count {
  margin: 0;
  font-size: 11px;
  color: #555;
}
```

- [ ] **Step 5: Run typecheck/build**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run build'
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/ui/WardrobePanel.tsx src/App.tsx src/index.css src/ui/ControlPanel.tsx
git commit -m "feat: add player wardrobe panel"
```

---

### Task 6: Expand Playful Procedural Wardrobe

**Files:**
- Modify: `src/wardrobe/procedural.tsx`
- Modify: `src/wardrobe/registry.ts`
- Modify: `src/wardrobe/registry.test.ts`

- [ ] **Step 1: Add a failing minimum-catalog test**

Add to `src/wardrobe/registry.test.ts`:

```ts
it('ships at least eighteen wardrobe items across the six slots', () => {
  expect(allWardrobeItems.length).toBeGreaterThanOrEqual(18);
  for (const slot of WARDROBE_SLOTS) {
    expect(itemsForSlot(slot).length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run the registry test and confirm it fails**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/registry.test.ts'
```

Expected: FAIL because the initial registry has no `face` items and fewer than 18 items.

- [ ] **Step 3: Add simple playful procedural components**

Extend `src/wardrobe/procedural.tsx` with these components and add them to `PROCEDURAL_ACCESSORIES`:

```tsx
function Crown(): JSX.Element {
  return (
    <group position={[0, 0.055, 0.04]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.035, 6, 1, true]} />
        <meshStandardMaterial color="#f5c542" metalness={0.45} roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.055, 0.03, Math.sin(angle) * 0.055]} castShadow>
            <sphereGeometry args={[0.012, 10, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#d7354a' : '#2f72d6'} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function WizardHat(): JSX.Element {
  return (
    <group position={[0, 0.06, 0.04]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.01, 28]} />
        <meshStandardMaterial color="#27347a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.095, 0]} rotation={[0, 0, -0.08]} castShadow>
        <coneGeometry args={[0.052, 0.19, 28]} />
        <meshStandardMaterial color="#27347a" roughness={0.7} />
      </mesh>
      <mesh position={[0.018, 0.09, 0.044]} castShadow>
        <sphereGeometry args={[0.01, 10, 8]} />
        <meshStandardMaterial color="#f5d76e" emissive="#3a2f00" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function PirateHat(): JSX.Element {
  return (
    <group position={[0, 0.055, 0.04]}>
      <mesh scale={[1.25, 0.24, 0.62]} castShadow>
        <sphereGeometry args={[0.075, 24, 12]} />
        <meshStandardMaterial color="#1d1713" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.018, 0.043]} castShadow>
        <boxGeometry args={[0.11, 0.01, 0.018]} />
        <meshStandardMaterial color="#e7d8a8" roughness={0.65} />
      </mesh>
    </group>
  );
}

function Sunglasses(): JSX.Element {
  return (
    <group position={[0, 0, 0.018]}>
      {[-0.026, 0.026].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.018, 0.006]} />
          <meshStandardMaterial color="#111111" roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.018, 0.005, 0.005]} />
        <meshStandardMaterial color="#111111" roughness={0.45} />
      </mesh>
    </group>
  );
}

function Eyepatch(): JSX.Element {
  return (
    <group position={[0.022, 0, 0.02]}>
      <mesh castShadow>
        <boxGeometry args={[0.036, 0.024, 0.006]} />
        <meshStandardMaterial color="#151515" roughness={0.7} />
      </mesh>
      <mesh position={[-0.022, 0.012, -0.002]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.08, 0.004, 0.004]} />
        <meshStandardMaterial color="#151515" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Wings(): JSX.Element {
  return (
    <group position={[0, -0.015, -0.035]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.065, 0.02, 0]} rotation={[0.25, 0, side * 0.45]} castShadow>
          <coneGeometry args={[0.045, 0.12, 4]} />
          <meshStandardMaterial color="#f1f1f1" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Backpack(): JSX.Element {
  return (
    <group position={[0, -0.01, -0.035]}>
      <mesh scale={[0.8, 1.1, 0.55]} castShadow>
        <boxGeometry args={[0.12, 0.11, 0.07]} />
        <meshStandardMaterial color="#4f7b51" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.006, 0.04]} castShadow>
        <boxGeometry args={[0.07, 0.026, 0.012]} />
        <meshStandardMaterial color="#314f33" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Slippers({ bone }: ProceduralAccessoryProps): JSX.Element {
  return (
    <group>
      <mesh position={[0, -0.002, bone === 'foot_L' || bone === 'foot_R' ? 0.018 : 0]} scale={[1.2, 0.45, 0.85]} castShadow>
        <sphereGeometry args={[0.034, 16, 12]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.9} />
      </mesh>
    </group>
  );
}
```

Add these mappings:

```ts
Crown,
WizardHat,
PirateHat,
Sunglasses,
Eyepatch,
Wings,
Backpack,
Slippers,
```

- [ ] **Step 4: Add registry entries for the new procedural items**

Add these entries to `allWardrobeItems`:

```ts
{
  id: 'crown',
  label: 'Crown',
  slot: 'head',
  kind: 'procedural',
  component: 'Crown',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'headCrown', position: [0, -0.025, -0.005], rotation: [0, 0, 0], scale: 0.5 },
  tags: ['royal', 'playful'],
},
{
  id: 'wizard-hat',
  label: 'Wizard Hat',
  slot: 'head',
  kind: 'procedural',
  component: 'WizardHat',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'headCrown', position: [0, -0.03, -0.005], rotation: [0, 0, 0], scale: 0.5 },
  tags: ['magic', 'fantasy'],
},
{
  id: 'pirate-hat',
  label: 'Pirate Hat',
  slot: 'head',
  kind: 'procedural',
  component: 'PirateHat',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'headCrown', position: [0, -0.026, -0.005], rotation: [0, 0, 0], scale: 0.5 },
  tags: ['pirate', 'adventure'],
},
{
  id: 'sunglasses',
  label: 'Sunglasses',
  slot: 'face',
  kind: 'procedural',
  component: 'Sunglasses',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'faceBridge', position: [0, 0.0, 0], rotation: [0, 0, 0], scale: 0.72 },
  tags: ['cool', 'playful'],
},
{
  id: 'eyepatch',
  label: 'Eyepatch',
  slot: 'face',
  kind: 'procedural',
  component: 'Eyepatch',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'faceBridge', position: [0, 0.0, 0], rotation: [0, 0, 0], scale: 0.72 },
  tags: ['pirate', 'adventure'],
},
{
  id: 'wings',
  label: 'Wings',
  slot: 'back',
  kind: 'procedural',
  component: 'Wings',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'upperBack', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.8 },
  tags: ['fantasy', 'playful'],
},
{
  id: 'backpack',
  label: 'Backpack',
  slot: 'back',
  kind: 'procedural',
  component: 'Backpack',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'upperBack', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.75 },
  tags: ['adventure', 'space'],
},
{
  id: 'slippers',
  label: 'Slippers',
  slot: 'feet',
  kind: 'procedural',
  component: 'Slippers',
  source: CUSTOM_SOURCE,
  transform: { anchor: 'frontPawL', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.55 },
  tags: ['cozy', 'pet-fashion'],
},
```

- [ ] **Step 5: Run registry tests**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/registry.test.ts'
```

Expected: PASS with at least 20 items.

- [ ] **Step 6: Run build**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run build'
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/wardrobe/procedural.tsx src/wardrobe/registry.ts src/wardrobe/registry.test.ts
git commit -m "feat: expand playful procedural wardrobe"
```

---

### Task 7: GLB Asset Intake And Registry Entries

**Files:**
- Create: `public/models/accessories/`
- Create: `public/models/accessories/CREDITS.md`
- Add: `public/models/accessories/*.glb`
- Modify: `src/wardrobe/registry.ts`

- [ ] **Step 1: Create the intake and shipping directories**

Run:

```bash
mkdir -p .asset-intake public/models/accessories
```

Expected: directories exist locally. Do not commit `.asset-intake`.

- [ ] **Step 2: Download CC0 candidate packs**

Use these official Kenney download URLs. If shell network access to `kenney.nl` times out, use the browser to download from each asset page and save the ZIPs with the exact filenames shown here in `.asset-intake/`.

```bash
curl -L -o .asset-intake/kenney_pirate-kit.zip https://kenney.nl/media/pages/assets/pirate-kit/85d331e664-1771333093/kenney_pirate-kit.zip
curl -L -o .asset-intake/kenney_modular-space-kit.zip https://kenney.nl/media/pages/assets/modular-space-kit/13f81361ae-1771146076/kenney_modular-space-kit_1.0.zip
curl -L -o .asset-intake/kenney_platformer-kit.zip https://kenney.nl/media/pages/assets/platformer-kit/f9bea48397-1761035339/kenney_platformer-kit.zip
curl -L -o .asset-intake/kenney_cube-pets.zip https://kenney.nl/media/pages/assets/cube-pets/12f4960d3f-1756880535/kenney_cube-pets.zip
```

Official source pages:

- `https://kenney.nl/assets/pirate-kit`
- `https://kenney.nl/assets/modular-space-kit`
- `https://kenney.nl/assets/platformer-kit`
- `https://kenney.nl/assets/cube-pets`

Expected: four ZIP files under `.asset-intake/`.

- [ ] **Step 3: Unzip and list GLB candidates**

Run:

```bash
cd .asset-intake
unzip -q -o kenney_pirate-kit.zip -d kenney_pirate-kit
unzip -q -o kenney_modular-space-kit.zip -d kenney_modular-space-kit
unzip -q -o kenney_platformer-kit.zip -d kenney_platformer-kit
unzip -q -o kenney_cube-pets.zip -d kenney_cube-pets
find . -iname '*.glb' -o -iname '*.gltf' | sort > glb-candidates.txt
sed -n '1,120p' glb-candidates.txt
```

Expected: `glb-candidates.txt` lists models from the downloaded packs.

- [ ] **Step 4: Select four accepted GLB accessories**

Run this selection script from the repo root. It applies a deterministic priority order against `glb-candidates.txt`, writes the selected source paths to `.asset-intake/accepted-assets.txt`, and converts/copies the selected models to stable shipping filenames.

```bash
cat > .asset-intake/select-assets.sh <<'SH'
#!/usr/bin/env sh
set -eu

pick() {
  pattern="$1"
  match="$(grep -Ei "$pattern" .asset-intake/glb-candidates.txt | head -1 || true)"
  if [ -z "$match" ]; then
    echo "No GLB or glTF matched pattern: $pattern" >&2
    exit 1
  fi
  printf '%s\n' "$match"
}

copy_or_convert() {
  src="$1"
  dest="$2"
  case "$src" in
    *.glb|*.GLB)
      cp ".asset-intake/$src" "$dest"
      ;;
    *.gltf|*.GLTF)
      npx --yes @gltf-transform/cli copy ".asset-intake/$src" "$dest"
      ;;
    *)
      echo "Unsupported model extension: $src" >&2
      exit 1
      ;;
  esac
}

pirate="$(pick 'pirate|hat|bandana|eye|hook|shoulder')"
space="$(pick 'space|helmet|visor|antenna|backpack|jetpack')"
platformer="$(pick 'crown|helmet|glasses|pack|boot|hat')"
pet="$(pick 'pet|collar|bell|bone|tag|hat')"

{
  echo "kenney-pirate-prop.glb <- $pirate"
  echo "kenney-space-prop.glb <- $space"
  echo "kenney-platformer-prop.glb <- $platformer"
  echo "kenney-pet-prop.glb <- $pet"
} > .asset-intake/accepted-assets.txt

copy_or_convert "$pirate" public/models/accessories/kenney-pirate-prop.glb
copy_or_convert "$space" public/models/accessories/kenney-space-prop.glb
copy_or_convert "$platformer" public/models/accessories/kenney-platformer-prop.glb
copy_or_convert "$pet" public/models/accessories/kenney-pet-prop.glb
SH
sh .asset-intake/select-assets.sh
cat .asset-intake/accepted-assets.txt
```

Expected: `.asset-intake/accepted-assets.txt` contains four accepted source paths and these shipping files exist:

```bash
public/models/accessories/kenney-pirate-prop.glb
public/models/accessories/kenney-space-prop.glb
public/models/accessories/kenney-platformer-prop.glb
public/models/accessories/kenney-pet-prop.glb
```

- [ ] **Step 5: Inspect accepted GLBs**

Run:

```bash
npx --yes @gltf-transform/cli inspect public/models/accessories/kenney-pirate-prop.glb
npx --yes @gltf-transform/cli inspect public/models/accessories/kenney-space-prop.glb
npx --yes @gltf-transform/cli inspect public/models/accessories/kenney-platformer-prop.glb
npx --yes @gltf-transform/cli inspect public/models/accessories/kenney-pet-prop.glb
```

Expected: each command reports a valid glTF 2.0/GLB asset. Reject and replace any accepted asset that is visually unrelated, very large for an accessory, or fails inspection.

- [ ] **Step 6: Add credits**

Create `public/models/accessories/CREDITS.md`:

```md
# Accessory Model Credits

All Kenney assets listed here are licensed Creative Commons CC0.

## Kenney Pirate Kit

- Source: https://kenney.nl/assets/pirate-kit
- License: Creative Commons CC0
- Included file: `kenney-pirate-prop.glb`

## Kenney Modular Space Kit

- Source: https://kenney.nl/assets/modular-space-kit
- License: Creative Commons CC0
- Included file: `kenney-space-prop.glb`

## Kenney Platformer Kit

- Source: https://kenney.nl/assets/platformer-kit
- License: Creative Commons CC0
- Included file: `kenney-platformer-prop.glb`

## Kenney Cube Pets

- Source: https://kenney.nl/assets/cube-pets
- License: Creative Commons CC0
- Included file: `kenney-pet-prop.glb`
```

- [ ] **Step 7: Add GLB-backed registry entries**

Add four `kind: 'glb'` entries to `allWardrobeItems` with IDs matching the shipped files:

```ts
{
  id: 'kenney-pirate-prop',
  label: 'Pirate Prop',
  slot: 'head',
  kind: 'glb',
  assetPath: '/models/accessories/kenney-pirate-prop.glb',
  source: {
    name: 'Kenney Pirate Kit',
    url: 'https://kenney.nl/assets/pirate-kit',
    license: 'CC0',
  },
  transform: { anchor: 'headCrown', position: [0, -0.02, 0], rotation: [0, 0, 0], scale: 0.05 },
  tags: ['pirate', 'glb'],
},
{
  id: 'kenney-space-prop',
  label: 'Space Prop',
  slot: 'back',
  kind: 'glb',
  assetPath: '/models/accessories/kenney-space-prop.glb',
  source: {
    name: 'Kenney Modular Space Kit',
    url: 'https://kenney.nl/assets/modular-space-kit',
    license: 'CC0',
  },
  transform: { anchor: 'upperBack', position: [0, 0, -0.02], rotation: [0, 0, 0], scale: 0.05 },
  tags: ['space', 'glb'],
},
{
  id: 'kenney-platformer-prop',
  label: 'Platformer Prop',
  slot: 'body',
  kind: 'glb',
  assetPath: '/models/accessories/kenney-platformer-prop.glb',
  source: {
    name: 'Kenney Platformer Kit',
    url: 'https://kenney.nl/assets/platformer-kit',
    license: 'CC0',
  },
  transform: { anchor: 'waist', position: [0, 0.02, 0], rotation: [0, 0, 0], scale: 0.05 },
  tags: ['playful', 'glb'],
},
{
  id: 'kenney-pet-prop',
  label: 'Pet Prop',
  slot: 'neck',
  kind: 'glb',
  assetPath: '/models/accessories/kenney-pet-prop.glb',
  source: {
    name: 'Kenney Cube Pets',
    url: 'https://kenney.nl/assets/cube-pets',
    license: 'CC0',
  },
  transform: { anchor: 'chestFront', position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.05 },
  tags: ['pet-fashion', 'glb'],
},
```

Tune `slot`, `anchor`, `position`, `rotation`, and `scale` after visual inspection. Keep the IDs and paths stable.

- [ ] **Step 8: Run registry tests**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test -- src/wardrobe/registry.test.ts'
```

Expected: PASS and the GLB existence test confirms all four files are present.

- [ ] **Step 9: Commit accepted assets and metadata**

```bash
git add public/models/accessories src/wardrobe/registry.ts src/wardrobe/registry.test.ts
git commit -m "feat: add cc0 glb wardrobe accessories"
```

---

### Task 8: Browser Fit Pass And Transform Tuning

**Files:**
- Modify: `src/wardrobe/anchors.ts`
- Modify: `src/wardrobe/registry.ts`
- Modify: `src/index.css` if panel overlap or responsive layout needs small fixes

- [ ] **Step 1: Start the dev server**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run dev -- --host 0.0.0.0'
```

Expected: Vite serves the app, usually at `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify five full outfits in browser**

Use the wardrobe panel to create and inspect these outfits:

```text
Wizard: wizard-hat + sunglasses + scarf + sweater + wings + slippers
Pirate: pirate-hat or kenney-pirate-prop + eyepatch + bandana/scarf + cape + boots
Royal: crown + bowtie + tutu + wings + slippers
Space: space/GLB prop + sunglasses/visor + backpack or space prop + boots
Cozy: party-hat + scarf + sweater + backpack + socks
```

For each outfit, inspect front, side, and three-quarter camera angles. Tune registry transforms only enough to remove obvious floating, floor clipping, or severe body clipping.

- [ ] **Step 3: Run tests and build after tuning**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test && npm run build'
```

Expected: PASS with only the existing Vite chunk-size warning allowed.

- [ ] **Step 4: Commit transform tuning**

```bash
git add src/wardrobe/anchors.ts src/wardrobe/registry.ts src/index.css
git commit -m "fix: tune wardrobe accessory fit"
```

---

### Task 9: Documentation And Final Verification

**Files:**
- Modify: `README.md`
- Modify: `public/models/CREDITS.md`
- Modify: `.gitignore`

- [ ] **Step 1: Ignore local implementation scratch directories**

Add these lines to `.gitignore` if they are not already present:

```gitignore
.asset-intake/
.superpowers/
```

- [ ] **Step 2: Update README controls**

In `README.md`, update the Controls section so Dress Up describes the six-slot wardrobe panel:

```md
| **Wardrobe** | Six slot tabs for Head, Face, Neck, Body, Back, and Feet. Pick item tiles, clear a slot, reset the outfit, randomize, and save/load named looks. |
```

Update the Notes section to say the ferret remains a static GLB and wardrobe items are placed on measured anchors.

- [ ] **Step 3: Link accessory credits**

In `public/models/CREDITS.md`, add:

```md
Additional wardrobe GLB credits live in `public/models/accessories/CREDITS.md`.
```

- [ ] **Step 4: Run full verification**

Run:

```bash
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm test'
wsl -d Ubuntu --cd /home/gilhooleyp/projects/ferret -e sh -lc 'npm run build'
```

Expected:

- `npm test`: all test files pass.
- `npm run build`: TypeScript and Vite build pass. Existing large bundle warning is acceptable.

- [ ] **Step 5: Commit docs**

```bash
git add README.md public/models/CREDITS.md .gitignore
git commit -m "docs: document wardrobe controls and credits"
```

---

## Final Acceptance Checklist

- [ ] The app has a six-slot wardrobe UI: Head, Face, Neck, Body, Back, Feet.
- [ ] At least 18 wardrobe items are selectable.
- [ ] At least four shipped items are GLB-backed and have source/license metadata.
- [ ] Old v1 saved looks migrate into the v2 wardrobe shape.
- [ ] Reset, clear slot, randomize, save, and load work from the wardrobe panel.
- [ ] Registry tests validate IDs, slots, anchors, license metadata, CC-BY attribution, and GLB file existence.
- [ ] Browser verification covers wizard, pirate, royal, space, and cozy outfits.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.

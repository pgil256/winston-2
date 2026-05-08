import { create } from 'zustand';
import type { BoneId, EulerXYZ, Pose } from '../rig/types';
import { BONE_IDS, zeroPose } from '../rig/types';
import { clampRotation } from '../rig/constraints';
import type { Accessories, BodyId, FeetId, HatId, NeckId } from '../accessories/types';
import { defaultAccessories } from '../accessories/types';
import type { EnvironmentId } from '../environments/types';
import { migrateLookToV2, type Look } from '../storage/looks';
import { itemsForSlot } from '../wardrobe/registry';
import type { WardrobeSelection, WardrobeSlot } from '../wardrobe/types';
import { defaultWardrobeSelection, WARDROBE_SLOTS } from '../wardrobe/types';

export interface AppState {
  pose: Pose;
  accessories: Accessories;
  wardrobe: WardrobeSelection;
  environment: EnvironmentId;

  setBoneRotation: (id: BoneId, rotation: EulerXYZ) => void;
  setPose: (pose: Pose) => void;
  resetPose: () => void;

  setHat: (id: HatId) => void;
  setNeck: (id: NeckId) => void;
  setBody: (id: BodyId) => void;
  setFeet: (id: FeetId) => void;
  resetAccessories: () => void;

  setWardrobeItem: (slot: WardrobeSlot, id: string) => void;
  clearWardrobeSlot: (slot: WardrobeSlot) => void;
  resetWardrobe: () => void;
  randomizeWardrobe: () => void;

  setEnvironment: (id: EnvironmentId) => void;

  applyLook: (look: Look) => void;

  resetAll: () => void;
}

const HAT_ID_MAP: Record<HatId, WardrobeSelection['head']> = {
  none: 'none',
  top: 'top-hat',
  party: 'party-hat',
  witch: 'witch-hat',
  cowboy: 'cowboy-hat',
};

const NECK_ID_MAP: Record<NeckId, WardrobeSelection['neck']> = {
  none: 'none',
  bowtie: 'bowtie',
  collar: 'collar',
  scarf: 'scarf',
};

const BODY_ID_MAP: Record<BodyId, Pick<WardrobeSelection, 'body' | 'back'>> = {
  none: { body: 'none', back: 'none' },
  sweater: { body: 'sweater', back: 'none' },
  cape: { body: 'none', back: 'cape' },
  tutu: { body: 'tutu', back: 'none' },
};

const FEET_ID_MAP: Record<FeetId, WardrobeSelection['feet']> = {
  none: 'none',
  socks: 'socks',
  boots: 'boots',
};

function legacyAccessoriesFromWardrobe(wardrobe: WardrobeSelection): Accessories {
  return {
    head: wardrobe.head === 'top-hat' ? 'top' : wardrobe.head === 'party-hat' ? 'party' : wardrobe.head === 'witch-hat' ? 'witch' : wardrobe.head === 'cowboy-hat' ? 'cowboy' : 'none',
    neck: wardrobe.neck === 'bowtie' || wardrobe.neck === 'collar' || wardrobe.neck === 'scarf' ? wardrobe.neck : 'none',
    body: wardrobe.back === 'cape' ? 'cape' : wardrobe.body === 'sweater' ? 'sweater' : wardrobe.body === 'tutu' ? 'tutu' : 'none',
    feet: wardrobe.feet === 'socks' || wardrobe.feet === 'boots' ? wardrobe.feet : 'none',
  };
}

export const useAppStore = create<AppState>((set) => ({
  pose: zeroPose(),
  accessories: defaultAccessories(),
  wardrobe: defaultWardrobeSelection(),
  environment: 'studio',

  setBoneRotation: (id, rotation) =>
    set((state) => ({ pose: { ...state.pose, [id]: clampRotation(id, rotation) } })),

  setPose: (pose) => {
    const clamped = {} as Record<BoneId, EulerXYZ>;
    for (const id of BONE_IDS) clamped[id] = clampRotation(id, pose[id]);
    set({ pose: clamped });
  },

  resetPose: () => set({ pose: zeroPose() }),

  setHat: (id) =>
    set((s) => ({
      accessories: { ...s.accessories, head: id },
      wardrobe: { ...s.wardrobe, head: HAT_ID_MAP[id] },
    })),
  setNeck: (id) =>
    set((s) => ({
      accessories: { ...s.accessories, neck: id },
      wardrobe: { ...s.wardrobe, neck: NECK_ID_MAP[id] },
    })),
  setBody: (id) =>
    set((s) => ({
      accessories: { ...s.accessories, body: id },
      wardrobe: { ...s.wardrobe, ...BODY_ID_MAP[id] },
    })),
  setFeet: (id) =>
    set((s) => ({
      accessories: { ...s.accessories, feet: id },
      wardrobe: { ...s.wardrobe, feet: FEET_ID_MAP[id] },
    })),

  resetAccessories: () => set({ accessories: defaultAccessories(), wardrobe: defaultWardrobeSelection() }),

  setWardrobeItem: (slot, id) =>
    set((s) => ({ wardrobe: { ...s.wardrobe, [slot]: id } })),

  clearWardrobeSlot: (slot) =>
    set((s) => ({ wardrobe: { ...s.wardrobe, [slot]: 'none' } })),

  resetWardrobe: () => set({ wardrobe: defaultWardrobeSelection() }),

  randomizeWardrobe: () =>
    set(() => {
      const wardrobe = defaultWardrobeSelection();
      for (const slot of WARDROBE_SLOTS) {
        const candidates = ['none', ...itemsForSlot(slot).map((item) => item.id)];
        wardrobe[slot] = candidates[Math.floor(Math.random() * candidates.length)] ?? 'none';
      }
      return { wardrobe };
    }),

  setEnvironment: (id) => set({ environment: id }),

  applyLook: (look) => {
    const migrated = migrateLookToV2(look);
    const clamped = {} as Pose;
    for (const id of BONE_IDS) clamped[id] = clampRotation(id, migrated.pose[id]);
    set({
      pose: clamped,
      accessories: legacyAccessoriesFromWardrobe(migrated.wardrobe),
      wardrobe: { ...migrated.wardrobe },
      environment: migrated.environment,
    });
  },

  resetAll: () =>
    set({
      pose: zeroPose(),
      accessories: defaultAccessories(),
      wardrobe: defaultWardrobeSelection(),
      environment: 'studio',
    }),
}));

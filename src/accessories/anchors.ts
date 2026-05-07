import type { BoneId } from '../rig/types';

export type AccessorySlot = 'head' | 'neck' | 'body' | 'feet';

// Bones that anchor each accessory slot. The `feet` slot binds to all four paws/feet
// so that a single accessory selection produces one mesh per limb tip.
export const SLOT_ANCHORS: Readonly<Record<AccessorySlot, readonly BoneId[]>> = {
  head: ['head'],
  neck: ['neck'],
  body: ['spine_upper'],
  feet: ['paw_L', 'paw_R', 'foot_L', 'foot_R'],
};

export const ALL_SLOTS: readonly AccessorySlot[] = ['head', 'neck', 'body', 'feet'] as const;

// Reverse lookup: which slot does a given bone anchor (if any)?
const SLOT_FOR_BONE: Map<BoneId, AccessorySlot> = (() => {
  const m = new Map<BoneId, AccessorySlot>();
  for (const slot of ALL_SLOTS) {
    for (const bone of SLOT_ANCHORS[slot]) m.set(bone, slot);
  }
  return m;
})();

export function getSlotForBone(boneId: BoneId): AccessorySlot | null {
  return SLOT_FOR_BONE.get(boneId) ?? null;
}

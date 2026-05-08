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

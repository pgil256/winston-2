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

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

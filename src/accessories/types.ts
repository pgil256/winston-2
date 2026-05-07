export const HAT_OPTIONS = ['none', 'top', 'party', 'witch', 'cowboy'] as const;
export type HatId = (typeof HAT_OPTIONS)[number];

export const NECK_OPTIONS = ['none', 'bowtie', 'collar', 'scarf'] as const;
export type NeckId = (typeof NECK_OPTIONS)[number];

export const BODY_OPTIONS = ['none', 'sweater', 'cape', 'tutu'] as const;
export type BodyId = (typeof BODY_OPTIONS)[number];

export const FEET_OPTIONS = ['none', 'socks', 'boots'] as const;
export type FeetId = (typeof FEET_OPTIONS)[number];

export interface Accessories {
  head: HatId;
  neck: NeckId;
  body: BodyId;
  feet: FeetId;
}

export function defaultAccessories(): Accessories {
  return { head: 'none', neck: 'none', body: 'none', feet: 'none' };
}

import type { BoneId } from '../rig/types';

export interface Palette {
  readonly cream: string;
  readonly lightBrown: string;
  readonly darkBrown: string;
  readonly accent: string;
}

// Classic sable ferret palette: cream underside, light/medium brown back and head,
// dark brown mask, limbs, and tail tip.
export const SABLE_PALETTE: Palette = {
  cream: '#d8c4a0',
  lightBrown: '#8b6a44',
  darkBrown: '#3a2615',
  accent: '#5a382a',
};

export type PaletteRole = keyof Palette;

export const BONE_ROLES: Readonly<Record<BoneId, PaletteRole | null>> = {
  root: null,

  pelvis: 'cream',

  spine_lower: 'lightBrown',
  spine_upper: 'lightBrown',
  neck: 'lightBrown',
  head: 'lightBrown',
  ear_L: 'darkBrown',
  ear_R: 'darkBrown',
  snout: 'darkBrown',

  shoulder_L: 'lightBrown',
  upper_arm_L: 'darkBrown',
  forearm_L: 'darkBrown',
  paw_L: 'darkBrown',

  shoulder_R: 'lightBrown',
  upper_arm_R: 'darkBrown',
  forearm_R: 'darkBrown',
  paw_R: 'darkBrown',

  hip_L: 'lightBrown',
  thigh_L: 'darkBrown',
  shin_L: 'darkBrown',
  foot_L: 'darkBrown',

  hip_R: 'lightBrown',
  thigh_R: 'darkBrown',
  shin_R: 'darkBrown',
  foot_R: 'darkBrown',

  tail_1: 'lightBrown',
  tail_2: 'lightBrown',
  tail_3: 'darkBrown',
  tail_4: 'darkBrown',
};

export function getBoneColor(boneId: BoneId, palette: Palette = SABLE_PALETTE): string {
  const role = BONE_ROLES[boneId];
  if (role === null) return '#888888';
  return palette[role];
}

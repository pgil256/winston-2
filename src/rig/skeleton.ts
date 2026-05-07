import type { BoneId } from './types';
import { BONE_IDS } from './types';

export type Vec3 = readonly [number, number, number];

// Mesh primitive attached to a bone.
// `direction` is a unit vector in bone-local space along which the capsule/cone extends
// from the bone origin. The visible segment occupies length units along that direction.
export type BonePrimitive =
  | { shape: 'capsule'; length: number; radius: number; direction: Vec3 }
  | { shape: 'sphere'; radius: number; offset?: Vec3 }
  | { shape: 'cone'; length: number; radius: number; direction: Vec3 }
  | { shape: 'none' };

export interface BoneDef {
  readonly id: BoneId;
  readonly parent: BoneId | null;
  // Offset from parent bone's origin, expressed in parent's local frame.
  readonly offset: Vec3;
  readonly primitive: BonePrimitive;
}

// Bone-local frames are world-aligned at zero rotation. T-pose has arms extending
// along world ±X and legs along -Y. Head extends along +Z (front of the body).
//
// Proportions are tuned for a recognisable ferret silhouette: long tubular body,
// short legs, small head with pointed snout, long tapering tail.
export const SKELETON: Readonly<Record<BoneId, BoneDef>> = {
  root: {
    id: 'root',
    parent: null,
    offset: [0, 0, 0],
    primitive: { shape: 'none' },
  },

  pelvis: {
    id: 'pelvis',
    parent: 'root',
    offset: [0, 0.18, 0],
    primitive: { shape: 'sphere', radius: 0.06 },
  },

  spine_lower: {
    id: 'spine_lower',
    parent: 'pelvis',
    offset: [0, 0.02, 0.04],
    primitive: { shape: 'capsule', length: 0.22, radius: 0.058, direction: [0, 0, 1] },
  },

  spine_upper: {
    id: 'spine_upper',
    parent: 'spine_lower',
    offset: [0, 0, 0.22],
    primitive: { shape: 'capsule', length: 0.22, radius: 0.06, direction: [0, 0, 1] },
  },

  neck: {
    id: 'neck',
    parent: 'spine_upper',
    offset: [0, 0.04, 0.22],
    primitive: { shape: 'capsule', length: 0.06, radius: 0.04, direction: [0, 0, 1] },
  },

  head: {
    id: 'head',
    parent: 'neck',
    offset: [0, 0.02, 0.06],
    primitive: { shape: 'sphere', radius: 0.07, offset: [0, 0, 0.04] },
  },

  ear_L: {
    id: 'ear_L',
    parent: 'head',
    offset: [0.05, 0.07, 0.02],
    primitive: { shape: 'cone', length: 0.04, radius: 0.022, direction: [0, 1, 0] },
  },

  ear_R: {
    id: 'ear_R',
    parent: 'head',
    offset: [-0.05, 0.07, 0.02],
    primitive: { shape: 'cone', length: 0.04, radius: 0.022, direction: [0, 1, 0] },
  },

  snout: {
    id: 'snout',
    parent: 'head',
    offset: [0, -0.015, 0.09],
    primitive: { shape: 'cone', length: 0.07, radius: 0.028, direction: [0, 0, 1] },
  },

  shoulder_L: {
    id: 'shoulder_L',
    parent: 'spine_upper',
    offset: [0.055, -0.005, 0.18],
    primitive: { shape: 'sphere', radius: 0.032 },
  },

  upper_arm_L: {
    id: 'upper_arm_L',
    parent: 'shoulder_L',
    offset: [0, 0, 0],
    primitive: { shape: 'capsule', length: 0.09, radius: 0.025, direction: [1, 0, 0] },
  },

  forearm_L: {
    id: 'forearm_L',
    parent: 'upper_arm_L',
    offset: [0.09, 0, 0],
    primitive: { shape: 'capsule', length: 0.08, radius: 0.022, direction: [1, 0, 0] },
  },

  paw_L: {
    id: 'paw_L',
    parent: 'forearm_L',
    offset: [0.08, 0, 0],
    primitive: { shape: 'sphere', radius: 0.025 },
  },

  shoulder_R: {
    id: 'shoulder_R',
    parent: 'spine_upper',
    offset: [-0.055, -0.005, 0.18],
    primitive: { shape: 'sphere', radius: 0.032 },
  },

  upper_arm_R: {
    id: 'upper_arm_R',
    parent: 'shoulder_R',
    offset: [0, 0, 0],
    primitive: { shape: 'capsule', length: 0.09, radius: 0.025, direction: [-1, 0, 0] },
  },

  forearm_R: {
    id: 'forearm_R',
    parent: 'upper_arm_R',
    offset: [-0.09, 0, 0],
    primitive: { shape: 'capsule', length: 0.08, radius: 0.022, direction: [-1, 0, 0] },
  },

  paw_R: {
    id: 'paw_R',
    parent: 'forearm_R',
    offset: [-0.08, 0, 0],
    primitive: { shape: 'sphere', radius: 0.025 },
  },

  hip_L: {
    id: 'hip_L',
    parent: 'pelvis',
    offset: [0.05, -0.01, -0.03],
    primitive: { shape: 'sphere', radius: 0.034 },
  },

  thigh_L: {
    id: 'thigh_L',
    parent: 'hip_L',
    offset: [0, 0, 0],
    primitive: { shape: 'capsule', length: 0.085, radius: 0.028, direction: [0, -1, 0] },
  },

  shin_L: {
    id: 'shin_L',
    parent: 'thigh_L',
    offset: [0, -0.085, 0],
    primitive: { shape: 'capsule', length: 0.075, radius: 0.024, direction: [0, -1, 0] },
  },

  foot_L: {
    id: 'foot_L',
    parent: 'shin_L',
    offset: [0, -0.075, 0],
    primitive: { shape: 'capsule', length: 0.05, radius: 0.022, direction: [0, 0, 1] },
  },

  hip_R: {
    id: 'hip_R',
    parent: 'pelvis',
    offset: [-0.05, -0.01, -0.03],
    primitive: { shape: 'sphere', radius: 0.034 },
  },

  thigh_R: {
    id: 'thigh_R',
    parent: 'hip_R',
    offset: [0, 0, 0],
    primitive: { shape: 'capsule', length: 0.085, radius: 0.028, direction: [0, -1, 0] },
  },

  shin_R: {
    id: 'shin_R',
    parent: 'thigh_R',
    offset: [0, -0.085, 0],
    primitive: { shape: 'capsule', length: 0.075, radius: 0.024, direction: [0, -1, 0] },
  },

  foot_R: {
    id: 'foot_R',
    parent: 'shin_R',
    offset: [0, -0.075, 0],
    primitive: { shape: 'capsule', length: 0.05, radius: 0.022, direction: [0, 0, 1] },
  },

  tail_1: {
    id: 'tail_1',
    parent: 'pelvis',
    offset: [0, 0.025, -0.05],
    primitive: { shape: 'capsule', length: 0.14, radius: 0.04, direction: [0, 0, -1] },
  },

  tail_2: {
    id: 'tail_2',
    parent: 'tail_1',
    offset: [0, 0, -0.14],
    primitive: { shape: 'capsule', length: 0.12, radius: 0.032, direction: [0, 0, -1] },
  },

  tail_3: {
    id: 'tail_3',
    parent: 'tail_2',
    offset: [0, 0, -0.12],
    primitive: { shape: 'capsule', length: 0.1, radius: 0.025, direction: [0, 0, -1] },
  },

  tail_4: {
    id: 'tail_4',
    parent: 'tail_3',
    offset: [0, 0, -0.1],
    primitive: { shape: 'capsule', length: 0.085, radius: 0.018, direction: [0, 0, -1] },
  },
};

// Children index: parent -> ordered list of direct children.
export const SKELETON_CHILDREN: Readonly<Record<BoneId, readonly BoneId[]>> = (() => {
  const out: Record<BoneId, BoneId[]> = {} as Record<BoneId, BoneId[]>;
  for (const id of BONE_IDS) out[id] = [];
  for (const id of BONE_IDS) {
    const def = SKELETON[id];
    if (def.parent !== null) out[def.parent].push(id);
  }
  return out;
})();

export const ROOT_BONE: BoneId = 'root';

export const BONE_IDS = [
  'root',
  'pelvis',
  'spine_lower',
  'spine_upper',
  'neck',
  'head',
  'ear_L',
  'ear_R',
  'snout',
  'shoulder_L',
  'upper_arm_L',
  'forearm_L',
  'paw_L',
  'shoulder_R',
  'upper_arm_R',
  'forearm_R',
  'paw_R',
  'hip_L',
  'thigh_L',
  'shin_L',
  'foot_L',
  'hip_R',
  'thigh_R',
  'shin_R',
  'foot_R',
  'tail_1',
  'tail_2',
  'tail_3',
  'tail_4',
] as const;

export type BoneId = (typeof BONE_IDS)[number];

export type EulerXYZ = readonly [number, number, number];

export type Pose = Record<BoneId, EulerXYZ>;

export function zeroPose(): Pose {
  const p = {} as Record<BoneId, EulerXYZ>;
  for (const id of BONE_IDS) p[id] = [0, 0, 0];
  return p;
}

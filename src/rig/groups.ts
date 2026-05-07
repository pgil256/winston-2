import type { BoneId } from './types';

export const BONE_GROUPS = [
  {
    id: 'head',
    label: 'Head',
    bones: ['neck', 'head', 'ear_L', 'ear_R', 'snout'] as const,
  },
  {
    id: 'spine',
    label: 'Spine',
    bones: ['pelvis', 'spine_lower', 'spine_upper'] as const,
  },
  {
    id: 'arms',
    label: 'Arms',
    bones: [
      'shoulder_L',
      'upper_arm_L',
      'forearm_L',
      'paw_L',
      'shoulder_R',
      'upper_arm_R',
      'forearm_R',
      'paw_R',
    ] as const,
  },
  {
    id: 'legs',
    label: 'Legs',
    bones: [
      'hip_L',
      'thigh_L',
      'shin_L',
      'foot_L',
      'hip_R',
      'thigh_R',
      'shin_R',
      'foot_R',
    ] as const,
  },
  {
    id: 'tail',
    label: 'Tail',
    bones: ['tail_1', 'tail_2', 'tail_3', 'tail_4'] as const,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  bones: readonly BoneId[];
}>;

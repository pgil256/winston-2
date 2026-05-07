import type { BoneId, EulerXYZ, Pose } from './types';
import { zeroPose } from './types';
import { clampRotation } from './constraints';

export const PRESET_IDS = ['t-pose', 'stand', 'sit', 'pounce', 'sleep', 'war-dance'] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export const PRESET_LABELS: Record<PresetId, string> = {
  't-pose': 'T-pose',
  stand: 'Stand',
  sit: 'Sit',
  pounce: 'Pounce',
  sleep: 'Sleep',
  'war-dance': 'War-dance',
};

type Overrides = Partial<Record<BoneId, EulerXYZ>>;

const PI = Math.PI;

// Sparse overrides on top of the all-zero pose. Bones not listed stay at [0,0,0].
const PRESET_OVERRIDES: Record<PresetId, Overrides> = {
  't-pose': {},

  stand: {
    upper_arm_L: [0, 0, -PI / 2],
    upper_arm_R: [0, 0, PI / 2],
  },

  sit: {
    spine_lower: [-PI / 3, 0, 0],
    spine_upper: [-PI / 12, 0, 0],
    neck: [PI / 8, 0, 0],
    head: [PI / 8, 0, 0],
    thigh_L: [-PI / 4, 0, 0],
    thigh_R: [-PI / 4, 0, 0],
    shin_L: [-PI / 3, 0, 0],
    shin_R: [-PI / 3, 0, 0],
    upper_arm_L: [0, 0, -PI / 2.5],
    upper_arm_R: [0, 0, PI / 2.5],
    forearm_L: [0, -PI / 6, 0],
    forearm_R: [0, PI / 6, 0],
    tail_1: [-PI / 8, 0, 0],
  },

  pounce: {
    spine_lower: [PI / 10, 0, 0],
    spine_upper: [PI / 8, 0, 0],
    neck: [-PI / 4, 0, 0],
    head: [-PI / 8, 0, 0],
    thigh_L: [PI / 8, 0, 0],
    thigh_R: [PI / 8, 0, 0],
    shin_L: [-PI / 4, 0, 0],
    shin_R: [-PI / 4, 0, 0],
    upper_arm_L: [0, -PI / 6, -PI / 2],
    upper_arm_R: [0, PI / 6, PI / 2],
    tail_1: [-PI / 12, 0, 0],
  },

  sleep: {
    pelvis: [0, 0, PI / 8],
    spine_lower: [0, 0, PI / 6],
    spine_upper: [0, 0, PI / 6],
    neck: [PI / 4, 0, PI / 6],
    head: [PI / 4, 0, 0],
    tail_1: [0, PI / 2, 0],
    tail_2: [0, PI / 3, 0],
    tail_3: [0, PI / 4, 0],
    tail_4: [0, PI / 6, 0],
    upper_arm_L: [0, 0, -PI / 2],
    upper_arm_R: [0, 0, PI / 2],
    forearm_L: [0, -PI / 6, 0],
    forearm_R: [0, PI / 6, 0],
    thigh_L: [-PI / 3, 0, PI / 6],
    thigh_R: [-PI / 3, 0, -PI / 6],
    shin_L: [-PI / 3, 0, 0],
    shin_R: [-PI / 3, 0, 0],
  },

  'war-dance': {
    spine_upper: [-PI / 5, 0, 0],
    neck: [-PI / 6, 0, 0],
    head: [-PI / 12, 0, 0],
    tail_1: [-PI / 3, 0, 0],
    tail_2: [-PI / 4, 0, 0],
    tail_3: [-PI / 6, 0, 0],
    upper_arm_L: [-PI / 4, 0, -PI / 2.5],
    upper_arm_R: [-PI / 4, 0, PI / 2.5],
    forearm_L: [0, -PI / 4, 0],
    forearm_R: [0, PI / 4, 0],
    thigh_L: [PI / 6, 0, PI / 12],
    thigh_R: [-PI / 6, 0, -PI / 12],
    shin_L: [-PI / 6, 0, 0],
    shin_R: [-PI / 6, 0, 0],
  },
};

export function getPresetPose(id: PresetId): Pose {
  const pose = zeroPose();
  const overrides = PRESET_OVERRIDES[id];
  for (const key of Object.keys(overrides) as BoneId[]) {
    const rot = overrides[key];
    if (rot !== undefined) pose[key] = clampRotation(key, rot);
  }
  return pose;
}

import type { BoneId, EulerXYZ } from './types';

export interface AxisRange {
  readonly min: number;
  readonly max: number;
}

export interface BoneConstraint {
  readonly x: AxisRange;
  readonly y: AxisRange;
  readonly z: AxisRange;
}

const D2R = Math.PI / 180;

function deg(minDeg: number, maxDeg: number): AxisRange {
  return { min: minDeg * D2R, max: maxDeg * D2R };
}

function sym(degAmount: number): AxisRange {
  return deg(-degAmount, degAmount);
}

function box(xDeg: number, yDeg: number, zDeg: number): BoneConstraint {
  return { x: sym(xDeg), y: sym(yDeg), z: sym(zDeg) };
}

const FREE: BoneConstraint = box(180, 180, 180);
const TINY: BoneConstraint = box(5, 5, 5);
const SMALL: BoneConstraint = box(20, 20, 20);

// Anatomically plausible ranges. Defaults err on the generous side; users can
// still pose the ferret into expressive shapes without clipping into impossibility.
export const CONSTRAINTS: Readonly<Record<BoneId, BoneConstraint>> = {
  root: FREE,

  pelvis: box(20, 20, 20),
  spine_lower: box(25, 25, 25),
  spine_upper: box(25, 25, 25),

  neck: { x: sym(60), y: sym(90), z: sym(30) },
  head: { x: sym(30), y: sym(45), z: sym(20) },
  ear_L: SMALL,
  ear_R: SMALL,
  snout: TINY,

  shoulder_L: box(90, 90, 90),
  upper_arm_L: { x: sym(120), y: sym(120), z: sym(90) },
  forearm_L: { x: sym(150), y: sym(150), z: sym(90) },
  paw_L: box(30, 30, 30),

  shoulder_R: box(90, 90, 90),
  upper_arm_R: { x: sym(120), y: sym(120), z: sym(90) },
  forearm_R: { x: sym(150), y: sym(150), z: sym(90) },
  paw_R: box(30, 30, 30),

  hip_L: { x: sym(60), y: sym(60), z: sym(90) },
  thigh_L: { x: sym(90), y: sym(60), z: sym(60) },
  shin_L: { x: deg(-150, 5), y: sym(20), z: sym(20) },
  foot_L: box(30, 20, 20),

  hip_R: { x: sym(60), y: sym(60), z: sym(90) },
  thigh_R: { x: sym(90), y: sym(60), z: sym(60) },
  shin_R: { x: deg(-150, 5), y: sym(20), z: sym(20) },
  foot_R: box(30, 20, 20),

  tail_1: { x: sym(45), y: sym(60), z: sym(30) },
  tail_2: { x: sym(45), y: sym(60), z: sym(30) },
  tail_3: { x: sym(45), y: sym(60), z: sym(30) },
  tail_4: { x: sym(45), y: sym(60), z: sym(30) },
};

function clampNum(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function clampRotation(boneId: BoneId, rotation: EulerXYZ): EulerXYZ {
  const c = CONSTRAINTS[boneId];
  return [
    clampNum(rotation[0], c.x.min, c.x.max),
    clampNum(rotation[1], c.y.min, c.y.max),
    clampNum(rotation[2], c.z.min, c.z.max),
  ] as const;
}

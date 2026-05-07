import { describe, expect, it } from 'vitest';
import { PRESET_IDS, getPresetPose } from './presets';
import { BONE_IDS } from './types';
import { CONSTRAINTS } from './constraints';

describe('presets', () => {
  it('t-pose is identically zero', () => {
    const pose = getPresetPose('t-pose');
    for (const id of BONE_IDS) {
      expect(pose[id]).toEqual([0, 0, 0]);
    }
  });

  it('every preset returns a full pose with an entry for every bone', () => {
    for (const preset of PRESET_IDS) {
      const pose = getPresetPose(preset);
      for (const id of BONE_IDS) {
        expect(pose[id]).toBeDefined();
        expect(pose[id]).toHaveLength(3);
      }
    }
  });

  it('every preset rotation is within constraint range (clamped on read)', () => {
    for (const preset of PRESET_IDS) {
      const pose = getPresetPose(preset);
      for (const id of BONE_IDS) {
        const rot = pose[id];
        const c = CONSTRAINTS[id];
        expect(rot[0]).toBeGreaterThanOrEqual(c.x.min);
        expect(rot[0]).toBeLessThanOrEqual(c.x.max);
        expect(rot[1]).toBeGreaterThanOrEqual(c.y.min);
        expect(rot[1]).toBeLessThanOrEqual(c.y.max);
        expect(rot[2]).toBeGreaterThanOrEqual(c.z.min);
        expect(rot[2]).toBeLessThanOrEqual(c.z.max);
      }
    }
  });

  it('non-trivial presets differ from t-pose for at least one bone', () => {
    const tPose = getPresetPose('t-pose');
    const nonTrivial = PRESET_IDS.filter((id) => id !== 't-pose');
    for (const id of nonTrivial) {
      const pose = getPresetPose(id);
      const differs = BONE_IDS.some(
        (b) =>
          pose[b][0] !== tPose[b][0] ||
          pose[b][1] !== tPose[b][1] ||
          pose[b][2] !== tPose[b][2],
      );
      expect(differs, `preset ${id} should differ from t-pose`).toBe(true);
    }
  });
});

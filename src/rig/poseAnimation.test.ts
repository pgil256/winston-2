import { describe, expect, it, beforeEach } from 'vitest';
import { startPoseLerp, tickPoseLerp, isLerping, cancelPoseLerp } from './poseAnimation';
import { useAppStore } from '../store/appStore';
import { getPresetPose } from './presets';
import { zeroPose } from './types';

describe('poseAnimation', () => {
  beforeEach(() => {
    useAppStore.getState().resetAll();
    cancelPoseLerp();
  });

  it('starts and ends a lerp over the requested duration', () => {
    const target = getPresetPose('stand');
    startPoseLerp(target, 400, 1000);
    expect(isLerping()).toBe(true);

    tickPoseLerp(1200); // halfway
    expect(isLerping()).toBe(true);
    const mid = useAppStore.getState().pose.upper_arm_L;
    expect(Math.abs(mid[2])).toBeGreaterThan(0);
    expect(Math.abs(mid[2])).toBeLessThan(Math.abs(target.upper_arm_L[2]));

    tickPoseLerp(1400); // finished
    expect(isLerping()).toBe(false);
    const finalRot = useAppStore.getState().pose.upper_arm_L;
    expect(finalRot[2]).toBeCloseTo(target.upper_arm_L[2], 6);
  });

  it('lerps from current pose, not from zero', () => {
    useAppStore.getState().setPose(getPresetPose('sit'));
    const target = getPresetPose('stand');
    startPoseLerp(target, 400, 5000);
    tickPoseLerp(5000); // t=0
    const startRot = useAppStore.getState().pose.spine_lower;
    const sitRot = getPresetPose('sit').spine_lower;
    expect(startRot[0]).toBeCloseTo(sitRot[0], 6);
  });

  it('clamps t to 1 when ticked past end', () => {
    startPoseLerp(zeroPose(), 400, 0);
    tickPoseLerp(10000);
    expect(isLerping()).toBe(false);
  });

  it('cancelPoseLerp halts the animation', () => {
    startPoseLerp(getPresetPose('sit'), 400, 0);
    cancelPoseLerp();
    expect(isLerping()).toBe(false);
  });
});

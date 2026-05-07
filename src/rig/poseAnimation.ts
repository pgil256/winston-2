import type { Pose } from './types';
import { BONE_IDS } from './types';
import { useAppStore } from '../store/appStore';

interface AnimState {
  from: Pose;
  to: Pose;
  startMs: number;
  duration: number;
}

let active: AnimState | null = null;

// Snapshot the current pose so concurrent slider edits before the start frame
// do not bleed into the lerp source.
function snapshotPose(p: Pose): Pose {
  const out = {} as Pose;
  for (const id of BONE_IDS) {
    const r = p[id];
    out[id] = [r[0], r[1], r[2]];
  }
  return out;
}

export function startPoseLerp(target: Pose, durationMs = 400, nowMs: number = performance.now()): void {
  active = {
    from: snapshotPose(useAppStore.getState().pose),
    to: snapshotPose(target),
    startMs: nowMs,
    duration: durationMs,
  };
}

export function cancelPoseLerp(): void {
  active = null;
}

export function isLerping(): boolean {
  return active !== null;
}

export function tickPoseLerp(nowMs: number): void {
  if (active === null) return;
  const t = Math.min(1, (nowMs - active.startMs) / active.duration);
  const eased = easeInOutCubic(t);
  const next = {} as Pose;
  for (const id of BONE_IDS) {
    const f = active.from[id];
    const u = active.to[id];
    next[id] = [
      f[0] + (u[0] - f[0]) * eased,
      f[1] + (u[1] - f[1]) * eased,
      f[2] + (u[2] - f[2]) * eased,
    ];
  }
  useAppStore.setState({ pose: next });
  if (t >= 1) active = null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

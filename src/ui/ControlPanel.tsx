import { useEffect } from 'react';
import { button, folder, useControls } from 'leva';
import { useAppStore } from '../store/appStore';
import { ENVIRONMENT_IDS, ENVIRONMENT_LABELS } from '../environments/types';
import {
  HAT_OPTIONS,
  NECK_OPTIONS,
  BODY_OPTIONS,
  FEET_OPTIONS,
} from '../accessories/types';
import { PRESET_IDS, PRESET_LABELS, getPresetPose } from '../rig/presets';
import { startPoseLerp, cancelPoseLerp } from '../rig/poseAnimation';
import { BONE_GROUPS } from '../rig/groups';
import { CONSTRAINTS } from '../rig/constraints';
import type { BoneId, EulerXYZ, Pose } from '../rig/types';
import type { BodyId, FeetId, HatId, NeckId } from '../accessories/types';

const AXES = [0, 1, 2] as const;
const AXIS_LABELS = ['x', 'y', 'z'] as const;

type LevaSchema = Parameters<typeof folder>[0];

function buildPoseFolders(): LevaSchema {
  const out: Record<string, ReturnType<typeof folder>> = {};
  for (const group of BONE_GROUPS) {
    const schema: Record<string, unknown> = {};
    for (const bone of group.bones) {
      const c = CONSTRAINTS[bone];
      const ranges = [c.x, c.y, c.z];
      for (const axis of AXES) {
        const range = ranges[axis]!;
        const key = `${bone} ${AXIS_LABELS[axis]}`;
        schema[key] = {
          value: 0,
          min: range.min,
          max: range.max,
          step: 0.01,
          onChange: (v: number) => {
            cancelPoseLerp();
            const current = useAppStore.getState().pose[bone];
            const next: [number, number, number] = [current[0], current[1], current[2]];
            next[axis] = v;
            useAppStore.getState().setBoneRotation(bone as BoneId, next as EulerXYZ);
          },
        };
      }
    }
    out[group.label] = folder(schema as LevaSchema, { collapsed: true });
  }
  return out as LevaSchema;
}

const envOptions = Object.fromEntries(
  ENVIRONMENT_IDS.map((id) => [ENVIRONMENT_LABELS[id], id]),
);

export function ControlPanel(): null {
  const setEnvironment = useAppStore((s) => s.setEnvironment);
  const setHat = useAppStore((s) => s.setHat);
  const setNeck = useAppStore((s) => s.setNeck);
  const setBody = useAppStore((s) => s.setBody);
  const setFeet = useAppStore((s) => s.setFeet);
  const resetAll = useAppStore((s) => s.resetAll);

  const presetButtons: Record<string, ReturnType<typeof button>> = {};
  for (const id of PRESET_IDS) {
    presetButtons[PRESET_LABELS[id]] = button(() => startPoseLerp(getPresetPose(id)));
  }
  useControls('Pose Presets', presetButtons);

  const poseControls = useControls('Manual Pose', () => buildPoseFolders()) as unknown as
    | Record<string, number>
    | [Record<string, number>, (values: Record<string, number>) => void];
  const setPoseControls = Array.isArray(poseControls) ? poseControls[1] : null;

  useEffect(() => {
    if (!setPoseControls) return undefined;
    let last = useAppStore.getState().pose;
    return useAppStore.subscribe((state) => {
      if (state.pose === last) return;
      last = state.pose;
      setPoseControls(poseToSliderValues(state.pose));
    });
  }, [setPoseControls]);

  useControls('Dress Up', {
    head: {
      options: optionMap(HAT_OPTIONS),
      value: 'none' as HatId,
      onChange: (v: HatId) => setHat(v),
    },
    neck: {
      options: optionMap(NECK_OPTIONS),
      value: 'none' as NeckId,
      onChange: (v: NeckId) => setNeck(v),
    },
    body: {
      options: optionMap(BODY_OPTIONS),
      value: 'none' as BodyId,
      onChange: (v: BodyId) => setBody(v),
    },
    feet: {
      options: optionMap(FEET_OPTIONS),
      value: 'none' as FeetId,
      onChange: (v: FeetId) => setFeet(v),
    },
  });

  useControls('Environment', {
    scene: {
      options: envOptions,
      value: 'studio',
      onChange: (v: string) => setEnvironment(v as never),
    },
  });

  useControls('Save / Load Look', {
    name: { value: 'my-look' },
    Save: button(() => {
      // wired in a later task
    }),
    Load: button(() => {}),
    Reset: button(() => resetAll()),
  });

  return null;
}

function optionMap<T extends string>(values: readonly T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const v of values) out[v] = v;
  return out;
}

function poseToSliderValues(pose: Pose): Record<string, number> {
  const out: Record<string, number> = {};
  for (const group of BONE_GROUPS) {
    for (const bone of group.bones) {
      for (const axis of AXES) {
        out[`${bone} ${AXIS_LABELS[axis]}`] = pose[bone][axis];
      }
    }
  }
  return out;
}

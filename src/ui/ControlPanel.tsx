import { button, folder, useControls } from 'leva';
import { useAppStore } from '../store/appStore';
import { ENVIRONMENT_IDS, ENVIRONMENT_LABELS } from '../environments/types';
import {
  HAT_OPTIONS,
  NECK_OPTIONS,
  BODY_OPTIONS,
  FEET_OPTIONS,
} from '../accessories/types';

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
  const resetPose = useAppStore((s) => s.resetPose);

  useControls('Pose Presets', {
    'T-pose': button(() => resetPose()),
    sit: button(() => {
      // wired in a later task
    }),
    stand: button(() => {}),
    pounce: button(() => {}),
    sleep: button(() => {}),
    'war-dance': button(() => {}),
  });

  useControls('Manual Pose', {
    Head: folder({}, { collapsed: true }),
    Spine: folder({}, { collapsed: true }),
    Arms: folder({}, { collapsed: true }),
    Legs: folder({}, { collapsed: true }),
    Tail: folder({}, { collapsed: true }),
  });

  useControls('Dress Up', {
    head: {
      options: optionMap(HAT_OPTIONS),
      value: 'none',
      onChange: (v: string) => setHat(v as never),
    },
    neck: {
      options: optionMap(NECK_OPTIONS),
      value: 'none',
      onChange: (v: string) => setNeck(v as never),
    },
    body: {
      options: optionMap(BODY_OPTIONS),
      value: 'none',
      onChange: (v: string) => setBody(v as never),
    },
    feet: {
      options: optionMap(FEET_OPTIONS),
      value: 'none',
      onChange: (v: string) => setFeet(v as never),
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

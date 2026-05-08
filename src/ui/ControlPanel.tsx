import { useRef } from 'react';
import { button, useControls } from 'leva';
import { saveLook, loadLook } from '../storage/looks';
import { useAppStore } from '../store/appStore';
import { ENVIRONMENT_IDS, ENVIRONMENT_LABELS } from '../environments/types';
import {
  HAT_OPTIONS,
  NECK_OPTIONS,
  BODY_OPTIONS,
  FEET_OPTIONS,
} from '../accessories/types';
import type { BodyId, FeetId, HatId, NeckId } from '../accessories/types';

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

  const lookNameRef = useRef('my-look');
  useControls('Save / Load Look', {
    name: {
      value: 'my-look',
      onChange: (v: string) => {
        lookNameRef.current = v;
      },
    },
    Save: button(() => {
      const s = useAppStore.getState();
      saveLook(lookNameRef.current, {
        version: 1,
        pose: s.pose,
        accessories: s.accessories,
        environment: s.environment,
      });
    }),
    Load: button(() => {
      const look = loadLook(lookNameRef.current);
      if (look) useAppStore.getState().applyLook(look);
    }),
    Reset: button(() => resetAll()),
  });

  return null;
}

function optionMap<T extends string>(values: readonly T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const v of values) out[v] = v;
  return out;
}

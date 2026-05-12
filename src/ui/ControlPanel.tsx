import { useEffect } from 'react';
import { useControls } from 'leva';
import { useAppStore } from '../store/appStore';
import { ENVIRONMENT_IDS, ENVIRONMENT_LABELS, type EnvironmentId } from '../environments/types';

const envOptions = Object.fromEntries(
  ENVIRONMENT_IDS.map((id) => [ENVIRONMENT_LABELS[id], id]),
);

export function ControlPanel(): null {
  const environment = useAppStore((s) => s.environment);
  const setEnvironment = useAppStore((s) => s.setEnvironment);

  const [, setSceneCtl] = useControls(
    'Environment',
    () => ({
      scene: {
        options: envOptions,
        value: environment,
        onChange: (v: EnvironmentId) => setEnvironment(v),
      },
    }),
  );

  useEffect(() => {
    setSceneCtl({ scene: environment });
  }, [environment, setSceneCtl]);

  return null;
}

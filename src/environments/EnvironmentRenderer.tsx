import { useAppStore } from '../store/appStore';
import type { EnvironmentId } from './types';
import { Studio } from './Studio';

const ENV_COMPONENTS: Partial<Record<EnvironmentId, () => JSX.Element>> = {
  studio: Studio,
};

export function EnvironmentRenderer(): JSX.Element {
  const id = useAppStore((s) => s.environment);
  const Comp = ENV_COMPONENTS[id] ?? Studio;
  return <Comp />;
}

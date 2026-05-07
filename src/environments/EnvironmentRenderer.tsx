import { useAppStore } from '../store/appStore';
import type { EnvironmentId } from './types';
import { Studio } from './Studio';
import { Bedroom } from './Bedroom';

const ENV_COMPONENTS: Partial<Record<EnvironmentId, () => JSX.Element>> = {
  studio: Studio,
  bedroom: Bedroom,
};

export function EnvironmentRenderer(): JSX.Element {
  const id = useAppStore((s) => s.environment);
  const Comp = ENV_COMPONENTS[id] ?? Studio;
  return <Comp />;
}

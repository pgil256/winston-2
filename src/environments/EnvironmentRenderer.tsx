import { useAppStore } from '../store/appStore';
import type { EnvironmentId } from './types';
import { Studio } from './Studio';
import { Bedroom } from './Bedroom';
import { Forest } from './Forest';
import { Space } from './Space';
import { Beach } from './Beach';
import { Lab } from './Lab';

const ENV_COMPONENTS: Record<EnvironmentId, () => JSX.Element> = {
  studio: Studio,
  bedroom: Bedroom,
  forest: Forest,
  space: Space,
  beach: Beach,
  lab: Lab,
};

export function EnvironmentRenderer(): JSX.Element {
  const id = useAppStore((s) => s.environment);
  const Comp = ENV_COMPONENTS[id] ?? Studio;
  return <Comp />;
}

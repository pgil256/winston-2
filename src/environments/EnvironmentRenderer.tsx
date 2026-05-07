import { useAppStore } from '../store/appStore';
import { ENV_COMPONENTS } from './registry';

export function EnvironmentRenderer(): JSX.Element {
  const id = useAppStore((s) => s.environment);
  const Comp = ENV_COMPONENTS[id];
  return <Comp />;
}

import { Bone } from '../rig/Bone';
import { ROOT_BONE } from '../rig/skeleton';
import { PoseAnimator } from '../rig/PoseAnimator';
import { EnvironmentRenderer } from '../environments/EnvironmentRenderer';

export function Scene(): JSX.Element {
  return (
    <>
      <EnvironmentRenderer />
      <Bone boneId={ROOT_BONE} />
      <PoseAnimator />
    </>
  );
}

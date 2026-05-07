import { Lights } from './Lights';
import { GroundPlane } from './GroundPlane';
import { Bone } from '../rig/Bone';
import { ROOT_BONE } from '../rig/skeleton';

export function Scene(): JSX.Element {
  return (
    <>
      <Lights />
      <GroundPlane />
      <Bone boneId={ROOT_BONE} />
    </>
  );
}

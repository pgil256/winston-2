import { Lights } from './Lights';
import { GroundPlane } from './GroundPlane';

export function Scene(): JSX.Element {
  return (
    <>
      <Lights />
      <GroundPlane />
      <PlaceholderFerret />
    </>
  );
}

function PlaceholderFerret(): JSX.Element {
  return (
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.6, 0.6, 1.2]} />
      <meshStandardMaterial color="#8a6a4a" />
    </mesh>
  );
}

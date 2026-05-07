// Hat origin sits at the crown of the head sphere (head-local).
// The head sphere has center offset [0, 0, 0.05] and radius 0.07, so the top
// surface is approximately at (0, 0.07, 0.05) in the head bone's frame.
const ROOT_Y = 0.07;
const ROOT_Z = 0.05;

export function TopHat(): JSX.Element {
  return (
    <group position={[0, ROOT_Y, ROOT_Z]}>
      <mesh position={[0, 0.006, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.012, 28]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.012 + 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 24]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.022, 0]} castShadow>
        <cylinderGeometry args={[0.0505, 0.0505, 0.014, 24]} />
        <meshStandardMaterial color="#8b1c1c" roughness={0.6} />
      </mesh>
    </group>
  );
}

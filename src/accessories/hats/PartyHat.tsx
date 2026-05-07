const ROOT_Y = 0.07;
const ROOT_Z = 0.05;

export function PartyHat(): JSX.Element {
  const height = 0.18;
  return (
    <group position={[0, ROOT_Y, ROOT_Z]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <coneGeometry args={[0.055, height, 28]} />
        <meshStandardMaterial color="#e83a6a" roughness={0.55} />
      </mesh>
      {/* zig-zag stripes via thin tilted cones */}
      <mesh position={[0, height / 2 - 0.04, 0]} castShadow>
        <coneGeometry args={[0.045, 0.012, 28, 1, true]} />
        <meshStandardMaterial color="#fff5d9" roughness={0.6} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0]} castShadow>
        <coneGeometry args={[0.03, 0.012, 28, 1, true]} />
        <meshStandardMaterial color="#fff5d9" roughness={0.6} />
      </mesh>
      {/* pom on top */}
      <mesh position={[0, height + 0.012, 0]} castShadow>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color="#fff5d9" roughness={0.5} />
      </mesh>
    </group>
  );
}

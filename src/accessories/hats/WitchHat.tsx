const ROOT_Y = 0.07;
const ROOT_Z = 0.05;

export function WitchHat(): JSX.Element {
  return (
    <group position={[0, ROOT_Y, ROOT_Z]}>
      {/* wide flat brim */}
      <mesh position={[0, 0.005, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
        <meshStandardMaterial color="#1a0826" roughness={0.7} />
      </mesh>
      {/* tall pointy cone */}
      <mesh position={[0, 0.01 + 0.11, 0]} rotation={[0, 0, 0.08]} castShadow>
        <coneGeometry args={[0.055, 0.22, 28]} />
        <meshStandardMaterial color="#1a0826" roughness={0.7} />
      </mesh>
      {/* purple band */}
      <mesh position={[0, 0.018, 0]} castShadow>
        <cylinderGeometry args={[0.057, 0.057, 0.012, 28]} />
        <meshStandardMaterial color="#7a3ab8" roughness={0.55} />
      </mesh>
    </group>
  );
}

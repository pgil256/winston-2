export function Scarf(): JSX.Element {
  const cloth = '#3a72c4';
  return (
    <group position={[0, 0, 0.03]}>
      {/* wrap (slightly fatter torus for fluffy look) */}
      <mesh castShadow>
        <torusGeometry args={[0.055, 0.022, 14, 24]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      {/* dangling ends */}
      <mesh position={[-0.025, -0.08, 0.018]} rotation={[0.18, 0, 0.18]} castShadow>
        <boxGeometry args={[0.034, 0.14, 0.008]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      <mesh position={[0.022, -0.08, 0.024]} rotation={[0.12, 0, -0.22]} castShadow>
        <boxGeometry args={[0.030, 0.13, 0.008]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      {/* fringe tassels (small boxes at end) */}
      <mesh position={[-0.028, -0.155, 0.024]} castShadow>
        <boxGeometry args={[0.034, 0.012, 0.008]} />
        <meshStandardMaterial color="#5c8edd" roughness={0.85} />
      </mesh>
      <mesh position={[0.022, -0.150, 0.030]} castShadow>
        <boxGeometry args={[0.030, 0.012, 0.008]} />
        <meshStandardMaterial color="#5c8edd" roughness={0.85} />
      </mesh>
    </group>
  );
}

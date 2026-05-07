// Anchored to spine_upper. Body axis is local +Z, capsules need rotation X=π/2 to align.
export function Sweater(): JSX.Element {
  const yarn = '#5b8a3a';
  const trim = '#f4eecc';
  return (
    <group>
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.22, 8, 16]} />
        <meshStandardMaterial color={yarn} roughness={0.9} />
      </mesh>
      {/* contrasting collar near the neck end */}
      <mesh position={[0, 0, 0.21]}>
        <torusGeometry args={[0.055, 0.014, 10, 24]} />
        <meshStandardMaterial color={trim} roughness={0.85} />
      </mesh>
      {/* hem near the hip end */}
      <mesh position={[0, 0, -0.11]}>
        <torusGeometry args={[0.078, 0.012, 10, 24]} />
        <meshStandardMaterial color={trim} roughness={0.85} />
      </mesh>
    </group>
  );
}

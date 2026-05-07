export function Collar(): JSX.Element {
  return (
    <group position={[0, 0, 0.035]}>
      {/* collar torus around the neck (neck axis is +Z, so default torus orientation wraps it) */}
      <mesh castShadow>
        <torusGeometry args={[0.052, 0.012, 12, 24]} />
        <meshStandardMaterial color="#a52a3a" roughness={0.55} />
      </mesh>
      {/* bell hanging down */}
      <mesh position={[0, -0.058, 0]} castShadow>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color="#d4a017" metalness={0.55} roughness={0.35} />
      </mesh>
      {/* bell loop */}
      <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.005, 0.0018, 6, 12]} />
        <meshStandardMaterial color="#a07517" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

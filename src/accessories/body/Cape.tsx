import * as THREE from 'three';

export function Cape(): JSX.Element {
  const fabric = '#c41a1a';
  return (
    <group>
      {/* yellow clasp around the neck */}
      <mesh position={[0, 0.05, 0.20]}>
        <sphereGeometry args={[0.014, 16, 12]} />
        <meshStandardMaterial color="#f5b41c" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* cape: a wide plane behind the body, tilted slightly outward */}
      <mesh
        position={[0, -0.05, -0.08]}
        rotation={[Math.PI * 0.15, 0, 0]}
        castShadow
      >
        <planeGeometry args={[0.26, 0.42, 6, 8]} />
        <meshStandardMaterial
          color={fabric}
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* shoulder strap connecting clasp to cape (across upper spine) */}
      <mesh position={[0, 0.04, 0.12]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.18, 0.012, 0.02]} />
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </mesh>
    </group>
  );
}

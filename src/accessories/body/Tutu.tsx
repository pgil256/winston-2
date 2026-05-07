import * as THREE from 'three';

export function Tutu(): JSX.Element {
  // Tutu is a flat horizontal frilly disk around the waist. The body extends along
  // local +Z, so the disk lies in the XZ plane (rotated π/2 about local X).
  const tulle = '#ffb6cc';
  const layers = [
    { dy: 0, outer: 0.13 },
    { dy: 0.012, outer: 0.125 },
    { dy: -0.012, outer: 0.135 },
  ];
  return (
    <group position={[0, -0.02, -0.05]}>
      {layers.map((l, i) => (
        <mesh
          key={i}
          position={[0, l.dy, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <ringGeometry args={[0.07, l.outer, 28]} />
          <meshStandardMaterial color={tulle} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

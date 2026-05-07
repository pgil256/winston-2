import { Sky } from '@react-three/drei';
import { useMemo } from 'react';

interface Tree {
  x: number;
  z: number;
  scale: number;
  rotY: number;
  hue: number;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTrees(): Tree[] {
  const rng = mulberry32(7);
  const trees: Tree[] = [];
  for (let i = 0; i < 18; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = 1.6 + rng() * 3.2;
    trees.push({
      x: Math.cos(angle) * dist,
      z: Math.sin(angle) * dist,
      scale: 0.7 + rng() * 0.7,
      rotY: rng() * Math.PI * 2,
      hue: rng(),
    });
  }
  return trees;
}

function canopyColor(hue: number): string {
  // shift between two greens for variety
  const r = Math.round(45 + hue * 25);
  const g = Math.round(106 + hue * 30);
  const b = Math.round(42 + hue * 20);
  return `rgb(${r}, ${g}, ${b})`;
}

export function Forest(): JSX.Element {
  const trees = useMemo(buildTrees, []);
  return (
    <>
      <Sky sunPosition={[6, 4, -4]} turbidity={6} rayleigh={2} mieCoefficient={0.005} />
      <fog attach="fog" args={['#a8c0a0', 5, 22]} />

      <ambientLight intensity={0.4} color="#dde8c8" />
      <directionalLight
        position={[4, 6, 2]}
        intensity={1.0}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <hemisphereLight args={['#cbe6c0', '#3a5a28', 0.35]} />

      {/* grassy ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#4d7a35" roughness={0.95} />
      </mesh>

      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} rotation={[0, t.rotY, 0]} scale={t.scale}>
          {/* trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.8, 12]} />
            <meshStandardMaterial color="#4a3018" roughness={0.85} />
          </mesh>
          {/* canopy: stacked spheres for cluster look */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <sphereGeometry args={[0.42, 14, 10]} />
            <meshStandardMaterial color={canopyColor(t.hue)} roughness={0.9} />
          </mesh>
          <mesh position={[0.18, 1.18, 0.05]} castShadow>
            <sphereGeometry args={[0.28, 12, 10]} />
            <meshStandardMaterial color={canopyColor(t.hue * 0.7 + 0.3)} roughness={0.9} />
          </mesh>
          <mesh position={[-0.16, 1.22, -0.06]} castShadow>
            <sphereGeometry args={[0.26, 12, 10]} />
            <meshStandardMaterial color={canopyColor(t.hue * 0.5 + 0.5)} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}

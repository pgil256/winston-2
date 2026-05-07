// Cozy bedroom: wood floor, bed off to the side, warm lamp, window with sky.
export function Bedroom(): JSX.Element {
  return (
    <>
      <color attach="background" args={['#3a2a1a']} />
      <fog attach="fog" args={['#3a2a1a', 8, 22]} />

      <ambientLight intensity={0.35} color="#fff0d4" />

      {/* warm lamp key */}
      <pointLight
        position={[-0.9, 0.85, 0.6]}
        intensity={1.6}
        color="#ffc274"
        distance={5}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* cool window fill */}
      <directionalLight position={[-2.5, 2, -1.8]} intensity={0.5} color="#a8c8ff" />

      {/* wood floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#7a4f2a" roughness={0.85} />
      </mesh>

      {/* simple plank stripes by laying alternating tiles (procedural, no texture) */}
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 0.001, i * 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[14, 0.02]} />
          <meshStandardMaterial color="#5a371b" roughness={0.85} />
        </mesh>
      ))}

      {/* bed: frame, mattress, headboard, pillow */}
      <group position={[0.9, 0, -0.8]}>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.12, 0.7]} />
          <meshStandardMaterial color="#4a2f18" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.14, 0.66]} />
          <meshStandardMaterial color="#e8d8be" roughness={0.85} />
        </mesh>
        {/* blanket */}
        <mesh position={[0.1, 0.28, 0]} castShadow>
          <boxGeometry args={[0.85, 0.04, 0.65]} />
          <meshStandardMaterial color="#5a3a82" roughness={0.85} />
        </mesh>
        {/* pillow */}
        <mesh position={[-0.55, 0.30, 0]} castShadow>
          <boxGeometry args={[0.20, 0.06, 0.55]} />
          <meshStandardMaterial color="#fffaeb" roughness={0.9} />
        </mesh>
        {/* headboard */}
        <mesh position={[-0.69, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.55, 0.7]} />
          <meshStandardMaterial color="#4a2f18" roughness={0.7} />
        </mesh>
      </group>

      {/* lamp on the floor */}
      <group position={[-0.85, 0, 0.55]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.04, 24]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.40, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.7, 12]} />
          <meshStandardMaterial color="#1f1f1f" />
        </mesh>
        <mesh position={[0, 0.78, 0]} castShadow>
          <coneGeometry args={[0.16, 0.20, 20, 1, true]} />
          <meshStandardMaterial color="#f5d28a" emissive="#ff9a3a" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* back wall with window */}
      <mesh position={[0, 1.4, -2.3]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>
      {/* window pane (emissive sky) */}
      <mesh position={[1.3, 1.3, -2.29]}>
        <planeGeometry args={[0.95, 0.85]} />
        <meshStandardMaterial color="#bcdcff" emissive="#bcdcff" emissiveIntensity={0.7} />
      </mesh>
      {/* window frame */}
      <mesh position={[1.3, 1.3, -2.28]}>
        <boxGeometry args={[1.0, 0.9, 0.02]} />
        <meshStandardMaterial color="#5a371b" roughness={0.7} />
      </mesh>
      {/* window crossbar */}
      <mesh position={[1.3, 1.3, -2.275]}>
        <boxGeometry args={[1.0, 0.03, 0.02]} />
        <meshStandardMaterial color="#5a371b" roughness={0.7} />
      </mesh>
      <mesh position={[1.3, 1.3, -2.275]}>
        <boxGeometry args={[0.03, 0.9, 0.02]} />
        <meshStandardMaterial color="#5a371b" roughness={0.7} />
      </mesh>
    </>
  );
}

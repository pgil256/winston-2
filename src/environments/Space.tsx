import { Stars } from '@react-three/drei';

export function Space(): JSX.Element {
  return (
    <>
      <color attach="background" args={['#04031a']} />
      <fog attach="fog" args={['#04031a', 10, 35]} />

      <Stars radius={60} depth={50} count={5500} factor={4} fade speed={0.4} />

      <ambientLight intensity={0.15} color="#a8c0ff" />
      {/* warm key from "sun" */}
      <directionalLight
        position={[3, 4, 2]}
        intensity={0.85}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      {/* blue rim from behind */}
      <directionalLight position={[-2.5, 2, -3]} intensity={1.6} color="#3a72ff" />

      {/* planet */}
      <mesh position={[2.4, 1.6, -3.5]}>
        <sphereGeometry args={[0.7, 32, 24]} />
        <meshStandardMaterial
          color="#a8543a"
          roughness={0.85}
          emissive="#2a0808"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* planet ring */}
      <mesh position={[2.4, 1.6, -3.5]} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[0.95, 1.25, 64]} />
        <meshStandardMaterial color="#b8a08a" side={2} roughness={0.85} />
      </mesh>
      {/* moon */}
      <mesh position={[3.2, 2.0, -3.0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#cccccc" roughness={0.9} />
      </mesh>

      {/* dim platform so the ferret is grounded */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.95} />
      </mesh>
    </>
  );
}

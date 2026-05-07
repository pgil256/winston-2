// Neutral grey backdrop with classic three-point lighting (key, fill, rim).
export function Studio(): JSX.Element {
  return (
    <>
      <color attach="background" args={['#2a2a2c']} />
      <fog attach="fog" args={['#2a2a2c', 6, 18]} />

      <ambientLight intensity={0.25} />
      {/* key light from upper right */}
      <directionalLight
        position={[3, 4, 2.5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />
      {/* fill light from upper left */}
      <directionalLight position={[-3, 2.5, 1.5]} intensity={0.5} />
      {/* rim/back light */}
      <directionalLight position={[0, 3.5, -3.5]} intensity={0.55} color="#bcd0ff" />

      {/* studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
      {/* curved backdrop */}
      <mesh position={[0, 1.5, -2]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
    </>
  );
}

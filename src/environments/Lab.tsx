function Beaker({ x, liquid }: { x: number; liquid: string }): JSX.Element {
  return (
    <group position={[x, 0.475, 0]}>
      {/* glass shell */}
      <mesh castShadow position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.15, 18, 1, true]} />
        <meshStandardMaterial
          color="#dceeff"
          transparent
          opacity={0.3}
          side={2}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* lip */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.05, 0.005, 6, 16]} />
        <meshStandardMaterial color="#dceeff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* liquid */}
      <mesh position={[0, 0.058, 0]}>
        <cylinderGeometry args={[0.046, 0.041, 0.10, 18]} />
        <meshStandardMaterial
          color={liquid}
          transparent
          opacity={0.85}
          emissive={liquid}
          emissiveIntensity={0.2}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export function Lab(): JSX.Element {
  const tileSpacing = 0.5;
  const tileLines = Array.from({ length: 21 }, (_, i) => i - 10);
  return (
    <>
      <color attach="background" args={['#e2e4e8']} />
      <fog attach="fog" args={['#e2e4e8', 9, 22]} />

      {/* harsh fluorescent: high ambient + double overhead directional */}
      <ambientLight intensity={0.65} color="#ffffff" />
      <directionalLight
        position={[2, 5, 1]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 5, -1]} intensity={0.95} color="#ffffff" />

      {/* white tile floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f1f2f6" roughness={0.45} metalness={0.05} />
      </mesh>
      {/* grout lines */}
      {tileLines.map((i) => (
        <mesh
          key={`x${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.001, i * tileSpacing]}
          receiveShadow
        >
          <planeGeometry args={[30, 0.012]} />
          <meshStandardMaterial color="#9aa0aa" roughness={0.6} />
        </mesh>
      ))}
      {tileLines.map((i) => (
        <mesh
          key={`z${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[i * tileSpacing, 0.001, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.012, 30]} />
          <meshStandardMaterial color="#9aa0aa" roughness={0.6} />
        </mesh>
      ))}

      {/* lab table */}
      <group position={[1.2, 0, -1.0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.04, 0.55]} />
          <meshStandardMaterial color="#cfd2d6" roughness={0.35} metalness={0.5} />
        </mesh>
        {[
          [-0.5, -0.24],
          [0.5, -0.24],
          [-0.5, 0.24],
          [0.5, 0.24],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x!, 0.225, z!]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.45, 10]} />
            <meshStandardMaterial color="#8a8e94" roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
        <Beaker x={-0.32} liquid="#3aa0d8" />
        <Beaker x={-0.10} liquid="#d83a72" />
        <Beaker x={0.12} liquid="#5acb3a" />
        <Beaker x={0.34} liquid="#f0c34a" />
      </group>
    </>
  );
}

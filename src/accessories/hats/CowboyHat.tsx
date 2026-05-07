const ROOT_Y = 0.07;
const ROOT_Z = 0.05;

export function CowboyHat(): JSX.Element {
  return (
    <group position={[0, ROOT_Y, ROOT_Z]}>
      {/* upturned wide brim, slight curl achieved via torus on the rim */}
      <mesh position={[0, 0.005, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.01, 28]} />
        <meshStandardMaterial color="#7a4b22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.105, 0.012, 8, 32]} />
        <meshStandardMaterial color="#7a4b22" roughness={0.7} />
      </mesh>
      {/* rounded crown */}
      <mesh position={[0, 0.012 + 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.054, 0.062, 0.08, 24]} />
        <meshStandardMaterial color="#7a4b22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.012 + 0.08, 0]} castShadow>
        <sphereGeometry args={[0.054, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a4b22" roughness={0.7} />
      </mesh>
      {/* crease */}
      <mesh position={[0, 0.012 + 0.085, 0]} castShadow>
        <boxGeometry args={[0.11, 0.01, 0.02]} />
        <meshStandardMaterial color="#5a3818" roughness={0.7} />
      </mesh>
    </group>
  );
}

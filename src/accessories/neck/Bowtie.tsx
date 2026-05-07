// Mounted as a child of the neck bone (capsule extending along +Z, length 0.06, radius 0.04).
export function Bowtie(): JSX.Element {
  return (
    <group position={[0, 0, 0.04]}>
      {/* knot */}
      <mesh castShadow>
        <sphereGeometry args={[0.014, 12, 10]} />
        <meshStandardMaterial color="#a31818" roughness={0.5} />
      </mesh>
      {/* left wing */}
      <mesh position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.022, 0.04, 12]} />
        <meshStandardMaterial color="#c11e1e" roughness={0.5} />
      </mesh>
      {/* right wing */}
      <mesh position={[0.025, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.022, 0.04, 12]} />
        <meshStandardMaterial color="#c11e1e" roughness={0.5} />
      </mesh>
    </group>
  );
}

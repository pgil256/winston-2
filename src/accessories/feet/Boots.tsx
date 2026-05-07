import type { BoneId } from '../../rig/types';

interface Props {
  bone: BoneId;
}

export function Boots({ bone }: Props): JSX.Element {
  const isPaw = bone === 'paw_L' || bone === 'paw_R';
  const leather = '#2c1f12';
  const cuff = '#a85a2a';

  if (isPaw) {
    return (
      <group>
        <mesh castShadow>
          <sphereGeometry args={[0.034, 18, 14]} />
          <meshStandardMaterial color={leather} roughness={0.55} metalness={0.05} />
        </mesh>
        {/* cuff facing inward toward the body */}
        <mesh position={[bone === 'paw_L' ? -0.026 : 0.026, 0, 0]} castShadow>
          <torusGeometry args={[0.028, 0.007, 8, 18]} />
          <meshStandardMaterial color={cuff} roughness={0.7} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.030, 0.05, 6, 14]} />
        <meshStandardMaterial color={leather} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* heel block at the back */}
      <mesh position={[0, -0.018, 0]} castShadow>
        <boxGeometry args={[0.036, 0.018, 0.025]} />
        <meshStandardMaterial color={leather} roughness={0.55} />
      </mesh>
      {/* cuff at the leg side */}
      <mesh position={[0, 0, 0.001]}>
        <torusGeometry args={[0.032, 0.007, 8, 18]} />
        <meshStandardMaterial color={cuff} roughness={0.7} />
      </mesh>
    </group>
  );
}

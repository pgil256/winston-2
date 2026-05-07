import type { BoneId } from '../../rig/types';

interface Props {
  bone: BoneId;
}

// Socks render once per limb tip; geometry differs slightly between front paws
// (sphere-based) and rear feet (forward-extending capsule).
export function Socks({ bone }: Props): JSX.Element {
  const isPaw = bone === 'paw_L' || bone === 'paw_R';
  const yarn = '#e6a8d4';
  const cuff = '#f7e8a8';

  if (isPaw) {
    return (
      <group>
        <mesh castShadow>
          <sphereGeometry args={[0.032, 18, 14]} />
          <meshStandardMaterial color={yarn} roughness={0.95} />
        </mesh>
        <mesh position={[bone === 'paw_L' ? -0.025 : 0.025, 0, 0]} castShadow>
          <torusGeometry args={[0.026, 0.005, 8, 16]} />
          <meshStandardMaterial color={cuff} roughness={0.85} />
        </mesh>
      </group>
    );
  }

  // Rear foot: capsule extends along bone-local +Z by 0.05 (foot length).
  return (
    <group>
      <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.027, 0.05, 6, 14]} />
        <meshStandardMaterial color={yarn} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <torusGeometry args={[0.029, 0.005, 8, 16]} />
        <meshStandardMaterial color={cuff} roughness={0.85} />
      </mesh>
    </group>
  );
}

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKELETON, SKELETON_CHILDREN, type BonePrimitive } from './skeleton';
import type { BoneId } from './types';
import { useAppStore } from '../store/appStore';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function Bone({ boneId }: { boneId: BoneId }): JSX.Element {
  const def = SKELETON[boneId];
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const rot = useAppStore.getState().pose[boneId];
    group.rotation.set(rot[0], rot[1], rot[2]);
  });

  const offset = def.offset as [number, number, number];

  return (
    <group ref={groupRef} position={offset}>
      <BonePrimitiveMesh primitive={def.primitive} debugColor={def.debugColor} />
      {SKELETON_CHILDREN[boneId].map((childId) => (
        <Bone key={childId} boneId={childId} />
      ))}
    </group>
  );
}

interface PrimitiveMeshProps {
  primitive: BonePrimitive;
  debugColor: string | undefined;
}

function BonePrimitiveMesh({ primitive, debugColor }: PrimitiveMeshProps): JSX.Element | null {
  const transform = useMemo(() => {
    if (primitive.shape === 'none') return null;
    if (primitive.shape === 'sphere') {
      const off = primitive.offset ?? ([0, 0, 0] as const);
      return {
        position: [off[0], off[1], off[2]] as [number, number, number],
        quaternion: [0, 0, 0, 1] as [number, number, number, number],
      };
    }
    const dir = new THREE.Vector3(...primitive.direction).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, dir);
    const center = dir.clone().multiplyScalar(primitive.length / 2);
    return {
      position: [center.x, center.y, center.z] as [number, number, number],
      quaternion: [q.x, q.y, q.z, q.w] as [number, number, number, number],
    };
  }, [primitive]);

  if (primitive.shape === 'none' || !transform) return null;

  const color = debugColor ?? '#ff00ff';

  if (primitive.shape === 'sphere') {
    return (
      <mesh position={transform.position} castShadow>
        <sphereGeometry args={[primitive.radius, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    );
  }

  if (primitive.shape === 'capsule') {
    const cylLength = Math.max(primitive.length - 2 * primitive.radius, 0.0001);
    return (
      <mesh position={transform.position} quaternion={transform.quaternion} castShadow>
        <capsuleGeometry args={[primitive.radius, cylLength, 4, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    );
  }

  // cone
  return (
    <mesh position={transform.position} quaternion={transform.quaternion} castShadow>
      <coneGeometry args={[primitive.radius, primitive.length, 16]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

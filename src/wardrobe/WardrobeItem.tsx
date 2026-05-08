import { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { BoneId } from '../rig/types';
import { WARDROBE_ANCHORS } from './anchors';
import { PROCEDURAL_ACCESSORIES } from './procedural';
import type { WardrobeAnchor, WardrobeItem as WardrobeItemData } from './types';

interface Props {
  readonly item: WardrobeItemData;
  readonly anchor: WardrobeAnchor;
  readonly bone?: BoneId;
}

export function WardrobeItem({ item, anchor, bone }: Props): JSX.Element | null {
  const anchorTransform = WARDROBE_ANCHORS[anchor];
  const transform = item.transform;
  const scale = transform.scale;
  const scaleTuple = typeof scale === 'number' ? ([scale, scale, scale] as const) : scale;

  const [anchorX, anchorY, anchorZ] = anchorTransform.position;
  const [positionX, positionY, positionZ] = transform.position;
  const [anchorRotX, anchorRotY, anchorRotZ] = anchorTransform.rotation;
  const [rotationX, rotationY, rotationZ] = transform.rotation;

  return (
    <group
      position={[anchorX + positionX, anchorY + positionY, anchorZ + positionZ]}
      rotation={[anchorRotX + rotationX, anchorRotY + rotationY, anchorRotZ + rotationZ]}
      scale={scaleTuple}
    >
      {item.kind === 'procedural' ? (
        <ProceduralItem item={item} bone={bone} />
      ) : (
        <Suspense fallback={null}>
          <GlbItem item={item} />
        </Suspense>
      )}
    </group>
  );
}

function ProceduralItem({
  item,
  bone,
}: {
  readonly item: Extract<WardrobeItemData, { kind: 'procedural' }>;
  readonly bone?: BoneId;
}): JSX.Element | null {
  const Comp = PROCEDURAL_ACCESSORIES[item.component];
  return Comp ? <Comp bone={bone} /> : null;
}

function GlbItem({
  item,
}: {
  readonly item: Extract<WardrobeItemData, { kind: 'glb' }>;
}): JSX.Element {
  const { scene } = useGLTF(item.assetPath);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return <primitive object={cloned} />;
}

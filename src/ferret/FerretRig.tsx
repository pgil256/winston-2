import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FerretModel } from './FerretModel';
import { AccessoryAt } from '../accessories/AccessoryAt';

// Anchor offsets are tuned visually against the Poly Google ferret model after
// it's been normalised to fit a ~0.6 unit footprint with feet on y=0. Updated
// in `useAnchorOffsets` once the model loads (bbox-based fallback). Defaults
// are sensible static values.
interface AnchorOffsets {
  head: [number, number, number];
  neck: [number, number, number];
  body: [number, number, number];
  pawL: [number, number, number];
  pawR: [number, number, number];
  footL: [number, number, number];
  footR: [number, number, number];
}

const DEFAULT_OFFSETS: AnchorOffsets = {
  head: [0, 0.21, 0.32],
  neck: [0, 0.18, 0.24],
  body: [0, 0.12, 0.0],
  pawL: [0.06, 0.04, 0.22],
  pawR: [-0.06, 0.04, 0.22],
  footL: [0.07, 0.04, -0.18],
  footR: [-0.07, 0.04, -0.18],
};

export function FerretRig(): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const [bbox, setBbox] = useState<THREE.Box3 | null>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (!groupRef.current) return;
      const box = new THREE.Box3().setFromObject(groupRef.current);
      if (!box.isEmpty()) setBbox(box);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const { scale, modelOffset, offsets } = useMemo(() => {
    if (!bbox) {
      return { scale: 1, modelOffset: [0, 0, 0] as [number, number, number], offsets: DEFAULT_OFFSETS };
    }
    const size = new THREE.Vector3();
    bbox.getSize(size);
    // Normalise to ~0.6 unit body length (longest axis fits in 0.6 units).
    const longest = Math.max(size.x, size.y, size.z);
    const s = 0.6 / Math.max(longest, 0.001);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const off: [number, number, number] = [
      -center.x * s,
      -bbox.min.y * s,
      -center.z * s,
    ];
    return { scale: s, modelOffset: off, offsets: DEFAULT_OFFSETS };
  }, [bbox]);

  return (
    <group>
      <group ref={groupRef} scale={scale} position={modelOffset}>
        <FerretModel />
      </group>
      {/* Accessory anchors at fixed model-local offsets */}
      <group position={offsets.head}>
        <AccessoryAt slot="head" bone="head" />
      </group>
      <group position={offsets.neck}>
        <AccessoryAt slot="neck" bone="neck" />
      </group>
      <group position={offsets.body}>
        <AccessoryAt slot="body" bone="spine_upper" />
      </group>
      <group position={offsets.pawL}>
        <AccessoryAt slot="feet" bone="paw_L" />
      </group>
      <group position={offsets.pawR}>
        <AccessoryAt slot="feet" bone="paw_R" />
      </group>
      <group position={offsets.footL}>
        <AccessoryAt slot="feet" bone="foot_L" />
      </group>
      <group position={offsets.footR}>
        <AccessoryAt slot="feet" bone="foot_R" />
      </group>
    </group>
  );
}

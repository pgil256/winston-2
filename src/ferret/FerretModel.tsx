import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const MODEL_URL = '/models/ferret.glb';

// Poly Google's Ferret (CC-BY 3.0). The OBJ-converted glTF has a single mesh,
// no rigging, no animations. We render it as the body and anchor accessories
// at fixed offsets relative to this group.
export function FerretModel(): JSX.Element {
  const { scene } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} />;
}

useGLTF.preload(MODEL_URL);

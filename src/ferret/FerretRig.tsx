import { FerretModel } from './FerretModel';
import { useAppStore } from '../store/appStore';
import type { BoneId } from '../rig/types';
import { getAnchorsForSlot } from '../wardrobe/anchors';
import { getWardrobeItem } from '../wardrobe/registry';
import { WardrobeItem } from '../wardrobe/WardrobeItem';
import type { WardrobeAnchor, WardrobeSlot } from '../wardrobe/types';

// Known bounding box of public/models/ferret.glb (Poly by Google).
// Authored coords: Y up, ferret stands on Y=0, head extends toward +Z, tail toward -Z.
// Re-measured by inspecting the glTF POSITION accessor.
const MODEL_BBOX = {
  min: [-0.517, -0.019, -2.593] as const,
  max: [0.517, 2.11, 1.821] as const,
};

// Target body length in scene units (head-to-tail-tip ≈ 0.6).
const TARGET_LENGTH = 0.6;
const SOURCE_LENGTH = MODEL_BBOX.max[2] - MODEL_BBOX.min[2];
const SCALE = TARGET_LENGTH / SOURCE_LENGTH;

// After scaling: centre on X, sit on Y=0, centre on Z.
const SCALED_CX = ((MODEL_BBOX.min[0] + MODEL_BBOX.max[0]) / 2) * SCALE;
const SCALED_CZ = ((MODEL_BBOX.min[2] + MODEL_BBOX.max[2]) / 2) * SCALE;
const MODEL_OFFSET: [number, number, number] = [
  -SCALED_CX,
  -MODEL_BBOX.min[1] * SCALE,
  -SCALED_CZ,
];

const FEET_BONES: Partial<Record<WardrobeAnchor, BoneId>> = {
  frontPawL: 'paw_L',
  frontPawR: 'paw_R',
  rearFootL: 'foot_L',
  rearFootR: 'foot_R',
};

export function FerretRig(): JSX.Element {
  return (
    <group>
      <group scale={SCALE} position={MODEL_OFFSET}>
        <FerretModel />
      </group>
      <WardrobeLayer />
    </group>
  );
}

function WardrobeLayer(): JSX.Element {
  const wardrobe = useAppStore((s) => s.wardrobe);

  return (
    <>
      {(Object.entries(wardrobe) as Array<[WardrobeSlot, string]>).map(([slot, id]) => {
        if (id === 'none') return null;
        const item = getWardrobeItem(id);
        if (!item) return null;

        return getAnchorsForSlot(slot).map((anchor) => (
          <WardrobeItem
            key={`${slot}-${id}-${anchor}`}
            item={item}
            anchor={anchor}
            bone={FEET_BONES[anchor]}
          />
        ));
      })}
    </>
  );
}

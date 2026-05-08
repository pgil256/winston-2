import { FerretModel } from './FerretModel';
import { AccessoryAt } from '../accessories/AccessoryAt';

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

// Scaled extents (world-space, after MODEL_OFFSET applied):
const EX = (MODEL_BBOX.max[0] - MODEL_BBOX.min[0]) * SCALE * 0.5; // half-width
const EY = (MODEL_BBOX.max[1] - MODEL_BBOX.min[1]) * SCALE; // height
const EZ_FRONT = MODEL_BBOX.max[2] * SCALE - SCALED_CZ; // head extent
const EZ_BACK = MODEL_BBOX.min[2] * SCALE - SCALED_CZ; // tail extent (negative)

// Accessory anchors expressed as fractions of body extents, so re-tuning the
// scale only requires updating MODEL_BBOX. Front of body = +Z, back = -Z.
const HEAD_OFFSET: [number, number, number] = [0, EY * 0.85, EZ_FRONT * 0.85];
const NECK_OFFSET: [number, number, number] = [0, EY * 0.70, EZ_FRONT * 0.55];
const BODY_OFFSET: [number, number, number] = [0, EY * 0.55, EZ_FRONT * 0.05];
const PAW_L: [number, number, number] = [+EX * 0.55, EY * 0.10, EZ_FRONT * 0.55];
const PAW_R: [number, number, number] = [-EX * 0.55, EY * 0.10, EZ_FRONT * 0.55];
const FOOT_L: [number, number, number] = [+EX * 0.55, EY * 0.10, EZ_BACK * 0.55];
const FOOT_R: [number, number, number] = [-EX * 0.55, EY * 0.10, EZ_BACK * 0.55];

export function FerretRig(): JSX.Element {
  return (
    <group>
      <group scale={SCALE} position={MODEL_OFFSET}>
        <FerretModel />
      </group>
      <group position={HEAD_OFFSET}>
        <AccessoryAt slot="head" bone="head" />
      </group>
      <group position={NECK_OFFSET}>
        <AccessoryAt slot="neck" bone="neck" />
      </group>
      <group position={BODY_OFFSET}>
        <AccessoryAt slot="body" bone="spine_upper" />
      </group>
      <group position={PAW_L}>
        <AccessoryAt slot="feet" bone="paw_L" />
      </group>
      <group position={PAW_R}>
        <AccessoryAt slot="feet" bone="paw_R" />
      </group>
      <group position={FOOT_L}>
        <AccessoryAt slot="feet" bone="foot_L" />
      </group>
      <group position={FOOT_R}>
        <AccessoryAt slot="feet" bone="foot_R" />
      </group>
    </group>
  );
}

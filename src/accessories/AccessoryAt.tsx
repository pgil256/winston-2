import { useAppStore } from '../store/appStore';
import type { BoneId } from '../rig/types';
import type { AccessorySlot } from './anchors';
import { HAT_COMPONENTS } from './hats';
import { NECK_COMPONENTS } from './neck';
import { BODY_COMPONENTS } from './body';

interface Props {
  slot: AccessorySlot;
  bone: BoneId;
}

// Renders the active accessory for this slot as a child of the bone's group.
export function AccessoryAt({ slot }: Props): JSX.Element | null {
  const selection = useAppStore((s) => s.accessories[slot]);
  if (selection === 'none') return null;

  if (slot === 'head') {
    const Comp = HAT_COMPONENTS[selection as keyof typeof HAT_COMPONENTS];
    return Comp ? <Comp /> : null;
  }
  if (slot === 'neck') {
    const Comp = NECK_COMPONENTS[selection as keyof typeof NECK_COMPONENTS];
    return Comp ? <Comp /> : null;
  }
  if (slot === 'body') {
    const Comp = BODY_COMPONENTS[selection as keyof typeof BODY_COMPONENTS];
    return Comp ? <Comp /> : null;
  }

  return null;
}

import { useAppStore } from '../store/appStore';
import type { BoneId } from '../rig/types';
import type { AccessorySlot } from './anchors';

interface Props {
  slot: AccessorySlot;
  bone: BoneId;
}

// Renders the active accessory for this slot as a child of the bone's group.
// Concrete accessory components are wired in subsequent tasks; this dispatcher
// makes the anchor wiring visible to the rest of the app.
export function AccessoryAt({ slot, bone: _bone }: Props): JSX.Element | null {
  const selection = useAppStore((s) => s.accessories[slot]);
  if (selection === 'none') return null;
  // Concrete accessory mounts will be added in following iterations.
  return null;
}

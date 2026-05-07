import type { ComponentType } from 'react';
import type { BoneId } from '../../rig/types';
import type { FeetId } from '../types';
import { Socks } from './Socks';
import { Boots } from './Boots';

interface FeetProps {
  bone: BoneId;
}

export const FEET_COMPONENTS: Record<Exclude<FeetId, 'none'>, ComponentType<FeetProps>> = {
  socks: Socks,
  boots: Boots,
};

import type { ComponentType } from 'react';
import type { HatId } from '../types';
import { TopHat } from './TopHat';
import { PartyHat } from './PartyHat';
import { WitchHat } from './WitchHat';
import { CowboyHat } from './CowboyHat';

export const HAT_COMPONENTS: Record<Exclude<HatId, 'none'>, ComponentType> = {
  top: TopHat,
  party: PartyHat,
  witch: WitchHat,
  cowboy: CowboyHat,
};

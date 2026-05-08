import type { ComponentType } from 'react';
import { Cape } from '../accessories/body/Cape';
import { Sweater } from '../accessories/body/Sweater';
import { Tutu } from '../accessories/body/Tutu';
import { Boots } from '../accessories/feet/Boots';
import { Socks } from '../accessories/feet/Socks';
import { CowboyHat } from '../accessories/hats/CowboyHat';
import { PartyHat } from '../accessories/hats/PartyHat';
import { TopHat } from '../accessories/hats/TopHat';
import { WitchHat } from '../accessories/hats/WitchHat';
import { Bowtie } from '../accessories/neck/Bowtie';
import { Collar } from '../accessories/neck/Collar';
import { Scarf } from '../accessories/neck/Scarf';
import type { BoneId } from '../rig/types';

export interface ProceduralAccessoryProps {
  readonly bone?: BoneId;
}

export const PROCEDURAL_ACCESSORIES: Readonly<Record<string, ComponentType<ProceduralAccessoryProps>>> = {
  TopHat,
  PartyHat,
  WitchHat,
  CowboyHat,
  Bowtie,
  Collar,
  Scarf,
  Sweater,
  Cape,
  Tutu,
  Socks: ({ bone }) => <Socks bone={bone ?? 'paw_L'} />,
  Boots: ({ bone }) => <Boots bone={bone ?? 'paw_L'} />,
};

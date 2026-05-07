import type { ComponentType } from 'react';
import type { NeckId } from '../types';
import { Bowtie } from './Bowtie';
import { Collar } from './Collar';
import { Scarf } from './Scarf';

export const NECK_COMPONENTS: Record<Exclude<NeckId, 'none'>, ComponentType> = {
  bowtie: Bowtie,
  collar: Collar,
  scarf: Scarf,
};

import type { ComponentType } from 'react';
import type { EnvironmentId } from './types';
import { Studio } from './Studio';
import { Bedroom } from './Bedroom';
import { Forest } from './Forest';
import { Space } from './Space';
import { Beach } from './Beach';
import { Lab } from './Lab';

export const ENV_COMPONENTS: Record<EnvironmentId, ComponentType> = {
  studio: Studio,
  bedroom: Bedroom,
  forest: Forest,
  space: Space,
  beach: Beach,
  lab: Lab,
};

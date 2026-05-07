import type { ComponentType } from 'react';
import type { BodyId } from '../types';
import { Sweater } from './Sweater';
import { Cape } from './Cape';
import { Tutu } from './Tutu';

export const BODY_COMPONENTS: Record<Exclude<BodyId, 'none'>, ComponentType> = {
  sweater: Sweater,
  cape: Cape,
  tutu: Tutu,
};

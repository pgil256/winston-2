import { describe, expect, it } from 'vitest';
import { ENV_COMPONENTS } from './registry';
import { ENVIRONMENT_IDS } from './types';

describe('environment registry', () => {
  it('has a component for every environment id', () => {
    for (const id of ENVIRONMENT_IDS) {
      expect(ENV_COMPONENTS[id]).toBeDefined();
      expect(typeof ENV_COMPONENTS[id]).toBe('function');
    }
  });
});

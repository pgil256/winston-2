import { describe, expect, it, beforeEach } from 'vitest';
import { useAppStore } from './appStore';
import { BONE_IDS } from '../rig/types';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetAll();
  });

  it('initializes with zero pose for every bone', () => {
    const { pose } = useAppStore.getState();
    for (const id of BONE_IDS) {
      expect(pose[id]).toEqual([0, 0, 0]);
    }
  });

  it('initializes with no accessories and studio environment', () => {
    const { accessories, environment } = useAppStore.getState();
    expect(accessories).toEqual({ head: 'none', neck: 'none', body: 'none', feet: 'none' });
    expect(environment).toBe('studio');
  });

  it('setBoneRotation updates only the targeted bone', () => {
    useAppStore.getState().setBoneRotation('head', [0.1, 0.2, 0.3]);
    const { pose } = useAppStore.getState();
    expect(pose.head).toEqual([0.1, 0.2, 0.3]);
    expect(pose.tail_1).toEqual([0, 0, 0]);
  });

  it('setHat / setNeck / setBody / setFeet update the right slot', () => {
    const s = useAppStore.getState();
    s.setHat('top');
    s.setNeck('bowtie');
    s.setBody('cape');
    s.setFeet('boots');
    expect(useAppStore.getState().accessories).toEqual({
      head: 'top',
      neck: 'bowtie',
      body: 'cape',
      feet: 'boots',
    });
  });

  it('setEnvironment switches the active environment', () => {
    useAppStore.getState().setEnvironment('forest');
    expect(useAppStore.getState().environment).toBe('forest');
  });

  it('resetAll restores defaults', () => {
    const s = useAppStore.getState();
    s.setHat('witch');
    s.setEnvironment('space');
    s.setBoneRotation('tail_2', [1, 0, 0]);
    s.resetAll();
    const next = useAppStore.getState();
    expect(next.accessories.head).toBe('none');
    expect(next.environment).toBe('studio');
    expect(next.pose.tail_2).toEqual([0, 0, 0]);
  });
});

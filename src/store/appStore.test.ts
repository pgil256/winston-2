import { describe, expect, it, beforeEach } from 'vitest';
import { useAppStore } from './appStore';
import { BONE_IDS, zeroPose } from '../rig/types';
import { CONSTRAINTS } from '../rig/constraints';
import type { Look } from '../storage/looks';

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

  it('initializes with an empty wardrobe selection', () => {
    expect(useAppStore.getState().wardrobe).toEqual({
      head: 'none',
      face: 'none',
      neck: 'none',
      body: 'none',
      back: 'none',
      feet: 'none',
    });
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

  it('setWardrobeItem updates only one wardrobe slot', () => {
    const s = useAppStore.getState();
    s.setWardrobeItem('head', 'wizard-hat');
    s.setWardrobeItem('face', 'sunglasses');
    expect(useAppStore.getState().wardrobe).toEqual({
      head: 'wizard-hat',
      face: 'sunglasses',
      neck: 'none',
      body: 'none',
      back: 'none',
      feet: 'none',
    });
  });

  it('clearWardrobeSlot and resetWardrobe clear wardrobe state', () => {
    const s = useAppStore.getState();
    s.setWardrobeItem('head', 'wizard-hat');
    s.setWardrobeItem('feet', 'boots');
    s.clearWardrobeSlot('head');
    expect(useAppStore.getState().wardrobe.head).toBe('none');
    expect(useAppStore.getState().wardrobe.feet).toBe('boots');
    s.resetWardrobe();
    expect(Object.values(useAppStore.getState().wardrobe)).toEqual([
      'none',
      'none',
      'none',
      'none',
      'none',
      'none',
    ]);
  });

  it('setWardrobeItem keeps legacy accessories synchronized', () => {
    const s = useAppStore.getState();
    s.setWardrobeItem('head', 'top-hat');
    s.setWardrobeItem('neck', 'scarf');
    s.setWardrobeItem('body', 'sweater');
    s.setWardrobeItem('feet', 'boots');
    expect(useAppStore.getState().accessories).toEqual({
      head: 'top',
      neck: 'scarf',
      body: 'sweater',
      feet: 'boots',
    });
  });

  it('clearWardrobeSlot and resetWardrobe keep legacy accessories synchronized', () => {
    const s = useAppStore.getState();
    s.setHat('top');
    s.setFeet('boots');
    s.clearWardrobeSlot('head');
    expect(useAppStore.getState().accessories.head).toBe('none');
    expect(useAppStore.getState().accessories.feet).toBe('boots');

    s.resetWardrobe();
    expect(useAppStore.getState().accessories).toEqual({
      head: 'none',
      neck: 'none',
      body: 'none',
      feet: 'none',
    });
  });

  it('randomizeWardrobe keeps legacy accessories synchronized', () => {
    const originalRandom = Math.random;
    const randomValues = [0.99, 0, 0.99, 0.99, 0, 0.99];
    Math.random = () => randomValues.shift() ?? 0;
    try {
      useAppStore.getState().randomizeWardrobe();
      const state = useAppStore.getState();
      expect(state.accessories).toEqual({
        head: 'cowboy',
        neck: 'scarf',
        body: 'tutu',
        feet: 'boots',
      });
    } finally {
      Math.random = originalRandom;
    }
  });

  it('setEnvironment switches the active environment', () => {
    useAppStore.getState().setEnvironment('forest');
    expect(useAppStore.getState().environment).toBe('forest');
  });

  it('setBoneRotation clamps to constraint range', () => {
    useAppStore.getState().setBoneRotation('head', [10, 10, 10]);
    const headRot = useAppStore.getState().pose.head;
    expect(headRot[0]).toBe(CONSTRAINTS.head.x.max);
    expect(headRot[1]).toBe(CONSTRAINTS.head.y.max);
    expect(headRot[2]).toBe(CONSTRAINTS.head.z.max);
  });

  it('setPose clamps every bone in the pose', () => {
    const big = {} as Record<string, [number, number, number]>;
    for (const id of BONE_IDS) big[id] = [10, 10, 10];
    useAppStore.getState().setPose(big as never);
    const { pose } = useAppStore.getState();
    expect(pose.snout[0]).toBe(CONSTRAINTS.snout.x.max);
    expect(pose.shin_L[0]).toBe(CONSTRAINTS.shin_L.x.max);
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

  it('applyLook fills missing pose entries with zero rotations', () => {
    const partialLook = {
      version: 2,
      pose: { head: [0.1, 0.2, 0.3] },
      wardrobe: { head: 'top-hat' },
      environment: 'studio',
    };

    expect(() => useAppStore.getState().applyLook(partialLook as unknown as Look)).not.toThrow();
    const { pose, accessories } = useAppStore.getState();
    expect(pose.head).toEqual([0.1, 0.2, 0.3]);
    expect(pose.tail_1).toEqual(zeroPose().tail_1);
    expect(accessories.head).toBe('top');
  });
});

import { describe, expect, it } from 'vitest';
import { BONE_IDS } from './types';
import { ROOT_BONE, SKELETON, SKELETON_CHILDREN } from './skeleton';

describe('SKELETON', () => {
  it('has a definition for every BoneId', () => {
    for (const id of BONE_IDS) {
      expect(SKELETON[id]).toBeDefined();
      expect(SKELETON[id].id).toBe(id);
    }
  });

  it('has exactly one root (parent === null)', () => {
    const roots = BONE_IDS.filter((id) => SKELETON[id].parent === null);
    expect(roots).toEqual([ROOT_BONE]);
  });

  it('every non-root parent reference points to an existing bone', () => {
    for (const id of BONE_IDS) {
      const parent = SKELETON[id].parent;
      if (parent !== null) {
        expect(BONE_IDS).toContain(parent);
      }
    }
  });

  it('forms a tree (no cycles, every bone reachable from root)', () => {
    const visited = new Set<string>();
    const stack: string[] = [ROOT_BONE];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (visited.has(node)) {
        throw new Error(`cycle detected at ${node}`);
      }
      visited.add(node);
      for (const child of SKELETON_CHILDREN[node as keyof typeof SKELETON_CHILDREN]) {
        stack.push(child);
      }
    }
    expect(visited.size).toBe(BONE_IDS.length);
  });

  it('SKELETON_CHILDREN is consistent with parent links', () => {
    for (const id of BONE_IDS) {
      const children = SKELETON_CHILDREN[id];
      for (const child of children) {
        expect(SKELETON[child].parent).toBe(id);
      }
    }
  });

  it('limb capsule directions are unit vectors', () => {
    for (const id of BONE_IDS) {
      const p = SKELETON[id].primitive;
      if (p.shape === 'capsule' || p.shape === 'cone') {
        const [x, y, z] = p.direction;
        const mag = Math.hypot(x, y, z);
        expect(mag).toBeCloseTo(1, 5);
      }
    }
  });
});

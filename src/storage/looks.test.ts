import { describe, expect, it, beforeEach } from 'vitest';
import { saveLook, loadLook, listLooks, deleteLook, type Look } from './looks';
import { zeroPose } from '../rig/types';
import { defaultAccessories } from '../accessories/types';

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v);
  }
  removeItem(k: string): void {
    this.data.delete(k);
  }
  clear(): void {
    this.data.clear();
  }
  get length(): number {
    return this.data.size;
  }
  key(i: number): string | null {
    return Array.from(this.data.keys())[i] ?? null;
  }
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = new MemoryStorage() as unknown as Storage;
});

function aLook(): Look {
  return {
    version: 1,
    pose: zeroPose(),
    accessories: defaultAccessories(),
    environment: 'studio',
  };
}

describe('looks storage', () => {
  it('round-trips a saved look', () => {
    const look = aLook();
    saveLook('alpha', look);
    expect(loadLook('alpha')).toEqual(look);
  });

  it('returns null for unknown names', () => {
    expect(loadLook('missing')).toBeNull();
  });

  it('lists all saved names sorted', () => {
    saveLook('charlie', aLook());
    saveLook('alpha', aLook());
    saveLook('bravo', aLook());
    expect(listLooks()).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('deleteLook removes an entry', () => {
    saveLook('temp', aLook());
    expect(listLooks()).toContain('temp');
    deleteLook('temp');
    expect(listLooks()).not.toContain('temp');
  });

  it('ignores blank or whitespace-only names', () => {
    saveLook('   ', aLook());
    expect(listLooks()).toEqual([]);
    expect(loadLook('   ')).toBeNull();
  });
});

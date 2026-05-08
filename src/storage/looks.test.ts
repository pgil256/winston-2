import { describe, expect, it, beforeEach } from 'vitest';
import { saveLook, loadLook, listLooks, deleteLook, migrateLookToV2, type Look, type LookV1, type LookV2 } from './looks';
import { zeroPose } from '../rig/types';
import { defaultAccessories } from '../accessories/types';

const STORAGE_KEY = 'winston2:looks';

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
    expect(loadLook('alpha')).toEqual(migrateLookToV2(look));
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

  it('migrates a v1 look into expanded wardrobe slots', () => {
    const oldLook: LookV1 = {
      version: 1,
      pose: zeroPose(),
      accessories: { head: 'witch', neck: 'scarf', body: 'cape', feet: 'boots' },
      environment: 'forest',
    };

    expect(migrateLookToV2(oldLook)).toMatchObject({
      version: 2,
      wardrobe: {
        head: 'witch-hat',
        face: 'none',
        neck: 'scarf',
        body: 'none',
        back: 'cape',
        feet: 'boots',
      },
      environment: 'forest',
    });
  });

  it('keeps v2 looks stable when migrating', () => {
    const look: LookV2 = {
      version: 2,
      pose: zeroPose(),
      wardrobe: {
        head: 'crown',
        face: 'sunglasses',
        neck: 'none',
        body: 'tutu',
        back: 'cape',
        feet: 'boots',
      },
      environment: 'studio',
    };

    expect(migrateLookToV2(look)).toEqual(look);
  });

  it('defaults malformed v1 accessories to empty wardrobe slots', () => {
    const look = {
      version: 1,
      pose: zeroPose(),
      environment: 'studio',
    };

    expect(migrateLookToV2(look as unknown as Look)).toMatchObject({
      version: 2,
      wardrobe: {
        head: 'none',
        face: 'none',
        neck: 'none',
        body: 'none',
        back: 'none',
        feet: 'none',
      },
    });
  });

  it('merges malformed v2 wardrobe data with default slots', () => {
    const look = {
      version: 2,
      pose: zeroPose(),
      wardrobe: { head: 'crown', feet: 'boots' },
      environment: 'studio',
    };

    expect(migrateLookToV2(look as unknown as Look)).toMatchObject({
      version: 2,
      wardrobe: {
        head: 'crown',
        face: 'none',
        neck: 'none',
        body: 'none',
        back: 'none',
        feet: 'boots',
      },
    });
  });

  it('loadLook safely normalizes malformed stored entries', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        broken: {
          version: 1,
          environment: 'forest',
        },
      }),
    );

    expect(() => loadLook('broken')).not.toThrow();
    expect(loadLook('broken')).toMatchObject({
      version: 2,
      wardrobe: {
        head: 'none',
        face: 'none',
        neck: 'none',
        body: 'none',
        back: 'none',
        feet: 'none',
      },
      environment: 'forest',
    });
  });
});

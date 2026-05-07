import { describe, expect, it } from 'vitest';
import { buildFurNormalMap } from './furNormalMap';

describe('buildFurNormalMap', () => {
  it('produces an RGBA texture of the requested size', () => {
    const tex = buildFurNormalMap(64, 16, 1);
    expect(tex.image.width).toBe(64);
    expect(tex.image.height).toBe(64);
    const data = tex.image.data as Uint8Array;
    expect(data.length).toBe(64 * 64 * 4);
  });

  it('is deterministic for a given seed', () => {
    const a = buildFurNormalMap(32, 8, 42).image.data as Uint8Array;
    const b = buildFurNormalMap(32, 8, 42).image.data as Uint8Array;
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it('encodes blue channel near 255 (mostly-up tangent normals)', () => {
    const tex = buildFurNormalMap(32, 8, 7);
    const data = tex.image.data as Uint8Array;
    let sumB = 0;
    let count = 0;
    for (let i = 2; i < data.length; i += 4) {
      sumB += data[i]!;
      count++;
    }
    const avgB = sumB / count;
    expect(avgB).toBeGreaterThan(200);
  });
});

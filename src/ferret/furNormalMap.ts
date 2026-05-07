import * as THREE from 'three';

// Builds a small tileable RGBA normal map driven by procedural value noise.
// The result encodes a subtle, hairy-looking surface perturbation in tangent
// space (channel mapping: R = nx, G = ny, B = nz, all in 0..255 from -1..1).
export function buildFurNormalMap(textureSize = 256, gridSize = 32, seed = 1337): THREE.DataTexture {
  const heights = generateValueNoise(textureSize, gridSize, seed);
  const data = new Uint8Array(textureSize * textureSize * 4);
  const scale = 1.4; // smaller -> flatter, larger -> bumpier

  for (let y = 0; y < textureSize; y++) {
    for (let x = 0; x < textureSize; x++) {
      const xL = (x - 1 + textureSize) % textureSize;
      const xR = (x + 1) % textureSize;
      const yU = (y - 1 + textureSize) % textureSize;
      const yD = (y + 1) % textureSize;

      const dx = (heights[y * textureSize + xR]! - heights[y * textureSize + xL]!) * scale;
      const dy = (heights[yD * textureSize + x]! - heights[yU * textureSize + x]!) * scale;

      let nx = -dx;
      let ny = -dy;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const i = (y * textureSize + x) * 4;
      data[i] = Math.round((nx * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// Tileable value noise sampled to a `textureSize` height map from a coarse
// `gridSize` x `gridSize` grid of random values, summed across two octaves.
function generateValueNoise(textureSize: number, gridSize: number, seed: number): number[] {
  const rng1 = mulberry32(seed);
  const rng2 = mulberry32(seed ^ 0x9e3779b9);
  const grid1 = randomGrid(gridSize, rng1);
  const grid2 = randomGrid(gridSize * 2, rng2);

  const out: number[] = new Array(textureSize * textureSize);
  for (let y = 0; y < textureSize; y++) {
    for (let x = 0; x < textureSize; x++) {
      const u = x / textureSize;
      const v = y / textureSize;
      const a = sampleTileable(grid1, gridSize, u, v);
      const b = sampleTileable(grid2, gridSize * 2, u, v);
      out[y * textureSize + x] = a * 0.6 + b * 0.4;
    }
  }
  return out;
}

function randomGrid(size: number, rng: () => number): number[] {
  const out: number[] = new Array(size * size);
  for (let i = 0; i < out.length; i++) out[i] = rng();
  return out;
}

function sampleTileable(grid: number[], size: number, u: number, v: number): number {
  const x = u * size;
  const y = v * size;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % size;
  const y1 = (y0 + 1) % size;
  const fx = smoothstep(x - x0);
  const fy = smoothstep(y - y0);
  const a = grid[(y0 % size) * size + (x0 % size)]!;
  const b = grid[(y0 % size) * size + x1]!;
  const c = grid[y1 * size + (x0 % size)]!;
  const d = grid[y1 * size + x1]!;
  return (1 - fx) * (1 - fy) * a + fx * (1 - fy) * b + (1 - fx) * fy * c + fx * fy * d;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let cached: THREE.DataTexture | null = null;
export function getFurNormalMap(): THREE.DataTexture {
  if (cached === null) cached = buildFurNormalMap();
  return cached;
}

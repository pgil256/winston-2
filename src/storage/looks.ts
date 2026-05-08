import type { BoneId, EulerXYZ, Pose } from '../rig/types';
import { BONE_IDS, zeroPose } from '../rig/types';
import type { Accessories } from '../accessories/types';
import type { EnvironmentId } from '../environments/types';
import { defaultWardrobeSelection, type WardrobeSelection } from '../wardrobe/types';

export interface LookV1 {
  readonly version: 1;
  readonly pose: Pose;
  readonly accessories: Accessories;
  readonly environment: EnvironmentId;
}

export interface LookV2 {
  readonly version: 2;
  readonly pose: Pose;
  readonly wardrobe: WardrobeSelection;
  readonly environment: EnvironmentId;
}

export type Look = LookV1 | LookV2;

const HAT_ID_MAP = {
  none: 'none',
  top: 'top-hat',
  party: 'party-hat',
  witch: 'witch-hat',
  cowboy: 'cowboy-hat',
} as const;

const NECK_ID_MAP = {
  none: 'none',
  bowtie: 'bowtie',
  collar: 'collar',
  scarf: 'scarf',
} as const;

const BODY_ID_MAP = {
  none: { body: 'none', back: 'none' },
  sweater: { body: 'sweater', back: 'none' },
  cape: { body: 'none', back: 'cape' },
  tutu: { body: 'tutu', back: 'none' },
} as const;

const FEET_ID_MAP = {
  none: 'none',
  socks: 'socks',
  boots: 'boots',
} as const;

const STORAGE_KEY = 'winston2:looks';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function mapValue<T extends Record<string, unknown>>(map: T, value: unknown, fallback: T[keyof T]): T[keyof T] {
  return typeof value === 'string' && value in map ? map[value as keyof T] : fallback;
}

function normalizePose(value: unknown): Pose {
  const fallback = zeroPose();
  if (!isRecord(value)) return fallback;

  const pose = { ...fallback } as Record<BoneId, EulerXYZ>;
  for (const id of BONE_IDS) {
    const rotation = value[id];
    if (
      Array.isArray(rotation) &&
      typeof rotation[0] === 'number' &&
      typeof rotation[1] === 'number' &&
      typeof rotation[2] === 'number'
    ) {
      pose[id] = [rotation[0], rotation[1], rotation[2]];
    }
  }
  return pose;
}

function normalizeEnvironment(value: unknown): EnvironmentId {
  return typeof value === 'string' ? (value as EnvironmentId) : 'studio';
}

function readAll(): Record<string, unknown> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, unknown>): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function saveLook(name: string, look: Look): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const all = readAll();
  all[trimmed] = look;
  writeAll(all);
}

export function loadLook(name: string): LookV2 | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const all = readAll();
  const look = all[trimmed];
  return look ? migrateLookToV2(look) : null;
}

export function listLooks(): string[] {
  return Object.keys(readAll()).sort();
}

export function deleteLook(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const all = readAll();
  delete all[trimmed];
  writeAll(all);
}

export function migrateLookToV2(look: unknown): LookV2 {
  if (!isRecord(look)) {
    return {
      version: 2,
      pose: zeroPose(),
      wardrobe: defaultWardrobeSelection(),
      environment: 'studio',
    };
  }

  if (look.version === 2) {
    const wardrobe = isRecord(look.wardrobe) ? look.wardrobe : {};
    return {
      version: 2,
      pose: normalizePose(look.pose),
      wardrobe: {
        ...defaultWardrobeSelection(),
        ...wardrobe,
      },
      environment: normalizeEnvironment(look.environment),
    };
  }

  const accessories = isRecord(look.accessories) ? look.accessories : {};
  const bodyBack = mapValue(BODY_ID_MAP, accessories.body, BODY_ID_MAP.none);
  return {
    version: 2,
    pose: normalizePose(look.pose),
    wardrobe: {
      head: mapValue(HAT_ID_MAP, accessories.head, 'none'),
      face: 'none',
      neck: mapValue(NECK_ID_MAP, accessories.neck, 'none'),
      body: bodyBack.body,
      back: bodyBack.back,
      feet: mapValue(FEET_ID_MAP, accessories.feet, 'none'),
    },
    environment: normalizeEnvironment(look.environment),
  };
}

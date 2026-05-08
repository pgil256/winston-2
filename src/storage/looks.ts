import type { Pose } from '../rig/types';
import type { Accessories } from '../accessories/types';
import type { EnvironmentId } from '../environments/types';
import type { WardrobeSelection } from '../wardrobe/types';

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

function readAll(): Record<string, Look> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Look>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Look>): void {
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

export function migrateLookToV2(look: Look): LookV2 {
  if (look.version === 2) return look;
  const bodyBack = BODY_ID_MAP[look.accessories.body] ?? BODY_ID_MAP.none;
  return {
    version: 2,
    pose: look.pose,
    wardrobe: {
      head: HAT_ID_MAP[look.accessories.head] ?? 'none',
      face: 'none',
      neck: NECK_ID_MAP[look.accessories.neck] ?? 'none',
      body: bodyBack.body,
      back: bodyBack.back,
      feet: FEET_ID_MAP[look.accessories.feet] ?? 'none',
    },
    environment: look.environment,
  };
}

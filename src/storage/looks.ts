import type { Pose } from '../rig/types';
import type { Accessories } from '../accessories/types';
import type { EnvironmentId } from '../environments/types';

export interface Look {
  readonly version: 1;
  readonly pose: Pose;
  readonly accessories: Accessories;
  readonly environment: EnvironmentId;
}

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

export function loadLook(name: string): Look | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const all = readAll();
  return all[trimmed] ?? null;
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

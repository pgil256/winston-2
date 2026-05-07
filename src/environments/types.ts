export const ENVIRONMENT_IDS = [
  'studio',
  'bedroom',
  'forest',
  'space',
  'beach',
  'lab',
] as const;

export type EnvironmentId = (typeof ENVIRONMENT_IDS)[number];

export const ENVIRONMENT_LABELS: Record<EnvironmentId, string> = {
  studio: 'Studio',
  bedroom: 'Bedroom',
  forest: 'Forest',
  space: 'Space',
  beach: 'Beach',
  lab: 'Lab',
};

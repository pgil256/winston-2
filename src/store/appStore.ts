import { create } from 'zustand';
import type { BoneId, EulerXYZ, Pose } from '../rig/types';
import { BONE_IDS, zeroPose } from '../rig/types';
import { clampRotation } from '../rig/constraints';
import type { Accessories, BodyId, FeetId, HatId, NeckId } from '../accessories/types';
import { defaultAccessories } from '../accessories/types';
import type { EnvironmentId } from '../environments/types';

export interface AppState {
  pose: Pose;
  accessories: Accessories;
  environment: EnvironmentId;

  setBoneRotation: (id: BoneId, rotation: EulerXYZ) => void;
  setPose: (pose: Pose) => void;
  resetPose: () => void;

  setHat: (id: HatId) => void;
  setNeck: (id: NeckId) => void;
  setBody: (id: BodyId) => void;
  setFeet: (id: FeetId) => void;
  resetAccessories: () => void;

  setEnvironment: (id: EnvironmentId) => void;

  resetAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  pose: zeroPose(),
  accessories: defaultAccessories(),
  environment: 'studio',

  setBoneRotation: (id, rotation) =>
    set((state) => ({ pose: { ...state.pose, [id]: clampRotation(id, rotation) } })),

  setPose: (pose) => {
    const clamped = {} as Record<BoneId, EulerXYZ>;
    for (const id of BONE_IDS) clamped[id] = clampRotation(id, pose[id]);
    set({ pose: clamped });
  },

  resetPose: () => set({ pose: zeroPose() }),

  setHat: (id) => set((s) => ({ accessories: { ...s.accessories, head: id } })),
  setNeck: (id) => set((s) => ({ accessories: { ...s.accessories, neck: id } })),
  setBody: (id) => set((s) => ({ accessories: { ...s.accessories, body: id } })),
  setFeet: (id) => set((s) => ({ accessories: { ...s.accessories, feet: id } })),

  resetAccessories: () => set({ accessories: defaultAccessories() }),

  setEnvironment: (id) => set({ environment: id }),

  resetAll: () =>
    set({
      pose: zeroPose(),
      accessories: defaultAccessories(),
      environment: 'studio',
    }),
}));

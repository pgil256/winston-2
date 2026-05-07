import { create } from 'zustand';
import type { BoneId, EulerXYZ, Pose } from '../rig/types';
import { zeroPose } from '../rig/types';
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
    set((state) => ({ pose: { ...state.pose, [id]: rotation } })),

  setPose: (pose) => set({ pose }),

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

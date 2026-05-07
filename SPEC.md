# Winston 2.0 — Specification

A browser-based 3D ferret dress-up app. Procedural geometry, rigged skeleton,
pose presets + manual control, swappable accessories, swappable environments.

## Stack

- Vite + React 18 + TypeScript (strict)
- three, @react-three/fiber, @react-three/drei
- leva for the control panel (sliders/buttons/dropdowns — saves us building UI)
- zustand for app state (pose, accessories, environment)

No backend. No persistence beyond localStorage for "saved looks."

## The Ferret

Procedural geometry only. Built from primitives parented into a bone hierarchy:

root
├── pelvis
│   ├── spine_lower
│   │   └── spine_upper
│   │       ├── neck
│   │       │   └── head
│   │       │       ├── ear_L
│   │       │       ├── ear_R
│   │       │       └── snout
│   │       ├── shoulder_L → upper_arm_L → forearm_L → paw_L
│   │       └── shoulder_R → upper_arm_R → forearm_R → paw_R
│   ├── hip_L → thigh_L → shin_L → foot_L
│   ├── hip_R → thigh_R → shin_R → foot_R
│   └── tail_1 → tail_2 → tail_3 → tail_4

Body parts: stretched capsules (body, limbs, tail segments), spheres (head,
joints), cones (snout, ears). Fur is faked with MeshStandardMaterial +
slight noise normal map. No actual fur shader for v1.

Color: classic sable ferret palette by default — cream belly, dark brown mask
and limbs, lighter brown back. Single material per body part, swappable later.

## Posing

Two layers, both write to the same bone rotation state in zustand:

1. **Preset buttons** — sit, stand, pounce, sleep, war-dance, T-pose (debug).
   Each preset is a `Record<BoneId, [x, y, z]>` of euler rotations in radians.
   Clicking a preset animates over 400ms (lerp current → target).

2. **Manual sliders** — leva folder per bone group (head, spine, arms, legs,
   tail). Each slider writes directly to the bone rotation. Sliders reflect
   the current state, so picking a preset moves the sliders too.

Constraints: clamp each joint to anatomically plausible ranges (e.g., neck
±90° yaw, ±60° pitch). Documented per-bone in `src/rig/constraints.ts`.

## Dress-Up

Four fixed slots, one accessory each:
- **head** — top hat, party hat, witch hat, cowboy hat, none
- **neck** — bowtie, collar with bell, scarf, none
- **body** — sweater, superhero cape, tutu, none
- **feet** — socks (all four), boots (all four), none

Each accessory is procedural geometry parented to its anchor bone. Swapping
is instant. All accessories are TS modules exporting a React component that
takes the bone ref as a prop.

## Environments

Picker dropdown selects one of:
1. **Studio** — neutral grey backdrop, three-point lighting
2. **Bedroom** — wood floor, bed-shaped box, warm lamp light, window with sky
3. **Forest** — ground plane with grass texture, instanced trees (cylinders +
   green spheres), HDRI sky, dappled light
4. **Space** — starfield skybox (drei `<Stars>`), planet sphere, blue rim light
5. **Beach** — sand-colored ground, ocean plane (animated), sun, palm trees
6. **Lab** — white tile, harsh fluorescent lighting, beakers on a table

Each environment is a single React component exporting scene contents +
lighting + fog/background config. Switching unmounts the previous one.

## UI Layout

- Full-viewport `<Canvas>` with OrbitControls (limit polar angle so you can't
  go under the floor).
- Leva panel pinned top-right, collapsible, with folders:
  - Pose Presets (buttons)
  - Manual Pose (slider folders per bone group)
  - Dress Up (4 dropdowns)
  - Environment (1 dropdown)
  - Save/Load Look (buttons + name input → localStorage)
- Bottom-left: small "Winston 2.0" wordmark + reset button.

## Performance Targets

- 60fps on integrated graphics at 1080p
- Single canvas, no postprocessing in v1
- Use `useMemo` for geometry, `useRef` for bone manipulation, no per-frame
  React re-renders for pose changes (mutate refs in `useFrame`)

## Out of scope for v1

- Animation timeline / keyframing
- Exporting screenshots or GLTFs
- Multiple ferrets
- Real fur
- Mobile touch UI (desktop mouse only)

# Winston 2.0 — Build Order

Each task must end with the app building (`npm run build`) and the new
feature visible/interactive. Tick the box only after verifying in-browser.

## Foundations

- [x] Scaffold Vite + React + TS project, strict mode, install deps
- [x] Set up app shell: full-viewport Canvas, OrbitControls, ground plane, ambient + directional light
- [x] Add zustand store with `pose`, `accessories`, `environment` slices
- [x] Add leva panel with placeholder folders matching SPEC.md UI Layout

## Rig

- [x] Define bone hierarchy as a TS data structure (`src/rig/skeleton.ts`)
- [x] Build `<Bone>` component that renders its primitive + recursively renders children, applying rotation from store
- [x] Render full skeleton in T-pose with debug-colored primitives
- [x] Add per-bone rotation constraints from SPEC.md, clamp on write

## Ferret geometry

- [x] Replace debug primitives with proper shapes (capsules for body/limbs, spheres for joints, cones for snout/ears)
- [x] Apply sable color palette via per-part materials
- [x] Add subtle noise normal map for fur fakery
- [x] Tune proportions so it reads as "ferret" not "weasel-snake-thing"

## Posing

- [x] Implement preset definitions (`src/rig/presets.ts`) for T-pose, sit, stand, pounce, sleep, war-dance
- [x] Add preset buttons to leva, click → 400ms lerp to target rotations
- [x] Add manual sliders to leva (folder per bone group), wired to store
- [x] Verify sliders update when a preset is selected (two-way binding via store)

## Dress-up

- [ ] Define accessory anchor refs on the rig (head, neck, body, feet bones expose refs)
- [ ] Build hat accessories (top, party, witch, cowboy) as procedural components
- [ ] Build neck accessories (bowtie, collar+bell, scarf)
- [ ] Build body accessories (sweater, cape, tutu)
- [ ] Build feet accessories (socks ×4, boots ×4)
- [ ] Wire 4 dropdowns in leva, mount selected accessory to its anchor
- [ ] Verify accessories follow bones when ferret is posed

## Environments

- [ ] Studio environment (default)
- [ ] Bedroom environment
- [ ] Forest environment
- [ ] Space environment
- [ ] Beach environment (with animated ocean)
- [ ] Lab environment
- [ ] Environment picker dropdown, swaps cleanly without leaking lights/fog

## Polish

- [ ] Save/load named looks to localStorage (pose + accessories + env)
- [ ] Reset button restores T-pose / no accessories / studio
- [ ] "Winston 2.0" wordmark bottom-left
- [ ] Clamp OrbitControls so camera can't go under the floor
- [ ] README.md with screenshot, install/run instructions, controls explainer

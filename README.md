# Winston 2.0

A browser-based 3D ferret dress-up app. The ferret itself is a Creative
Commons-licensed model from Poly by Google; the wardrobe mixes procedural
pieces with a small set of credited CC0 GLB accessories.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

- `npm run build` — type-check and produce a production build in `dist/`
- `npm run typecheck` — TypeScript strict-mode check
- `npm test` — run the unit test suite (Vitest)

## Controls

The main wardrobe panel (top-left) provides the player-facing outfit controls:

| Control | Purpose |
| --- | --- |
| **Wardrobe** | Six slot tabs for Head, Face, Neck, Body, Back, and Feet. Pick item tiles, clear a slot, reset the outfit, randomize, and save/load named looks. |
| **Environment** | Picks the surrounding scene: studio, bedroom, forest, space, beach, lab. |
| **Save / Load Look** | Type a name and **Save** the current pose, wardrobe, and environment to `localStorage`. **Load** restores by name. **Reset Outfit** clears the wardrobe. |

Other UI:

- **Camera** — left-drag to orbit, scroll to zoom, right-drag to pan. The camera is clamped so it can't dip below the floor.
- **Bottom-left** — wordmark and quick reset button.

## Stack

- Vite + React 18 + TypeScript (strict)
- three, @react-three/fiber, @react-three/drei
- leva (control panel)
- zustand (app state)
- vitest (tests)

No backend; saved looks live in `localStorage` only. The base ferret GLB and
credited wardrobe GLBs live under `public/models/`; procedural accessories,
environments, and the fur normal map are generated in code.

## Project layout

```
src/
  rig/           bone hierarchy, constraints, presets, lerp animation, <Bone>
  ferret/        per-bone palette and procedural fur normal map
  accessories/   legacy procedural hats, neck pieces, body pieces, feet wear
  environments/  studio, bedroom, forest, space, beach, lab
  scene/         top-level <Scene>
  store/         zustand store with pose / wardrobe / environment slices
  storage/       named-look persistence to localStorage
  wardrobe/      wardrobe slots, anchors, registry, procedural/GLB renderer
  ui/            wardrobe panel and environment control panel
  App.tsx        Canvas, OrbitControls, Leva, WardrobePanel, BottomLeftCorner
```

## Notes

The ferret is a single static glTF mesh (no skeleton), so pose presets and
manual rotation sliders are not exposed in the app. Wardrobe items are placed
on measured anchors around the static model; GLB accessories use per-item
transforms while procedural pieces render directly in React Three Fiber. The
procedural rig code (bone hierarchy, constraints, presets, lerp animation) is
still present in `src/rig/` and remains tested — it's available for a future
iteration that swaps in a rigged ferret.

## Credits

The ferret model is **"Ferret"** by **Poly by Google**, originally distributed
on Google Poly and now archived at
[poly.pizza/m/4I1SBFHWuSo](https://poly.pizza/m/4I1SBFHWuSo). Licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). See
`public/models/CREDITS.md` for full attribution.

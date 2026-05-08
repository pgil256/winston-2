# Winston 2.0

A browser-based 3D ferret dress-up app. The ferret itself is a Creative
Commons-licensed model from Poly by Google; everything around it — accessories,
environments, lighting, and UI — is procedural.

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

The control panel (top-right, expandable) groups every control into folders:

| Folder | Purpose |
| --- | --- |
| **Dress Up** | Four dropdowns for swappable accessories: a hat (top/party/witch/cowboy), a neck piece (bowtie/collar+bell/scarf), a body piece (sweater/cape/tutu), and feet wear (socks ×4 / boots ×4). |
| **Environment** | Picks the surrounding scene: studio, bedroom, forest, space, beach, lab. |
| **Save / Load Look** | Type a name and **Save** the current pose, accessories, and environment to `localStorage`. **Load** restores by name. **Reset** clears everything to T-pose / no accessories / studio. |

Other UI:

- **Camera** — left-drag to orbit, scroll to zoom, right-drag to pan. The camera is clamped so it can't dip below the floor.
- **Bottom-left** — wordmark and quick reset button.

## Stack

- Vite + React 18 + TypeScript (strict)
- three, @react-three/fiber, @react-three/drei
- leva (control panel)
- zustand (app state)
- vitest (tests)

No backend; saved looks live in `localStorage` only. All ferret geometry,
hats, environments, and the procedural fur normal map are generated in code —
no external 3D assets.

## Project layout

```
src/
  rig/           bone hierarchy, constraints, presets, lerp animation, <Bone>
  ferret/        per-bone palette and procedural fur normal map
  accessories/   hats, neck pieces, body pieces, feet wear, anchor wiring
  environments/  studio, bedroom, forest, space, beach, lab
  scene/         top-level <Scene>
  store/         zustand store with pose / accessories / environment slices
  storage/       named-look persistence to localStorage
  ui/            leva control panel
  App.tsx        Canvas, OrbitControls, Leva, BottomLeftCorner
```

## Notes

The ferret is a single static glTF mesh (no skeleton), so pose presets and
manual rotation sliders are not exposed in v1. Accessories anchor to fixed
offsets relative to the model. The procedural rig code (bone hierarchy,
constraints, presets, lerp animation) is still present in `src/rig/` and
remains tested — it's available for a future iteration that swaps in a rigged
ferret.

## Credits

The ferret model is **"Ferret"** by **Poly by Google**, originally distributed
on Google Poly and now archived at
[poly.pizza/m/4I1SBFHWuSo](https://poly.pizza/m/4I1SBFHWuSo). Licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). See
`public/models/CREDITS.md` for full attribution.

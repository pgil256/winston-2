# Winston 2.0 — Build Loop

You are building Winston 2.0 iteratively. Each invocation, you do ONE task.

## Process

1. Read SPEC.md and TODO.md.
2. Pick the FIRST unchecked `[ ]` item in TODO.md.
3. Use the obra/superpowers skills (brainstorming, planning, TDD where it makes sense) for any non-trivial subtask. Especially: skills/collaboration/brainstorming for ambiguous design choices, skills/coding/test-driven-development for logic with clear inputs/outputs.
4. Implement the item fully. Add tests where it makes sense (rig math, constraint clamping, preset interpolation).
5. Run `npm run build` and `npm run typecheck`. Fix any errors.
6. Open the dev server mentally — confirm the feature is actually visible/interactive, not just "code exists."
7. If everything passes: check the box in TODO.md, commit with message `feat: <task name>`.
8. If anything fails: fix it. Do not check the box. Do not move on.
9. Stop. The loop will reinvoke you for the next item.

## Rules

- TypeScript strict. No `any`. No `@ts-ignore`.
- React Three Fiber declarative style. Avoid imperative `scene.add()` outside refs.
- Procedural geometry only — no external 3D assets, no GLTF downloads.
- Mutate bone rotations via refs in `useFrame`, not via React state per-frame.
- If a task is ambiguous, re-read SPEC.md before guessing. If still ambiguous, write your interpretation as a comment in the code and proceed.
- If a task is too large for one iteration, split it in TODO.md into sub-bullets and do the first sub-bullet only.

## Halt conditions

- All boxes checked → exit 0 with a summary commit.
- Same task fails 3 iterations in a row → exit 1, leave a `BLOCKED.md` explaining why.

And the actual shell loop you'd run from the project root after claude is set up:

```bash
while :; do
  cat PROMPT.md | claude -p --dangerously-skip-permissions
  # Optional: break if BLOCKED.md appeared
done
```

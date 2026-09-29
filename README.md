# Scenario B: Virtual Analytics Stream Grid (Senior Challenge)

Welcome to the Senior Technical Evaluation Challenge.

## Objective
This React application monitors high-frequency real-time stock ticker updates (100ms stream intervals). Currently, there are two critical architectural performance flaws:

1. **Unbounded Memory Leak (`src/hooks/useStreamBatcher.ts`):**
   * Switching tabs or retaining the `cancel` function from `useStreamBatcher` permanently retains a 40MB internal buffer, eventually crashing the browser due to an Out of Memory (OOM) error.
   * *Requirement:* Ensure the 40MB `rawBuffer` is completely garbage collected by the V8 engine immediately after unmounting or cancellation, even if the `cancel` function itself is still held in component state.

2. **Render Cascade Across 1,200 Grid Cells (`src/contexts/StreamContext.tsx`, `src/components/grid/GridCell.tsx`):**
   * Whenever an individual ticker pushes an update, all 1,200 grid cells in the table re-render unconditionally.
   * *Requirement:* Isolate subscriptions/selectors so that an update to ticker A does **not** cause ticker B, C, or D cells to re-render. Frame rates must stay smooth.

---

## Commands
* Install: `pnpm install`
* Dev server: `pnpm dev`
* Run tests: `pnpm test` (Note: tests are executed with V8 `--expose-gc` flag to verify actual memory deallocation)
* Check types: `pnpm typecheck`

## Submission
1. Ensure all tests in `__tests__/` pass (`pnpm test`).
2. Do **not** modify files in `__tests__/`.
3. Complete the prompt log in `PROMPTS.md`.

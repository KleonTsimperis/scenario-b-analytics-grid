# Senior Engineering Sprint: Production Architecture & Performance (Scenario B)

**Welcome to the Senior Technical Evaluation Sprint.**  
You have been assigned two critical performance and memory bug tickets reported by Site Reliability Engineering on our high-frequency live market telemetry grid. Review the tickets below, inspect the codebase, and submit your architectural fixes.

---

## 🎫 Ticket 1: [BUG-2001] Production Browser Tab OOM Crash (V8 Closure Memory Leak)
* **Issue Type:** Bug  
* **Priority:** Blocker  
* **Reporter:** SRE / Production Telemetry  
* **Components:** Analytics / WebSocket Engine / Streaming Hooks  

### Description:
Users monitoring the live ticker feed for extended periods report that their browser tabs eventually freeze and crash with an Out of Memory (OOM) error. Heap profiler captures show that internal 40MB telemetry calculation buffers are never collected by the garbage collector, even after telemetry batching is cancelled or components unmount.

### Steps to Reproduce:
1. Start the dev server (`pnpm dev`) and open `http://localhost:3001`.
2. Click the *"Cancel / Pause Batcher"* button on the Candidate HUD widget or table header.
3. Take a heap snapshot in Chrome DevTools: observe that the 40MB `ArrayBuffer` remains pinned in heap memory despite `clearTimeout` being called.

### Acceptance Criteria:
* When telemetry batching is cancelled or unmounted, any associated raw memory buffers must be promptly eligible for V8 garbage collection.
* The cancellation closure must not pin heavy buffers via shared lexical scope Context Records.
* The test in `__tests__/streamLeak.test.tsx` must pass without modifications to the test file.

---

## 🎫 Ticket 2: [BUG-2002] Severe Frame Drops: 1,200 Grid Cells Re-render on Every Ticker Tick
* **Issue Type:** Performance  
* **Priority:** Critical  
* **Reporter:** UX & Frontend Architecture  
* **Components:** DataGrid / StreamContext / Cell Components  

### Description:
During market hours, the WebSocket engine pushes price updates every 100ms. Profiling shows that an update to an individual symbol (e.g. `AAPL`) triggers a re-render cascade across all 1,200 cells in the grid, dropping framerate from 60 FPS to under 15 FPS.

### Steps to Reproduce:
1. Observe the live grid at `http://localhost:3001`.
2. Notice CPU usage spikes and input lag when interacting with the table or switching tabs.
3. Check cell render counters in the DOM: every tick increments the render count for every cell, regardless of whether that ticker's price changed.

### Acceptance Criteria:
* An update to ticker X must **only** re-render the specific cells associated with ticker X.
* Unrelated tickers (e.g. `MSFT`, `GOOGL`) must maintain their render count and not re-evaluate when `AAPL` updates.
* The test in `__tests__/renderCascade.test.tsx` must pass without modifications to the test file.

---

## 📋 General Sprint Guidelines & Submission Checklist
- [ ] Run `pnpm test` to verify both tests pass.
- [ ] Run `pnpm typecheck` to verify no TypeScript compilation errors.
- [ ] Do **not** alter the test assertions in `__tests__/`.
- [ ] Complete the prompt log and Root Cause Analysis (RCA) in `PROMPTS.md`.

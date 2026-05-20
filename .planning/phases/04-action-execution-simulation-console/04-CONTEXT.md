# Phase 4: Action Execution & Simulation Console - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Screen 5 (`src/app/simulation.tsx`) displaying:
- An interactive simulation console where the user can preview, edit, and click "Execute/Simulate" on individual action items recommended in Phase 3.
- Live terminal-style logs showing each simulated step running to completion.
</domain>

## Essentials

### Technical Constraints
- The UI must dynamically read the simulation logs from the Convex backend based on the active run.
- Styling must match the premium dark mode Slate/Cyan theme.
- The terminal-style log output should be visually distinct (e.g., monospace font, dark background, color-coded status messages).

### Architectural Decisions
- The simulation data is already populated in Phase 2's `simulateLoop` action. The frontend just needs to display it reactively.
- The screen will retrieve the `runId` from route parameters.

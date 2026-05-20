# Phase 5: Evaluation & Outcome Visualization - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Screen 6 (`src/app/results.tsx`) displaying:
- The final outcomes and business projections based on simulated actions.
- Visual comparisons of metrics (e.g., bar charts or data tables comparing 'before' and 'after' states).
- A concluding action allowing the user to restart the entire simulation flow.
</domain>

## Essentials

### Technical Constraints
- Connect reactively to the Convex backend to read the `evaluation` payload from the active run.
- Build clean data visualization components without relying on heavy external chart libraries unless absolutely necessary. CSS-based bar charts or simple flex layouts are preferred to minimize payload and dependencies.
- Ensure styling stays true to the established Slate/Cyan premium dark theme.

### Architectural Decisions
- The `evaluation` data containing the 'before', 'after', and 'change' metrics is already populated in Phase 2's `simulateLoop` action.
- The UI simply acts as a robust presentation layer mapping this existing schema.

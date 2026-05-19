# Phase 3: Observation & Reasoning Agents - Context

**Gathered:** 2026-05-19
**Status:** Completed ✓

<domain>
## Phase Boundary

Implement Screen 3 (`src/app/dashboard.tsx`) and Screen 4 (`src/app/actions.tsx`) displaying:
- Screen 3 (Insights Dashboard): Key metric grids with status indicators (good, bad, warn), detected anomalies lists, and root cause analysis panels.
- Screen 4 (Recommended Actions): Ranked recommendations, category badges, impact score bars, selection checkboxes, and simulation trigger CTA.
</domain>

## Essentials

### Technical Constraints
- Must fetch dynamic data reactively from the Convex backend run model.
- Styling must strictly align with Slate/Cyan dark mode brand theme.
- Support responsive layout configurations.

### Architectural Decisions
- Retrieve `runId` from the route params to display matching run context.
- Use local React state to track user's checked recommendations for simulation triggering.

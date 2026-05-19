# Phase 2: Realtime State Machine & Timeline - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the backend state machine logic in Convex to transition the run across the 5 agent stages:
1. **Observe** (Insight Agent)
2. **Reason** (Root Cause Agent)
3. **Decide** (Strategy Agent)
4. **Act** (Execution Simulation Agent)
5. **Evaluate** (Evaluation Agent)

Build the interactive frontend Screen 2 (`src/app/timeline.tsx`) displaying:
- Current active agent state.
- Step-by-step progress list with dynamic log messages.
- Animated/indicator indicators showing which agent is working.
- Autoplay/simulate toggle button triggering the state transitions sequentially.
</domain>

## Essentials

### Technical Constraints
- Must use standard Convex queries/mutations mapped to the react-native app views.
- Logs and transitions must update in real-time using Convex's reactive engine.
- Layout must be responsive, modern, dark-themed, and utilize the customized Outfit font family.

### Architectural Decisions
- The timeline will render the log entries array from the Convex run document.
- Transitions will be simulated in Phase 2 via a mock script/mutation chain that pushes progress logs and updates the `step` status after specific intervals (e.g. 1.5 seconds per step) to let us evaluate the visual UX transition before coding the final LLM backend.

## Boundaries

- Frontend styling must strictly conform to the Slate and Cyan premium theme colors.
- Interactive controls must support restarting the run.
- LLM prompt execution itself is out of scope for Phase 2 (handled in Phase 3/4/5).

## Scenarios

### Scenario 1: Initial load
When the user arrives on `/timeline` with a `runId`, the app subscribes to the run using `useQuery(api.runs.get, { runId })`. It shows the first log ("Ingesting dataset: ...") and shows the "Observe" step in an active state.

### Scenario 2: Simulation timeline playback
If the user clicks "Start Simulation" (or if it triggers automatically), a Convex mutation is called to run the simulated transition. Every 1.5 seconds, the run updates:
- Step transitions from Observe → Reason → Decide → Act → Evaluate.
- Appropriate logs are appended for the active agent.
- The UI animates the active agent node with a pulse or glow indicator.

### Scenario 3: Realtime sync
If multiple instances are open, the UI updates simultaneously in real time.

# Roadmap: GrowthPilot AI

## Overview

GrowthPilot AI is implemented as a premium React Native Expo mobile application integrated with Convex as its real-time database and orchestration backend. This roadmap structures development into five distinct phases, moving from initializing the project shell and data schema up to implementing the complete agentic pipeline: Observe, Reason, Decide, Act, and Evaluate.

## Phases

- [x] **Phase 1: Foundation & Intake System** - Setup mobile shell, Convex backend schema, and initial upload UI.
- [x] **Phase 2: Realtime State Machine & Timeline** - Build the realtime orchestrator and interactive AI agent timeline.
- [x] **Phase 3: Observation & Reasoning Agents** - Implement the Intake, Insight, Root Cause, and Strategy agents and dashboard.
- [ ] **Phase 4: Action Execution & Simulation Console** - Build the Execution Agent and interactive simulation terminal.
- [ ] **Phase 5: Evaluation & Outcome Visualization** - Build the Evaluation Agent and before-vs-after outcome graphs.

---

## Phase Details

### Phase 1: Foundation & Intake System
- **Goal**: Initialize the Expo app with the core design brand tokens, configure Convex schema, and build the initial report intake and demo data selector UI.
- **Depends on**: Nothing
- **Requirements**: [INTK-01, INTK-02, CONV-01, UIUX-01, UIUX-02]
- **Success Criteria**:
  1. The Expo application compiles and runs successfully on mobile environments (simulator or device).
  2. The database schema is deployed to Convex, and the app connects to the Convex real-time client.
  3. User can upload a CSV/PDF or click "Load Demo Dataset" and see the system capture the initial file state.
- **Plans**: 3 plans

Plans:
- [x] 01-01: Initialize React Native Expo app with dark-mode styles, typography, and page router
- [x] 01-02: Setup Convex backend, deploy schema, and connect real-time client
- [x] 01-03: Create Screen 1 (File Upload & Demo Selector) with drop zones and demo cards

### Phase 2: Realtime State Machine & Timeline
- **Goal**: Implement the Convex real-time state machine to process and sync agent status, and build the live AI agent execution timeline screen.
- **Depends on**: Phase 1
- **Requirements**: [CONV-02, CONV-03, UIUX-03]
- **Success Criteria**:
  1. The backend triggers status transitions (Observe → Reason → Decide → Act → Evaluate) automatically or step-by-step.
  2. The mobile app subscribes to the active agent run and displays live execution progress.
  3. The agent reasoning timeline updates smoothly with animations indicating which agent is working.
- **Plans**: 2 plans

Plans:
- [x] 02-01: Build Convex state machine mutations for managing multi-agent run transitions
- [x] 02-02: Create Screen 2 (Interactive AI Timeline screen) with animated agent logs

### Phase 3: Observation & Reasoning Agents
- **Goal**: Implement the Intake, Insight, Root Cause, and Strategy agents on the backend, and present their outputs in the Insights and Recommendation screens.
- **Depends on**: Phase 2
- **Requirements**: [INTK-03, REAS-01, REAS-02, REAS-03, UIUX-04, UIUX-05]
- **Success Criteria**:
  1. Intake Agent extracts KPIs from the CSV or PDF uploaded by the user.
  2. Insight and Root Cause agents analyze extracted KPIs to flag anomalies and provide reasoning about causes.
  3. Strategy Agent displays a ranked list of recommended actions on Screen 4, where the user can tap or select.
- **Plans**: 2 plans

Plans:
- [x] 03-01: Implement LLM prompt structures and orchestrate Intake, Insight, Root Cause, and Strategy agents
- [x] 03-02: Build Screen 3 (Insights Dashboard) and Screen 4 (Recommended Actions)

### Phase 4: Action Execution & Simulation Console
- **Goal**: Implement the Execution Agent to simulate actions (CRM, WhatsApp, Ads) and build the interactive simulation screen.
- **Depends on**: Phase 3
- **Requirements**: [EXEC-01, EXEC-02, EXEC-03, UIUX-06]
- **Success Criteria**:
  1. Execution Agent generates simulation steps (drafts WhatsApp messages, updates CRM mock endpoints).
  2. User can interactively preview, edit, and click "Execute/Simulate" on individual action items.
  3. Screen 5 displays live terminal-style logs showing each simulated step running to completion.
- **Plans**: 2 plans

Plans:
- [ ] 04-01: Build Execution Agent framework for generating and validating simulated actions
- [ ] 04-02: Build Screen 5 (Action Simulation Console) with editable forms and interactive log console

### Phase 5: Evaluation & Outcome Visualization
- **Goal**: Implement the Evaluation Agent to project business outcomes, display before-vs-after outcome graphs, and tie the entire pipeline together.
- **Depends on**: Phase 4
- **Requirements**: [EVAL-01, EVAL-02, UIUX-07]
- **Success Criteria**:
  1. Evaluation Agent runs to project outcome changes (conversion boost, revenue growth) based on simulated actions.
  2. Screen 6 displays clear before-vs-after visualizations (bar/line charts) of metrics.
  3. User can restart the entire flow from the results screen.
- **Plans**: 2 plans

Plans:
- [ ] 05-01: Implement Evaluation Agent outcomes projections
- [ ] 05-02: Create Screen 6 (Evaluation Results) with outcome charts, verify end-to-end flow

---

## Progress

Execution Order:
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Intake System | 3/3 | Completed | 2026-05-19 |
| 2. Realtime State Machine & Timeline | 2/2 | Completed | 2026-05-19 |
| 3. Observation & Reasoning Agents | 2/2 | Completed | 2026-05-19 |
| 4. Action Execution & Simulation Console | 0/2 | Not started | - |
| 5. Evaluation & Outcome Visualization | 0/2 | Not started | - |

**UI hint**: yes (all phases have frontend UI screens)
*Roadmap defined: 2026-05-19*
*Last updated: 2026-05-19 after initial roadmap creation*

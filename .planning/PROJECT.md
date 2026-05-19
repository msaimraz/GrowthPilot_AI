# GrowthPilot AI

## What This Is

GrowthPilot AI is a production-quality mobile app built with React Native (Expo) and Convex. It functions as an autonomous AI growth operator that ingests business reports (PDF/CSV) and guides the user through an agentic feedback loop: Observe (Intake), Reason (Insight & Root Cause), Decide (Strategy), Act (Execution Simulation), and Evaluate (Outcome Visualization). This system is designed to act as an active growth partner, simulating and executing operations rather than simply summarizing data.

## Core Value

Empower businesses to transition from data overload to automated, simulated, and evaluated growth actions using an explicit multi-agent workflow.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **INTK-01**: User can upload CSV or PDF reports (or select a demo dataset) to the Intake Agent
- [ ] **INST-01**: Insight Agent parses reports to detect anomalies, key trends, and performance metrics
- [ ] **RTCS-01**: Root Cause Agent performs reasoning to explain why business performance metrics changed
- [ ] **STRT-01**: Strategy Agent generates, ranks, and recommends actionable growth steps with impact scores
- [ ] **EXEC-01**: Execution Agent runs interactive simulations of selected actions (CRM updates, WhatsApp messaging drafts, campaign configs, segment creations)
- [ ] **EVAL-01**: Evaluation Agent projects business outcomes and displays before-vs-after visual impact charts
- [ ] **SCHM-01**: Convex realtime schema and mutations to store, sync, and stream agent states and reports
- [ ] **UIUX-01**: Premium mobile UI showing agent timeline, interactive dashboards, and simulated logs with animations

### Out of Scope

- [Exclusion 1] — Real third-party API mutations (e.g. actual WhatsApp sending, real CRM writes) — Defer to post-hackathon v2 to ensure safety and quick development. Instead, simulate logs and actions interactively.
- [Exclusion 2] — Multi-tenant team roles — Focus only on single owner/operator mode for the hackathon.

## Context

- Target Hackathon: AISeekho2026 Challenge 1 (Autonomous Content-to-Action Agent)
- The app must display a clear agentic reasoning timeline (Observe → Reason → Decide → Act → Evaluate)
- Multi-Agent logs/traces must be visually engaging and feel premium
- Realtime state updates are powered by Convex

## Constraints

- **Platform**: React Native (Expo) — Mobile app prototype is mandatory.
- **Backend & Realtime**: Convex — Core database and logic synchronization layer.
- **Design System**: Premium modern UI with custom dark mode, smooth transitions, and charts.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native Expo | Mobile first prototype is mandatory for Challenge 1, Expo ensures rapid cross-platform deployment | — Pending |
| Convex Backend | Realtime sync and query mechanisms allow instant streaming of agent execution states | — Pending |
| Local/Mock Execution for integrations | Simulating CRM and WhatsApp updates avoids API key configuration issues during judging while fully demonstrating agent capabilities | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-19 after initialization*

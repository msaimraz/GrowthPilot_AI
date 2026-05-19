# Requirements: GrowthPilot AI

**Defined:** 2026-05-19
**Core Value:** Businesses upload reports and an autonomous multi-agent system observes, reasons, decides, simulates, and evaluates growth actions using a premium Expo and Convex architecture.

## v1 Requirements

### Authentication & Intake (INTK)

- [ ] **INTK-01**: User can upload CSV or PDF reports in the app.
- [ ] **INTK-02**: User can select a pre-populated Demo Dataset (e.g., Meta Ads + Shopify sales data) for instant demonstration.
- [ ] **INTK-03**: Intake Agent parses the uploaded files (PDF/CSV) to extract key performance indicators (KPIs).

### Realtime Backend & Data Layer (CONV)

- [ ] **CONV-01**: Configure Convex schema to store uploads, agent reasoning steps, actions, and simulations in realtime.
- [ ] **CONV-02**: Convex mutations to advance agent state and trigger subsequent agents in the flow.
- [ ] **CONV-03**: Realtime subscriptions to stream agent reasoning updates to the mobile UI.

### Multi-Agent Reasoning (REAS)

- [ ] **REAS-01**: **Insight Agent** detects anomalies (e.g., traffic increase vs conversion drop) and performance metrics.
- [ ] **REAS-02**: **Root Cause Agent** reasons about why performance metrics changed (e.g., checkout CTA bug on mobile).
- [ ] **REAS-03**: **Strategy Agent** generates and ranks recommended growth actions with projected business impact.

### Execution & Simulation (EXEC)

- [ ] **EXEC-01**: **Execution Agent** simulates actions (e.g., drafting a WhatsApp recovery message, creating customer segment, CRM update).
- [ ] **EXEC-02**: User can interactively preview, edit, and approve/simulate each step of the generated action.
- [ ] **EXEC-03**: Logs and step-by-step progress trace for the simulation are generated in real-time.

### Evaluation & Visualization (EVAL)

- [ ] **EVAL-01**: **Evaluation Agent** calculates the projected business outcome (e.g., conversion boost, revenue increase).
- [ ] **EVAL-02**: Interactive before-vs-after outcome comparison chart is displayed to the user.

### Premium Mobile UI (UIUX)

- [ ] **UIUX-01**: Premium modern dashboard styling (dark mode, Outfit/Inter font, subtle micro-animations).
- [ ] **UIUX-02**: Screen 1 — File Upload & Demo Selector.
- [ ] **UIUX-03**: Screen 2 — Interactive AI Agent Timeline displaying the active agent execution trace (Observe → Reason → Decide → Act → Evaluate).
- [ ] **UIUX-04**: Screen 3 — Insights Dashboard displaying key metrics, charts, and detected anomalies.
- [ ] **UIUX-05**: Screen 4 — Ranked Recommended Actions with swipe/tap to select.
- [ ] **UIUX-06**: Screen 5 — Action Simulation Console showing step-by-step execution logs.
- [ ] **UIUX-07**: Screen 6 — Evaluation Results screen featuring before-vs-after projection graphs.

## v2 Requirements

### Production Integrations (PROD)

- **PROD-01**: Live API connection to Meta Ads to pause ad groups.
- **PROD-02**: Real WhatsApp API connection to send recovery messages.
- **PROD-03**: Automatic Shopify API sync instead of manual CSV export.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Actual third-party writes | Avoid API complexity and credential management during hackathon evaluation. |
| Multi-tenancy / Team accounts | Keep code focused on core agentic workflow. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INTK-01 | Phase 1 | Pending |
| INTK-02 | Phase 1 | Pending |
| INTK-03 | Phase 2 | Pending |
| CONV-01 | Phase 1 | Pending |
| CONV-02 | Phase 2 | Pending |
| CONV-03 | Phase 2 | Pending |
| REAS-01 | Phase 3 | Pending |
| REAS-02 | Phase 3 | Pending |
| REAS-03 | Phase 3 | Pending |
| EXEC-01 | Phase 4 | Pending |
| EXEC-02 | Phase 4 | Pending |
| EXEC-03 | Phase 4 | Pending |
| EVAL-01 | Phase 5 | Pending |
| EVAL-02 | Phase 5 | Pending |
| UIUX-01 | Phase 1 | Pending |
| UIUX-02 | Phase 1 | Pending |
| UIUX-03 | Phase 2 | Pending |
| UIUX-04 | Phase 3 | Pending |
| UIUX-05 | Phase 3 | Pending |
| UIUX-06 | Phase 4 | Pending |
| UIUX-07 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-19*
*Last updated: 2026-05-19 after initial definition*

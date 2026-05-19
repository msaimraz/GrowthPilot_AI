# Phase 1: Foundation & Intake System - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Initialize the React Native Expo app, configure Convex schema, and build the initial report intake and demo data selector UI.

</domain>

<decisions>
## Implementation Decisions

### App Setup & Navigation
- **D-01:** Use `expo-router` for modern file-based routing.
- **D-02:** Implement tab-based navigation for the primary screens (Upload, Dashboard, Actions, Simulation, Results).

### Theme & Styling
- **D-03:** Custom dark theme using vanilla React Native `StyleSheet`. Define colors, margins, fonts, and spacing tokens in `constants/theme.ts` (slate/charcoal background `#0F172A`, cyan/teal accents `#0EA5E9` and `#14B8A6`, text colors `#F8FAFC` and `#94A3B8`).
- **D-04:** Use Outfit or Inter custom fonts (via Google Fonts or standard Expo font loading).

### Intake & Upload Strategy
- **D-05:** Implement React Native Expo `DocumentPicker` for CSV and PDF upload capabilities.
- **D-06:** Provide a prominent "Demo Dataset" card selector featuring a pre-populated dataset (e.g., "Karachi Checkout Conversion Drop" containing Meta Ads + Shopify CSV stats) to bypass manual uploads.

### Realtime Backend Integration (Convex)
- **D-07:** Create a basic Convex schema in `convex/schema.ts` defining `uploads` (storing file metadata and content) and `runs` (storing state machine execution status).

### the agent's Discretion
- Choice of specific styling names/structures in `constants/theme.ts`.
- Exact design of upload success animation and mock file parser library.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Overview
- `GrowthPilot AI.md` — Detailed product brief and system flow requirements.
- `.planning/PROJECT.md` — Core value, active requirements list, and constraints.
- `.planning/REQUIREMENTS.md` — Requirement checklist mapped to phase deliverables.
- `.planning/ROADMAP.md` — Phase detail success criteria and plan structures.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project starting from scratch).

### Established Patterns
- None.

### Integration Points
- This is the initial entry point.

</code_context>

<deferred>
## Deferred Ideas

- Full automated parsing using external AI APIs — Deferred to Phase 3.
- Actual third-party integrations (WhatsApp, CRM) — Out of scope.

</deferred>

---

*Phase: 01-foundation-intake-system*
*Context gathered: 2026-05-19*

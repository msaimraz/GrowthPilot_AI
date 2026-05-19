GrowthPilot AI — Detailed Team Brief
AISeekho2026 Antigravity Hackathon — Challenge 1 Strategy Document
1. Executive Summary
Project Name: GrowthPilot AI
Category: Challenge 1 — Autonomous Content-to-Action Agent
Goal: Build an autonomous AI growth employee that helps businesses turn reports and business
data into insights, decisions, actions, and measurable outcomes.
One-line pitch:
Businesses upload reports (marketing, sales, customer feedback, analytics), and the AI identifies
problems, reasons about root causes, recommends actions, simulates execution, and predicts
business impact.
2. Why We Are Choosing This Idea
We selected this idea because it balances hackathon-winning potential and SaaS viability. It
strongly aligns with Challenge 1 requirements while remaining realistic to build within a hackathon
timeline. The idea demonstrates clear agentic behavior instead of acting like a simple AI
summarizer.
Why this is a strong hackathon project:
• Strong fit for Challenge 1 scoring criteria
• Easy to demonstrate end-to-end agentic workflow
• Easy to simulate realistic actions
• Strong visual demo potential
• Can be built quickly using AI-assisted development
• Strong SaaS expansion potential after hackathon
3. Problem Statement
Businesses are overloaded with marketing dashboards, ad reports, analytics, customer complaints,
and sales data — but they often do not know what actions to take next. Current tools mostly
summarize information or show dashboards. Businesses need decision-making and execution
support.
What problem are we solving?
We are building an AI growth employee that can observe business data, reason about problems,
decide what to do, simulate execution, and evaluate expected outcomes.
4. Core Workflow
Observe → Reason → Decide → Act → Evaluate
This workflow is important because judges explicitly want evidence of agentic behavior instead of
simple summarization.
Example Flow:
1. Business uploads report (CSV/PDF/dashboard/customer feedback)
2. AI detects business problem
3. AI explains why the problem matters
4. AI recommends actions
5. AI simulates execution
6. AI predicts outcome and shows before vs after
5. Example Business Scenario
Input:
Meta Ads Report + Shopify Sales Data + Customer Feedback
Insight:
Karachi traffic increased by 40%, but checkout conversion dropped by 22%.
Reasoning:
AI detects high mobile bounce rate and multiple customer complaints regarding checkout issues.
Recommended Actions:
1. Pause underperforming ad group
2. Launch abandoned cart recovery campaign
3. Offer limited-time coupon
4. Improve checkout CTA
Action Simulation:
✓ WhatsApp campaign drafted
✓ Customer segment created
✓ CRM updated
✓ Offer generated
Projected Outcome:
Expected conversion improvement from 1.4% → 2.1%
Estimated revenue increase: PKR 180,000/month
6. Multi-Agent Architecture
Judges want proof of agentic reasoning. We will explicitly show multiple agents in the system.
1. Intake Agent
Reads uploaded files (PDF, CSV, analytics reports, dashboards). Extracts KPIs and signals.
2. Insight Agent
Detects anomalies, performance issues, trends, and opportunities.
3. Root Cause Agent
Reasons about why business performance changed.
4. Strategy Agent
Ranks and recommends business actions based on impact and confidence.
5. Execution Agent
Simulates execution including CRM updates, WhatsApp drafts, campaign generation, and customer
segmentation.
6. Evaluation Agent
Shows projected business outcome and before-vs-after impact.
7. Mobile App Strategy
A mobile app is mandatory for the hackathon. We will build using React Native with Expo to
maximize development speed.
Screen 1 — Upload
Upload CSV/PDF or select demo dataset.
Screen 2 — AI Agent Timeline
Shows live agent reasoning and workflow.
Screen 3 — Insights Dashboard
Displays anomalies and business problems.
Screen 4 — Recommended Actions
Shows ranked recommendations.
Screen 5 — Action Simulation
Displays simulated workflow execution logs.
Screen 6 — Results
Shows before vs after business impact.
8. Tech Stack
Frontend: React Native + Expo
Backend: Node.js / Next.js API
Database: Supabase
AI Orchestration: Google Antigravity (core requirement)
LLM: Gemini / OpenAI
Charts: Recharts or Victory Native
File Processing: PDF parser + CSV parser
9. Hackathon Requirement Checklist
✓ Mobile App Prototype (Mandatory)
✓ Agentic Workflow
✓ Action Simulation
✓ Antigravity Traces / Logs
✓ Demo Video
✓ README / Documentation
✓ Baseline Comparison
✓ Failure / Fallback Case
✓ Cost and Scalability Notes
10. Failure & Edge Cases
Example failure scenarios:
1. Missing Data
AI fallback to historical trend estimation.
2. Failed Execution
CRM update fails → fallback to spreadsheet export.
3. Contradictory Data
AI flags inconsistency and lowers confidence score.
11. Baseline Comparison
Basic AI:
'Sales dropped by 22%.'
GrowthPilot AI:
Finds issue → reasons about cause → recommends action → simulates execution → predicts
outcome.
12. Cost & Scalability
Estimated cost per operation: ~$0.02–0.05
Expected latency: 5–10 seconds/report
Scaling approach:
• 10x users → async queues
• 100x users → worker services + caching
13. Suggested Team Roles
Frontend/Product: UI/UX and mobile app
AI/Agent Engineer: Antigravity workflows + prompts
Backend Engineer: APIs and data processing
Demo/Documentation Lead: README, pitch, demo video
14. SaaS Vision After Hackathon
After the hackathon, the product can evolve into a vertical SaaS focused on Shopify stores or
agencies. Instead of generic business intelligence, the positioning will be: “AI Growth Operator for
E-commerce Businesses.”